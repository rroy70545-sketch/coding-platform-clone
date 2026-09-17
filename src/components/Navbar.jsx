import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn =
    localStorage.getItem("codeninja-authenticated") === "true";

  const userData = JSON.parse(
    localStorage.getItem("codeninja-user") || "null"
  );

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("codeninja-authenticated");
    closeMenu();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <GraduationCap size={23} />
          </div>

          <div>
            <div className="text-lg font-extrabold leading-none text-slate-900">
              CodeNinja
            </div>

            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
              Academy
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/courses" className={navLinkClass}>
            <BookOpen size={17} />
            Courses
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard size={17} />
                Dashboard
              </NavLink>

              <NavLink to="/profile" className={navLinkClass}>
                <User size={17} />
                Profile
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              {userData?.name && (
                <span className="max-w-32 truncate text-sm font-medium text-slate-600">
                  Hi, {userData.name}
                </span>
              )}

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <LogIn size={17} />
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <nav className="space-y-2">
            <NavLink
              to="/courses"
              onClick={closeMenu}
              className={navLinkClass}
            >
              <BookOpen size={17} />
              Courses
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={closeMenu}
                  className={navLinkClass}
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={navLinkClass}
                >
                  <User size={17} />
                  Profile
                </NavLink>
              </>
            )}
          </nav>

          <div className="mt-4 border-t border-slate-100 pt-4">
            {isLoggedIn ? (
              <>
                {userData?.name && (
                  <p className="mb-3 text-sm font-medium text-slate-500">
                    Signed in as{" "}
                    <span className="font-bold text-slate-800">
                      {userData.name}
                    </span>
                  </p>
                )}

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <LogIn size={17} />
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;