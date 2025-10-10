import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

 const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [{ role: "user", content: prompt }],
  max_completion_tokens:150
});
    return Response.json({
      response: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return Response.json(
      { response: "AI request failed", error: error.message },
      { status: 400 }
    );
  }
}
