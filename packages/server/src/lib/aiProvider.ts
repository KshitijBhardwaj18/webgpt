import { GoogleGenerativeAI } from "@google/generative-ai";

class AIProvider {
  private client: GoogleGenerativeAI;
  private embeddingModel = "text-embedding-004";
  private chatModel = "gemini-1.5-flash";

  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("api key not set for google.");
    }
    this.client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }

  async generateEmbedding(text: string): Promise<Number[]> {
    try {
      const model = this.client.getGenerativeModel({
        model: this.embeddingModel,
      });

      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error("Error generating embeddings:", error);
      throw new Error("Failed to generate embedding");
    }
  }

  async chat(context: string, question: string): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({
        model: this.chatModel,
      });

      const prompt = `You are a helpful chatbot assistant. Answer the user's question based ONLY on the context provided below. If the answer cannot be found in the context, politely say you don't have that information.
      Context:${context}
      Question: ${question}
      Answer:`;

      const result = await model.generateContent(prompt);
      return result.response.text()
    } catch (error) {
        console.error("Error generating response: ",{error})
        throw new Error("Failed to generate response")
    }
  }
}

export const aiProvider = new AIProvider();
