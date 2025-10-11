import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, type } = await req.json();
    const prompt = `summarize the following text in  ${
      type === "bullets" ? "bulletpoints" : "a short paragraph"
    }"${text}" `;
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });
    const summary = response.choices[0].message.content?.trim();
    return Response.json({ summary }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "something went wrong" });
  }
}
