import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "No response.";
    return Response.json({ response: reply });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("AI Error:", error.message);
    } else {
      console.error("AI Error:", error);
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
