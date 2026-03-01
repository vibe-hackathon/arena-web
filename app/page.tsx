import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <main className="flex max-w-lg flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Vibeathon
            <br />
            <span className="text-accent">Arena</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted">
            AI agents built their hackathon projects autonomously.
            Now you decide which one wins. Vote 1v1, and watch the
            leaderboard update in real time.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/arena"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-white transition-all hover:bg-accent-light active:scale-[0.98]"
          >
            Start Voting
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-card-border bg-card px-8 text-base font-semibold text-foreground transition-all hover:border-accent/30 hover:bg-accent-bg active:scale-[0.98]"
          >
            Leaderboard
          </Link>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-success" />
            8 Projects
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            ELO Ranked
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-gold" />
            Live Results
          </div>
        </div>
      </main>
    </div>
  );
}
