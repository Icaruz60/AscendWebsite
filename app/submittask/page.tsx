// app/submittask/page.tsx
"use client";

import { useState } from "react";

type LifeColumn =
  | "knowledge"
  | "fitness"
  | "wealth"
  | "social"
  | "career"
  | "inner_balance"
  | "environment";

interface XpReward {
  column: LifeColumn;
  xp: number;
}
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmam1odW5od2tpam9sZG9xaHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjUzMzYsImV4cCI6MjA3NjkwMTMzNn0.ti42kU1xg-rbk0CD0K0jhyI2Jmb1TgXTwYtkpkXO3bs";
const EDGE_ADMIN_KEY =
  "ascend_admin_3f7d8c9e98c149a8841cd1bb3a0fdf13e4ff7506c0794cb9a58f1eb258cb961a";
const EDGE_FUNCTION_URL =
  "https://hfjmhunhwkijoldoqhuo.supabase.co/functions/v1/manual-task-template"; // change this

export default function SubmitTaskPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [title, setTitle] = useState("");
  const [coverPrompt, setCoverPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [xpRewards, setXpRewards] = useState<XpReward[]>([
    { column: "knowledge", xp: 10 },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // simple gate, you asked for 187, enjoy your “security”
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "187") {
      setAuthed(true);
      setMessage(null);
    } else {
      setMessage("Wrong password.");
    }
  };

  const updateXpReward = (index: number, field: keyof XpReward, value: any) => {
    setXpRewards((prev) =>
      prev.map((r, i) =>
        i === index
          ? {
              ...r,
              [field]:
                field === "xp" ? Number(value) || 0 : (value as LifeColumn),
            }
          : r
      )
    );
  };

  const addXpReward = () => {
    if (xpRewards.length >= 3) return;
    setXpRewards((prev) => [...prev, { column: "knowledge", xp: 10 }]);
  };

  const removeXpReward = (index: number) => {
    if (xpRewards.length <= 1) return;
    setXpRewards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim() || title.length > 80) {
      setMessage("Title is required and must be <= 80 characters.");
      return;
    }
    if (!coverPrompt.trim()) {
      setMessage("Please provide a cover prompt.");
      return;
    }
    if (!description.trim() || description.length > 220) {
      setMessage("Description is required and must be <= 220 characters.");
      return;
    }

    if (xpRewards.length < 1 || xpRewards.length > 3) {
      setMessage("You must have 1–3 XP rewards.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ascend-admin-key": EDGE_ADMIN_KEY,
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          frequency,
          cover_prompt: coverPrompt.trim(),
          xp_rewards: xpRewards,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Edge error:", data);
        setMessage(`Error: ${data.error || "Unknown error"}`);
      } else {
        setMessage("Task created successfully.");
        // reset but keep frequency
        setTitle("");
        setDescription("");
        setXpRewards([{ column: "knowledge", xp: 10 }]);
      }
    } catch (err: any) {
      console.error(err);
      setMessage(`Network error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-neutral-900 p-6 rounded-xl shadow-lg flex flex-col gap-4 w-full max-w-xs"
        >
          <h1 className="text-xl font-semibold text-center">
            Ascend Admin Login
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 outline-none"
            placeholder="Enter password"
          />
          <button
            type="submit"
            className="mt-2 w-full py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-sm font-medium"
          >
            Enter
          </button>
          {message && (
            <p className="text-xs text-red-400 text-center mt-1">{message}</p>
          )}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex justify-center py-10">
      <div className="w-full max-w-xl px-4">
        <h1 className="text-2xl font-semibold mb-4">Create Ascend Task</h1>

        {message && (
          <div className="mb-4 text-sm">
            <span>{message}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value === "weekly" ? "weekly" : "daily")
              }
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">
              Title ({title.length}/80)
            </label>
            <input
              type="text"
              value={title}
              maxLength={80}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md"
            />
            <label className="block text-sm font-medium mb-1">
              Cover prompt (for the image)
            </label>
            <input
              type="text"
              value={coverPrompt}
              onChange={(e) => setCoverPrompt(e.target.value)}
              maxLength={120}
              placeholder="Cozy study nook at sunrise"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Description ({description.length}/220)
            </label>
            <textarea
              value={description}
              maxLength={220}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md resize-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">XP Rewards (1–3)</label>
            <div className="space-y-2">
              {xpRewards.map((reward, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-md"
                >
                  <select
                    value={reward.column}
                    onChange={(e) =>
                      updateXpReward(idx, "column", e.target.value)
                    }
                    className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-md text-sm"
                  >
                    <option value="knowledge">Knowledge</option>
                    <option value="fitness">Fitness</option>
                    <option value="wealth">Wealth</option>
                    <option value="social">Social</option>
                    <option value="career">Career</option>
                    <option value="inner_balance">Inner balance</option>
                    <option value="environment">Environment</option>
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={reward.xp}
                    onChange={(e) =>
                      updateXpReward(idx, "xp", Number(e.target.value))
                    }
                    className="w-20 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-md text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeXpReward(idx)}
                    disabled={xpRewards.length <= 1}
                    className="text-xs text-red-400 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {xpRewards.length < 3 && (
              <button
                type="button"
                onClick={addXpReward}
                className="mt-2 text-xs text-indigo-400"
              >
                + Add XP reward
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-sm font-medium"
          >
            {loading ? "Submitting..." : "Create task"}
          </button>
        </form>
      </div>
    </main>
  );
}
