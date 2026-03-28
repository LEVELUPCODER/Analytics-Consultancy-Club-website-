import { Link } from "react-router-dom";

const PROJECTS = [
  {
    title: "IPL 2026 Match Prediction Engine",
    tag: "Sports Analytics",
    summary:
      "Data-driven upcoming match outcome predictions using team form, venue context, player impact, and probabilistic modeling.",
    href: "/projects/ipl-2026",
    cta: "Open Project",
  },
];

function ProjectsPage() {
  return (
    <div className="bg-surface text-white min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-white/30 text-xs tracking-[0.3em] uppercase font-medium">
            Our Work
          </span>
          <h1 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Projects
          </h1>
          <p className="mt-5 text-white/40 text-base md:text-lg leading-relaxed">
            Explore applied analytics initiatives by ACC where we transform
            real-world data into measurable outcomes.
          </p>
        </div>

        <div className="mt-14 grid gap-6">
          {PROJECTS.map((project) => (
            <article
              key={project.title}
              className="glass-card rounded-3xl p-7 md:p-10 border border-white/10 transition-all duration-500 hover:border-white/20"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <span className="text-[11px] tracking-[0.2em] uppercase border border-white/10 rounded-full px-3 py-1 text-white/40">
                    {project.tag}
                  </span>
                  <h2 className="mt-4 font-heading text-2xl md:text-3xl font-bold text-white">
                    {project.title}
                  </h2>
                  <p className="mt-3 text-white/40 max-w-3xl leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <Link
                  to={project.href}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white text-black rounded-full font-semibold text-sm tracking-wide hover:bg-white/90 transition-all"
                >
                  {project.cta}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
