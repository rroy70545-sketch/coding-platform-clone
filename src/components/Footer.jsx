import {
  ArrowUp,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <GraduationCap size={24} />
              </div>

              <div>
                <div className="text-xl font-extrabold text-white">
                  CodeNinja
                </div>

                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  Academy
                </div>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Learn programming and technology through structured courses,
              practical lessons, quizzes and projects designed to help you
              build useful skills.
            </p>

            {/* Social Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-xs font-extrabold text-slate-400 transition hover:border-blue-500 hover:text-blue-400"
              >
                GH
              </button>

              <button
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-xs font-extrabold text-slate-400 transition hover:border-blue-500 hover:text-blue-400"
              >
                in
              </button>

              <button
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-xs font-extrabold text-slate-400 transition hover:border-blue-500 hover:text-blue-400"
              >
                IG
              </button>

              <button
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-xs font-extrabold text-slate-400 transition hover:border-blue-500 hover:text-blue-400"
              >
                f
              </button>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Platform
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                to="/courses"
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-400"
              >
                <BookOpen size={15} />
                Courses
              </Link>

              <Link
                to="/dashboard"
                className="block text-sm text-slate-400 transition hover:text-blue-400"
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="block text-sm text-slate-400 transition hover:text-blue-400"
              >
                Profile
              </Link>

              <Link
                to="/signup"
                className="block text-sm text-slate-400 transition hover:text-blue-400"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Learning */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Learning
            </h3>

            <div className="mt-5 space-y-3">
              <p className="text-sm text-slate-400">
                Data Structures
              </p>

              <p className="text-sm text-slate-400">
                Web Development
              </p>

              <p className="text-sm text-slate-400">
                Artificial Intelligence
              </p>

              <p className="text-sm text-slate-400">
                Cybersecurity
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-5 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CodeNinja Academy. All rights
            reserved.
          </p>

          <div className="flex items-center gap-5">
            <span className="text-xs text-slate-500">
              Learn • Practice • Build
            </span>

            <button
              onClick={scrollToTop}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
              aria-label="Back to top"
            >
              <ArrowUp size={17} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;