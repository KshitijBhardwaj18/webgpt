import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { CreateChabotRequest } from "../interfaces/chatbot";
import { prisma } from "../lib/db";
import { Request, Response } from "express";

const router = Router();

router.get("/");

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



export default router;
