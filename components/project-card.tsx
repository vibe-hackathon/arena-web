import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  label: string;
}

export function ProjectCard({ project, label }: ProjectCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-card-border bg-card p-5 shadow-sm transition-all">
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-accent-bg px-2.5 py-1 text-xs font-semibold text-accent">
          {label}
        </span>
      </div>
      <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-gradient-to-br from-accent-bg to-card-border">
        <div className="flex h-full items-center justify-center text-4xl font-bold text-accent/20">
          {project.title[0]}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
        <p className="text-sm font-medium text-accent">{project.tagline}</p>
        <p className="text-sm leading-relaxed text-muted">
          {project.description}
        </p>
      </div>
    </div>
  );
}
