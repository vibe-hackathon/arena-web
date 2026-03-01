"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface LeaderboardProject {
  id: string;
  title: string;
  tagline: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
}

export default function LeaderboardPage() {
  const [projects, setProjects] = useState<LeaderboardProject[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    setProjects(data.projects);
    setTotalVotes(data.totalVotes);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const medalColors: Record<number, string> = {
    0: "text-gold",
    1: "text-silver",
    2: "text-bronze",
  };

  const medalLabels: Record<number, string> = {
    0: "1st",
    1: "2nd",
    2: "3rd",
  };

  if (loading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-muted">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-2xl flex-col px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-sm text-muted">
            Rankings updated after every vote
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-accent-bg px-3 py-1.5 text-sm font-semibold text-accent">
            {totalVotes} votes
          </span>
          <Link
            href="/arena"
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-accent-light"
          >
            Vote
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {projects.map((project, i) => (
          <div
            key={project.id}
            className={`flex items-center gap-4 rounded-xl border border-card-border bg-card p-4 transition-all ${
              i < 3 ? "shadow-sm" : ""
            }`}
          >
            <div className="flex w-10 shrink-0 items-center justify-center">
              {i < 3 ? (
                <span className={`text-lg font-bold ${medalColors[i]}`}>
                  {medalLabels[i]}
                </span>
              ) : (
                <span className="text-sm font-semibold text-muted">
                  #{i + 1}
                </span>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm font-bold text-foreground">
                {project.title}
              </span>
              <span className="truncate text-xs text-muted">
                {project.tagline}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-4 text-xs">
              <div className="hidden flex-col items-center sm:flex">
                <span className="font-semibold text-success">
                  {project.wins}W
                </span>
                <span className="text-muted">{project.losses}L</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base font-bold text-foreground">
                  {project.elo}
                </span>
                <span className="text-muted">ELO</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalVotes === 0 && (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted">
            No votes yet. All projects start at 1000 ELO.
          </p>
          <Link
            href="/arena"
            className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-light"
          >
            Cast your first vote
          </Link>
        </div>
      )}
    </div>
  );
}
