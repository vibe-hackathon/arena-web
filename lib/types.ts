export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
}

export interface ProjectWithElo extends Project {
  elo: number;
  wins: number;
  losses: number;
  draws: number;
}

export type VoteResult = "left" | "right" | "skip";
