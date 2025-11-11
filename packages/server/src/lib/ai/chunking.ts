interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
}

export function chunkText(text: string, options: ChunkOptions = {}) {
  const { chunkSize = 500, overlap = 50 } = options;

  const cleanedText = text.replace(/\s+/g, " ").trim();

  if (cleanedText.length <= chunkSize) {
    return [cleanedText];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < cleanedText.length) {
    let endIndex = startIndex + chunkSize;

    if (endIndex < cleanedText.length) {
      const sentenceEnd = cleanedText
        .substring(startIndex, endIndex)
        .lastIndexOf(".");

      if (sentenceEnd > chunkSize / 2) {
        endIndex = startIndex + sentenceEnd + 1;
      } else {
        let lastSpace = cleanedText
          .substring(startIndex, endIndex)
          .lastIndexOf(" ");

        if (lastSpace > chunkSize / 2) {
          endIndex = startIndex + lastSpace;
        }
      }
    }
    const chunk = cleanedText.substring(startIndex, endIndex).trim();
    if (chunk) {
      chunks.push(chunk);
    }

    startIndex = endIndex - overlap;

    if (startIndex > cleanedText.length - overlap) {
      break;
    }
  }
  return chunks;
}

