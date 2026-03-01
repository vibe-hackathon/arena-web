"use client";

import { ProjectCard } from "@/components/project-card";
import { useState, useEffect, useCallback } from "react";
import { Project, VoteResult } from "@/lib/types";
import Link from "next/link";

export default function ArenaPage() {
  const [left, setLeft] = useState<Project | null>(null);
  const [right, setRight] = useState<Project | null>(null);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  const fetchPair = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/pair");
    const data = await res.json();
    setLeft(data.left);
    setRight(data.right);
    setLoading(false);
  }, []);

  const fetchVoteCount = useCallback(async () => {
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    setTotalVotes(data.totalVotes);
  }, []);

  useEffect(() => {
    fetchPair();
    fetchVoteCount();
  }, [fetchPair, fetchVoteCount]);

  const handleVote = async (result: VoteResult) => {
    if (animating || !left || !right) return;
    setAnimating(true);

    await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leftId: left.id, rightId: right.id, result }),
    });

    setTotalVotes((v) => v + 1);
    setTimeout(async () => {
      await fetchPair();
      setAnimating(false);
    }, 300);
  };

  if (loading && !left) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-muted">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-4xl flex-col px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Which project is better?
          </h1>
          <p className="text-sm text-muted">
            Compare two projects and pick your favorite
          </p>
        </div>
        <Link
          href="/leaderboard"
          className="rounded-lg bg-accent-bg px-3 py-1.5 text-sm font-semibold text-accent"
        >
          {totalVotes} votes
        </Link>
      </div>

      <div
        className={`grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 transition-opacity duration-200 ${
          animating ? "opacity-40" : "opacity-100"
        }`}
      >
        {left && <ProjectCard project={left} label="A" />}
        {right && <ProjectCard project={right} label="B" />}
      </div>

      <div className="sticky bottom-0 mt-6 flex gap-3 bg-background pb-6 pt-4">
        <button
          onClick={() => handleVote("left")}
          disabled={animating}
          className="flex-1 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-light active:scale-[0.98] disabled:opacity-50"
        >
          A is better
        </button>
        <button
          onClick={() => handleVote("skip")}
          disabled={animating}
          className="rounded-xl border border-card-border bg-card px-5 py-3.5 text-sm font-semibold text-muted transition-all hover:border-accent/30 hover:text-foreground active:scale-[0.98] disabled:opacity-50"
        >
          Tie
        </button>
        <button
          onClick={() => handleVote("right")}
          disabled={animating}
          className="flex-1 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-light active:scale-[0.98] disabled:opacity-50"
        >
          B is better
        </button>
      </div>
    </div>
  );
}
