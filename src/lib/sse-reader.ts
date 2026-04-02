/**
 * Reads an SSE (text/event-stream) response and yields parsed JSON objects.
 * Handles chunk splitting correctly by buffering partial lines across reads.
 */
export async function* readSSEStream<T = Record<string, string>>(
  response: Response
): AsyncGenerator<T> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process only complete lines (terminated by \n)
      const lines = buffer.split("\n");
      // Last element is either empty (line ended with \n) or a partial line
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") continue;

        try {
          yield JSON.parse(data) as T;
        } catch {
          // Skip malformed JSON (rare now that buffering handles split chunks)
        }
      }
    }

    // Process any remaining buffer after stream ends
    if (buffer.startsWith("data: ")) {
      const data = buffer.slice(6);
      if (data !== "[DONE]") {
        try {
          yield JSON.parse(data) as T;
        } catch {
          // Skip malformed
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
