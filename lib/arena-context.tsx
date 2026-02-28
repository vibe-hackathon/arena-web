"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { ProjectWithElo, VoteResult } from "@/lib/types";
import { getInitialRankings, getRandomPair, applyVote } from "@/lib/elo";

interface ArenaContextType {
  projects: ProjectWithElo[];
  currentPair: [ProjectWithElo, ProjectWithElo] | null;
  totalVotes: number;
  vote: (result: VoteResult) => void;
  nextPair: () => void;
}

const ArenaContext = createContext<ArenaContextType | null>(null);

export function ArenaProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectWithElo[]>(
    getInitialRankings()
  );
  const [currentPair, setCurrentPair] = useState<
    [ProjectWithElo, ProjectWithElo] | null
  >(() => getRandomPair(getInitialRankings()));
  const [totalVotes, setTotalVotes] = useState(0);

  const nextPair = useCallback(() => {
    setProjects((prev) => {
      const pair = getRandomPair(prev);
      setCurrentPair(pair);
      return prev;
    });
  }, []);

  const vote = useCallback(
    (result: VoteResult) => {
      if (!currentPair) return;
      setProjects((prev) => {
        const updated = applyVote(
          prev,
          currentPair[0].id,
          currentPair[1].id,
          result
        );
        // schedule next pair after state update
        setTimeout(() => {
          const pair = getRandomPair(updated);
          setCurrentPair(pair);
        }, 0);
        return updated;
      });
      setTotalVotes((v) => v + 1);
    },
    [currentPair]
  );

  return (
    <ArenaContext.Provider
      value={{ projects, currentPair, totalVotes, vote, nextPair }}
    >
      {children}
    </ArenaContext.Provider>
  );
}

export function useArena() {
  const ctx = useContext(ArenaContext);
  if (!ctx) throw new Error("useArena must be used within ArenaProvider");
  return ctx;
}
