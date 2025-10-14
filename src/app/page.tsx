"use client";

import { useState } from "react";

export default function Home() {
  
  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<string>("paragraph");
  const [summary, setSummary] = useState<string>("");
  const [text, setText] = useState<string>("");

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      alert("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setSummary("");

    try {

      const response = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });

      const data = await response.json();

      if (data.summary) {
        setSummary(data.summary);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error generating summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          🧠 AI Text Summarizer
        </h1>

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to summarize..."
            className="border p-3 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="bullets">Bullet Points</option>
            <option value="paragraph">Short Paragraph</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600  text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Summarizing..." : "Submit"}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {summary && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Summary:</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
