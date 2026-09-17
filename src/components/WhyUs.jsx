import {
  Award,
  BookOpenCheck,
  Code2,
  Lightbulb,
  Rocket,
  Target,
} from "lucide-react";

const features = [
  {
    icon: BookOpenCheck,
    title: "Structured Learning",
    description:
      "Follow organized lessons designed to take you from fundamentals to practical skills.",
  },
  {
    icon: Code2,
    title: "Practical Coding",
    description:
      "Strengthen your knowledge by working through coding concepts and real-world projects.",
  },
  {
    icon: Target,
    title: "Track Your Progress",
    description:
      "Monitor completed lessons, course progress and quiz performance from your dashboard.",
  },
  {
    icon: Award,
    title: "Earn Certificates",
    description:
      "Complete courses and generate certificates to recognize your learning achievements.",
  },
];

function WhyUs() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Rocket size={15} />
            Why CodeNinja?
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need to Keep Learning
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            A simple learning experience that helps you learn new concepts,
            practice your skills and keep track of your progress.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={23} />
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-5 h-1 w-10 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-16" />
              </div>
            );
          })}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-slate-900 px-6 py-8 sm:px-10">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Lightbulb size={24} />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-white">
                  Learn by doing
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Turn concepts into practical skills through consistent
                  practice.
                </p>
              </div>
            </div>

            <div className="text-sm font-bold text-blue-400">
              Learn → Practice → Build
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyUs;