
import { ArrowUpRight, Users } from "lucide-react";

const teamMembers = [
  {
    name: "Alexander Morgan",
    role: "Chief Executive Officer",
    description:
      "Leads the company's strategic direction, growth, and long-term vision.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Victoria Bennett",
    role: "Chief Financial Officer",
    description:
      "Oversees financial planning, reporting, and risk management.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "James Anderson",
    role: "Head of Trading",
    description:
      "Oversees trading operations and market research initiatives.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Charlotte Wilson",
    role: "Head of Client Relations",
    description:
      "Focuses on client communication, service, and relationship management.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=85",
  },
];

export default function TeamSection() {
  return (
    <section
      id="team"
      className="relative overflow-hidden bg-[#080d19] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
            <Users className="h-4 w-4" />
            Our People
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Meet the People Behind{" "}
            <span className="text-blue-400">
              Novacrest Capital
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Get to know the professionals whose expertise,
            leadership, and dedication support our operations
            and client experience.
          </p>
        </div>

        {/* Team cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422] transition duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-950/30"
            >
              {/* Staff portrait */}
              <div className="relative aspect-[4/4.2] overflow-hidden bg-slate-800">
                <img
                  src={member.image}
                  alt={`Placeholder portrait for ${member.name}`}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1422] via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                  Leadership Team
                </div>
              </div>

              {/* Staff information */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {member.name}
                    </h3>

                    <p className="mt-1 text-xs font-semibold text-blue-400">
                      {member.role}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition group-hover:border-blue-400/30 group-hover:bg-blue-400/10 group-hover:text-blue-300">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <p className="mt-4 min-h-15 text-sm leading-6 text-slate-400">
                  {member.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom call to action */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:p-8">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Professionalism. Experience. Accountability.
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Meet the people responsible for building and
              supporting our services.
            </p>
          </div>

          <a
            href="#contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Contact Us
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
