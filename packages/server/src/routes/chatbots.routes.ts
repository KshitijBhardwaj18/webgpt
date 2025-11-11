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

const router = Router();

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
      console.log(error)
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

export default router;
