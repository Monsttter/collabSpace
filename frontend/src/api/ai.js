import api from "./api";

export async function generateAI({ prompt, context, documentContent }) {
  const result = await api(`/ai/generate`, {
    method: "POST",
    body: JSON.stringify({
      prompt,
      context,
      documentContent
    }),
  });

  console.log(result);

  return result;
}
