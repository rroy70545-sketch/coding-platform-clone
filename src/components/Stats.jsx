import {
  BookOpen,
  GraduationCap,
  Layers3,
  Star,
} from "lucide-react";

const stats = [
  {
    value: "8+",
    label: "Courses",
    description: "Career-focused courses",
    icon: BookOpen,
  },
  {
    value: "10K+",
    label: "Learners",
    description: "Students learning with us",
    icon: GraduationCap,
  },
  {
    value: "40+",
    label: "Lessons",
    description: "Structured learning content",
    icon: Layers3,
  },
  {
    value: "4.8",
    label: "Average Rating",
    description: "Loved by our learners",
    icon: Star,
  },
];

function Stats() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-lg"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:scale-110">
                  <Icon size={23} />
                </div>

                <h3 className="mt-4 text-3xl font-extrabold text-slate-900">
                  {stat.value}
                </h3>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {stat.label}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Stats;