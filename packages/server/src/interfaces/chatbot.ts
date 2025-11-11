import { Prisma } from "@prisma/client";

export interface ChatbotSettings extends Prisma.JsonObject {
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface CreateChabotRequest {
  name: string;
  projectId: string;
  description?: string;
  settings?: ChatbotSettings;
}

export interface GetUserChatbotsRequest{
    projectId:string
}

export interface ChatbotUpdateRequest {
  name: string;
  projectId: string;
  description?: string;
  settings?: ChatbotSettings;
}