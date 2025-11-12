import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  ChatbotUpdateRequest,
  CreateChabotRequest,
  GetUserChatbotsRequest,
} from "../interfaces/chatbot";
import { prisma } from "../lib/db";
import { Request, Response } from "express";
import { success } from "better-auth/*";
import { CreateTextSnippetDataSource } from "../interfaces/dataSources";
import { DataSourceStatus } from "@prisma/client";
import { chunkText } from "../lib/ai/chunking";
import { aiProvider } from "../lib/ai/provider";

const router = Router();

/// Chatbot routes

router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { projectId }: GetUserChatbotsRequest = req.body;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          memberships: {
            some: {
              userId: req.user!.id,
            },
          },
        },
      },
    });

    if (!project) {
      return res
        .status(404)
        .json({ error: "Project not found or access denied" });
    }

    const chatbots = await prisma.chatbot.findMany({
      where: {
        projectId,
      },
    });

    res.status(201).json({ success: "Fetched successfully", data: chatbots });
  } catch (error) {}
});

router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { name, description, projectId, settings }: CreateChabotRequest =
      req.body;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          memberships: {
            some: {
              userId: req.user!.id,
            },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        error: "Not authorised to access this project or project do not exist",
      });
    }

    const chatbot = prisma.chatbot.create({
      data: {
        name,
        projectId,
        ...(description !== undefined ? { description } : {}),
        ...(settings !== undefined ? { settings } : {}),
      },
    });
  } catch (error) {
    console.log("error occured in create chatbot handler: ", error);
  }
});

router.get(
  "/:chatbotId",
  requireAuth,
  async (req: Request<{ chabotId: string }>, res: Response) => {
    try {
      const { projectId } = req.body;
      const chatbotId = req.params.chabotId;

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          workspace: {
            memberships: {
              some: {
                userId: req.user!.id,
              },
            },
          },
        },
      });

      if (!project) {
        return res
          .status(404)
          .json({ error: "Project not found or access denied" });
      }

      const chatbot = await prisma.chatbot.findUnique({
        where: {
          id: chatbotId,
        },
      });

      if (!chatbot) {
        return res.status(404).json({ error: "Chatbot not found" });
      }

      return res
        .status(201)
        .json({ success: "Chatbot fetched", data: chatbot });
    } catch (error) {
      console.log(error);
    }
  }
);

// there is a bug here
router.patch(
  "/:chatbotId",
  requireAuth,
  async (req: Request<{ chatbotId: string }>, res: Response) => {
    try {
      const chabotId = req.params.chatbotId;

      const request: ChatbotUpdateRequest = req.body;

      const project = await prisma.project.findFirst({
        where: {
          id: request.projectId,
          workspace: {
            memberships: {
              some: {
                userId: req.user!.id,
              },
            },
          },
        },
      });

      if (!project) {
        return res
          .status(404)
          .json({ error: "Project not found or access denied" });
      }

      const chatbot = await prisma.chatbot.update({
        where: {
          id: chabotId,
        },
        data: request,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.delete(
  "/:chatbotId",
  requireAuth,
  async (req: Request<{ chatbotId: string }>, res: Response) => {
    try {
      const chatbotId = req.params.chatbotId;
      const { projectId } = req.body;

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          workspace: {
            memberships: {
              some: {
                userId: req.user!.id,
              },
            },
          },
        },
      });

      if (!project) {
        return res
          .status(404)
          .json({ error: "Project not found or access denied" });
      }

      const chatbot = await prisma.chatbot.delete({
        where: {
          id: chatbotId,
        },
      });

      if (!chatbot) {
        res.status(404).json({ error: "failed to delete chatbot" });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

// Data sources routes

router.post(
  "/:chatbotId/datasources",
  requireAuth,
  async (req: Request<{ chatbotId: string }>, res: Response) => {
    const chatbotId = req.params.chatbotId;
    const data: CreateTextSnippetDataSource = req.body;

    try {
      const project = await prisma.project.findFirst({
        where: {
          id: data.projectId,
        },
      });

      if (!project) {
        return res
          .status(404)
          .json({ error: "Project not found or access. denied." });
      }

      const dataSource = await prisma.dataSource.create({
        data: {
          content: data.content,
          metadata: data.metadata,
          dataSourceType: data.dataSourceType,
          chatbotId: chatbotId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
);

// train chatbot route

router.post(
  "/chatbot/:chatbotId/train",
  requireAuth,
  async (req: Request, res: Response) => {
    const { projectId } = req.body;
    const chatbotId = req.params;

    try {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        return res
          .status(404)
          .json({ error: "Project not found or access denied" });
      }

      const pendingSources = await prisma.dataSource.findMany({
        where: {
          chatbotId: chatbotId,
          status: DataSourceStatus.PENDING,
        },
      });

      if (pendingSources.length === 0) {
        return res
          .status(403)
          .json({ error: "No pending data sources to train" });
      }

      await prisma.dataSource.updateMany({
        where: {
          id: { in: pendingSources.map((s) => s.id) },
        },
        data: { status: DataSourceStatus.PROCESSING },
      });

      let processedCount = 0;
      let failedCount = 0;

      for (const source of pendingSources) {
        try {
          if (source.dataSourceType == "TEXTSNIPPET") {
            const snippet = (source.content as any)?.snippet || "";
            if (!snippet) {
              throw new Error("No snippet found");
            }
            const chunks = chunkText(snippet, { chunkSize: 500, overlap: 50 });

            console.log(
              `Processing ${chunks.length} chunks for source ${source.id}`
            );

            for (const chunk of chunks) {
              const embedding = await aiProvider.generateEmbedding(chunk);
              await prisma.$executeRaw`
             INSERT INTO "Embedding" (id, "dataSourceId", content, vector, "createdAt")
            VALUES (
             gen_random_uuid()::text,
             ${source.id},
             ${chunk},
             ${embedding}::vector,
             NOW()
            )`;
            }
          }

          await prisma.dataSource.update({
            where: { id: source.id },
            data: {
              status: "EMBEDDED",
              processedAt: new Date(),
            },
          });

          processedCount++;
        } catch (error) {
          console.log(error);

          await prisma.dataSource.update({
            where: { id: source.id },
            data: {
              status: DataSourceStatus.FAILED,
              errorMessage:
                error instanceof Error ? error.message : "Unknown Error",
            },
          });
        }
      }
    } catch (error) {}
  }
);

export default router;
