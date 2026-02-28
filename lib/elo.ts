import { ProjectWithElo, VoteResult } from "./types";
import { MOCK_PROJECTS } from "./mock-data";

const K_FACTOR = 32;
const INITIAL_ELO = 1000;

function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export function calculateElo(
  winnerElo: number,
  loserElo: number,
  isDraw: boolean
): [number, number] {
  const expectedWin = expectedScore(winnerElo, loserElo);
  const expectedLose = expectedScore(loserElo, winnerElo);

  if (isDraw) {
    const newA = Math.round(winnerElo + K_FACTOR * (0.5 - expectedWin));
    const newB = Math.round(loserElo + K_FACTOR * (0.5 - expectedLose));
    return [newA, newB];
  }

  const newWinner = Math.round(winnerElo + K_FACTOR * (1 - expectedWin));
  const newLoser = Math.round(loserElo + K_FACTOR * (0 - expectedLose));
  return [newWinner, newLoser];
}

export function getInitialRankings(): ProjectWithElo[] {
  return MOCK_PROJECTS.map((p) => ({
    ...p,
    elo: INITIAL_ELO,
    wins: 0,
    losses: 0,
    draws: 0,
  }));
}

export function getRandomPair(
  projects: ProjectWithElo[]
): [ProjectWithElo, ProjectWithElo] {
  const shuffled = [...projects].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

export function applyVote(
  projects: ProjectWithElo[],
  leftId: string,
  rightId: string,
  result: VoteResult
): ProjectWithElo[] {
  return projects.map((p) => {
    const left = projects.find((x) => x.id === leftId)!;
    const right = projects.find((x) => x.id === rightId)!;

    if (result === "skip") {
      const [newLeft, newRight] = calculateElo(left.elo, right.elo, true);
      if (p.id === leftId)
        return { ...p, elo: newLeft, draws: p.draws + 1 };
      if (p.id === rightId)
        return { ...p, elo: newRight, draws: p.draws + 1 };
      return p;
    }

    const winnerId = result === "left" ? leftId : rightId;
    const loserId = result === "left" ? rightId : leftId;
    const winner = projects.find((x) => x.id === winnerId)!;
    const loser = projects.find((x) => x.id === loserId)!;
    const [newWinner, newLoser] = calculateElo(winner.elo, loser.elo, false);

    if (p.id === winnerId)
      return { ...p, elo: newWinner, wins: p.wins + 1 };
    if (p.id === loserId)
      return { ...p, elo: newLoser, losses: p.losses + 1 };
    return p;
  });
}
