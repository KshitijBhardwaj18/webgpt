import { Prisma } from "@prisma/client";
import { DataSourceType } from "@prisma/client";

export interface TextSnippetContent extends Prisma.JsonObject {
  title: string;
  snippet: string;
}

export interface TextSnippetMetadata extends Prisma.JsonObject {
  type: string;
}

export interface CreateTextSnippetDataSource {
  projectId: string;
  content: TextSnippetContent;
  metadata: TextSnippetMetadata;
  dataSourceType: DataSourceType;
}
