"use client";
import { useState } from "react";

export default function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorText("");
    if (!message || message.trim().length < 5) {
      setErrorText("Please enter at least 5 characters");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          rating,
          page: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setMessage("");
        setRating(0);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="feedback" className="w-full bg-transparent dark:bg-transparent">
      <div className="py-10 px-4 mx-auto max-w-screen-xl">
        <h2 className="mb-4 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Feedback
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Help us improve. Share your suggestions or issues.
        </p>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Email (optional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Tell us what to improve..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Rating (optional)
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={0}>No rating</option>
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={status === "sending"}
                className={`inline-flex justify-center items-center py-3 px-6 text-sm font-bold text-center text-white rounded-xl bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:ring-violet-300 dark:focus:ring-violet-900 shadow transition-all ${status === "sending" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {status === "sending" ? "Sending..." : "Send Feedback"}
              </button>
            </div>
          </div>
          {errorText && (
            <p className="text-red-600 text-sm">{errorText}</p>
          )}
          {status === "sent" && (
            <p className="text-green-600 text-sm">Thanks! Your feedback was sent.</p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
}
