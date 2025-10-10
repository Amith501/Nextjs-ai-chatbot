"use client";

import { useState, ChangeEvent } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAsk = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data: { response: string } = await res.json();
      setResponse(data.response);
      setCopied(false); // reset copy status
    } catch (error) {
      console.error("Error:", error);
      setResponse("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setPrompt(e.target.value);
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2s
  };

  return (
    <div className="flex flex-col items-center p-10 space-y-4">
      <h1 className="text-2xl font-bold">💬 AI Chat with Next.js (TypeScript)</h1>

      <textarea
        className="border p-2 w-100 rounded-xl shadow-md"
        rows={4}
        value={prompt}
        onChange={handleChange}
        placeholder="Ask me anything..."
      />

      <button
        onClick={handleAsk}
        disabled={loading || !prompt.trim()}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {response && (
        <div className="border p-4 w-200 shadow-md bg-gray-50 rounded-xl relative">
          <strong>Response:</strong>
          <p className="mt-2 whitespace-pre-line">{response}</p>

          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-sm"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
