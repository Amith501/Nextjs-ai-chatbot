import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text, type } = await req.json();

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const prompt = `Summarize the following text in ${
      type === "bullets" ? "bullet points" : "a short paragraph"
    }:\n\n"${text}"`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    const summary =
      response?.choices?.[0]?.message?.content?.trim() ||
      "No summary generated";

    return Response.json({ summary }, { status: 200 });
  } catch (error: unknown) {
    let message = "Something went wrong while summarizing";

    if (error instanceof Error) {
      message = error.message;
    }

    console.error("Error in summary API:", message);

    return Response.json({ error: message }, { status: 500 });
  }
}
