import { Project } from "@/lib/types";
import Image from "next/image";

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
      <div className="aspect-[957/534] w-full overflow-hidden rounded-xl bg-gradient-to-br from-accent-bg to-card-border">
        <Image
          src={project.image}
          alt={project.title}
          width={957}
          height={534}
          className="h-full w-full object-cover"
          unoptimized
        />
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
