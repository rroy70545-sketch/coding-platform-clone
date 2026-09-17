import { ArrowRight, BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        {/* Left Content */}
        <div>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <CheckCircle2 size={17} />
            Learn. Practice. Build. Grow.
          </div>

          {/* Main Heading */}
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Build Your
            <span className="block text-blue-600">
              Coding Skills
            </span>
            With Confidence
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Learn programming, development, AI, cybersecurity, databases and
            more through structured courses, practical lessons, quizzes and
            hands-on projects.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <BookOpen size={19} />
              Explore Courses
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <PlayCircle size={19} />
              Start Learning
            </Link>
          </div>

          {/* Small highlights */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-green-500" />
              Beginner Friendly
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-green-500" />
              Practical Projects
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-green-500" />
              Progress Tracking
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative">
          <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70">
            {/* Window Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                CodeNinja Academy
              </span>
            </div>

            {/* Code Preview */}
            <div className="rounded-2xl bg-slate-900 p-5 font-mono text-sm leading-7 text-slate-300">
              <div>
                <span className="text-purple-400">function</span>{" "}
                <span className="text-blue-400">learn</span>
                <span className="text-white">()</span>
                <span className="text-white"> {"{"}</span>
              </div>

              <div className="pl-5">
                <span className="text-purple-400">const</span>{" "}
                <span className="text-blue-300">skills</span>{" "}
                <span className="text-white">=</span>{" "}
                <span className="text-green-400">
                  ["Code", "Build", "Grow"]
                </span>
                <span className="text-white">;</span>
              </div>

              <div className="pl-5">
                <span className="text-purple-400">return</span>{" "}
                <span className="text-blue-300">skills</span>
                <span className="text-white">;</span>
              </div>

              <div>
                <span className="text-white">{"}"}</span>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Your Learning Journey
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Keep making progress
                  </p>
                </div>

                <div className="rounded-xl bg-blue-100 px-3 py-2 text-sm font-extrabold text-blue-600">
                  75%
                </div>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-3/4 rounded-full bg-blue-600" />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Lessons completed</span>
                <span className="font-bold text-slate-700">
                  Keep going!
                </span>
              </div>
            </div>
          </div>

          {/* Floating card */}
          <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl sm:block lg:-left-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Learn at your pace
                </p>
                <p className="text-xs text-slate-500">
                  Track every milestone
                </p>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -right-2 -top-5 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl sm:block lg:-right-6">
            <div className="text-center">
              <p className="text-xl font-extrabold text-blue-600">8+</p>
              <p className="text-xs font-semibold text-slate-500">
                Courses
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;