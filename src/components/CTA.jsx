import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 shadow-2xl sm:px-10 lg:px-16 lg:py-16">
          {/* Background decoration */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            {/* Content */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-300">
                <GraduationCap size={16} />
                Start Your Journey
              </div>

              <h2 className="max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                Ready to Build Your
                <span className="block text-blue-400">
                  Coding Future?
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                Choose a course, learn at your own pace, practice what you
                learn and track your progress as you grow.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  <BookOpen size={18} />
                  Explore Courses
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-sm font-bold text-white transition hover:border-slate-600 hover:bg-slate-700"
                >
                  Create Free Account
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:flex lg:justify-end">
              <div className="relative h-64 w-64">
                {/* Main circle */}
                <div className="absolute inset-5 flex items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-600 shadow-2xl shadow-blue-900/50">
                    <GraduationCap
                      size={58}
                      strokeWidth={1.6}
                      className="text-white"
                    />
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute right-0 top-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 shadow-xl">
                  <p className="text-xs font-semibold text-slate-400">
                    Courses
                  </p>
                  <p className="text-lg font-extrabold text-white">8+</p>
                </div>

                <div className="absolute bottom-3 left-0 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 shadow-xl">
                  <p className="text-xs font-semibold text-slate-400">
                    Learn
                  </p>
                  <p className="text-sm font-extrabold text-blue-400">
                    At Your Pace
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;