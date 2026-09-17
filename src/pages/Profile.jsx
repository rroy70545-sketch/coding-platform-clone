import { useEffect, useState } from "react";
import courses from "../data/courses";

import {
  User,
  Mail,
  ShieldCheck,
  BookOpen,
  Trophy,
  ArrowLeft,
  Save,
  CheckCircle2,
  Lock,
  KeyRound,
} from "lucide-react";

import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

function Profile() {
  // =====================================================
  // GET SAVED USER
  // =====================================================

  const getSavedUser = () => {
    const savedUser = localStorage.getItem("codeninja-user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  };

  const savedUser = getSavedUser();

  // =====================================================
  // USER
  // =====================================================

  const userId = savedUser?.id;

  const [name, setName] = useState(
    savedUser?.name || "Student"
  );

  const [email, setEmail] = useState(
    savedUser?.email || ""
  );

  // =====================================================
  // PASSWORD
  // =====================================================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  // =====================================================
  // MESSAGES
  // =====================================================

  const [profileMessage, setProfileMessage] =
    useState("");

  const [profileError, setProfileError] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [loadingProfile, setLoadingProfile] =
    useState(false);

  const [loadingPassword, setLoadingPassword] =
    useState(false);

  // =====================================================
  // COURSE PROGRESS
  // =====================================================

  const getCourseProgress = (course) => {
    const savedProgress = localStorage.getItem(
      `course-progress-${course.id}`
    );

    if (!savedProgress) {
      return [];
    }

    try {
      const parsedProgress = JSON.parse(
        savedProgress
      );

      return Array.isArray(parsedProgress)
        ? parsedProgress
        : [];
    } catch {
      return [];
    }
  };

  // =====================================================
  // QUIZ SCORE
  // =====================================================

  const getQuizScore = (course) => {
    const savedScore = localStorage.getItem(
      `quiz-score-${course.id}`
    );

    if (!savedScore) {
      return null;
    }

    try {
      return JSON.parse(savedScore);
    } catch {
      return null;
    }
  };

  // =====================================================
  // COURSE STATISTICS
  // =====================================================

  const courseStats = courses.map((course) => {
    const completedLessons =
      getCourseProgress(course);

    const quizScore =
      getQuizScore(course);

    return {
      completedLessons:
        completedLessons.length,

      totalLessons:
        course.curriculum.length,

      quizCompleted:
        quizScore !== null,
    };
  });

  const totalLessons = courseStats.reduce(
    (total, course) =>
      total + course.totalLessons,
    0
  );

  const completedLessons = courseStats.reduce(
    (total, course) =>
      total + course.completedLessons,
    0
  );

  const coursesStarted =
    courseStats.filter(
      (course) =>
        course.completedLessons > 0
    ).length;

  const quizzesCompleted =
    courseStats.filter(
      (course) =>
        course.quizCompleted
    ).length;

  const overallProgress =
    totalLessons > 0
      ? Math.round(
          (completedLessons /
            totalLessons) *
            100
        )
      : 0;

  // =====================================================
  // LOAD USER FROM BACKEND
  // =====================================================

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await fetch(
          API_URL +
            "/api/users/" +
            userId
        );

        const data =
          await response.json();

        if (
          response.ok &&
          data.success &&
          data.user
        ) {
          setName(data.user.name);
          setEmail(data.user.email);

          const localUser =
            getSavedUser();

          const updatedUser = {
            ...localUser,
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          };

          localStorage.setItem(
            "codeninja-user",
            JSON.stringify(updatedUser)
          );
        }
      } catch (error) {
        console.error(
          "Failed to load user:",
          error
        );
      }
    };

    loadUser();
  }, [userId]);

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleProfileSubmit = async (
    event
  ) => {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    const trimmedName =
      name.trim();

    const trimmedEmail =
      email.trim();

    if (
      !trimmedName ||
      !trimmedEmail
    ) {
      setProfileError(
        "Name and email cannot be empty."
      );
      return;
    }

    if (!userId) {
      setProfileError(
        "User account could not be found."
      );
      return;
    }

    setLoadingProfile(true);

    try {
      const response = await fetch(
        API_URL +
          "/api/users/" +
          userId,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        setProfileError(
          data.message ||
            "Failed to update profile."
        );

        return;
      }

      const currentUser =
        getSavedUser();

      const updatedUser = {
        ...currentUser,
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      };

      localStorage.setItem(
        "codeninja-user",
        JSON.stringify(updatedUser)
      );

      setName(data.user.name);
      setEmail(data.user.email);

      setProfileMessage(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setProfileError(
        "Could not connect to the backend."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handlePasswordSubmit = async (
    event
  ) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!userId) {
      setPasswordError(
        "User account could not be found."
      );
      return;
    }

    if (!currentPassword) {
      setPasswordError(
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword) {
      setPasswordError(
        "Please enter a new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (
      newPassword ===
      currentPassword
    ) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    setLoadingPassword(true);

    try {
      const response = await fetch(
        API_URL +
          "/api/users/" +
          userId +
          "/password",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        setPasswordError(
          data.message ||
            "Failed to change password."
        );

        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage(
        "Password changed successfully!"
      );
    } catch (error) {
      console.error(
        "Password change error:",
        error
      );

      setPasswordError(
        "Could not connect to the backend."
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================
          PROFILE HEADER
      ========================== */}

      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-100 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="mt-6">

            <div className="text-sm font-bold text-blue-100">
              Account
            </div>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-3 max-w-2xl text-blue-100">
              Manage your CodeNinja Academy account
              information.
            </p>

          </div>

        </div>

      </section>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* =========================
            PROFILE CARD
        ========================== */}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 p-6 sm:p-8">

            <div className="flex flex-col items-center gap-5 sm:flex-row">

              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-100 text-4xl font-black text-blue-600">
                {name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="text-center sm:text-left">

                <h2 className="text-2xl font-black text-gray-950">
                  {name || "Student"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Student
                </p>

                {email && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 sm:justify-start">
                    <Mail size={16} />
                    {email}
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* =========================
              EDIT PROFILE
          ========================== */}

          <div className="p-6 sm:p-8">

            <h2 className="text-xl font-black text-gray-950">
              Edit Profile
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your personal information.
            </p>

            {profileMessage && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">

                <CheckCircle2 size={18} />

                {profileMessage}

              </div>
            )}

            {profileError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {profileError}
              </div>
            )}

            <form
              onSubmit={
                handleProfileSubmit
              }
              className="mt-6 space-y-5"
            >

              {/* Full Name */}

              <div>

                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(
                        event.target.value
                      );
                      setProfileMessage("");
                      setProfileError("");
                    }}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(
                        event.target.value
                      );
                      setProfileMessage("");
                      setProfileError("");
                    }}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

              {/* Save */}

              <button
                type="submit"
                disabled={
                  loadingProfile
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Save size={18} />

                {loadingProfile
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </form>

          </div>

        </section>

        {/* =========================
            CHANGE PASSWORD
        ========================== */}

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Lock size={22} />
            </div>

            <div>

              <h2 className="text-xl font-black text-gray-950">
                Change Password
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update your account password.
              </p>

            </div>

          </div>

          {passwordMessage && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">

              <CheckCircle2 size={18} />

              {passwordMessage}

            </div>
          )}

          {passwordError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {passwordError}
            </div>
          )}

          <form
            onSubmit={
              handlePasswordSubmit
            }
            className="mt-6 space-y-5"
          >

            {/* Current Password */}

            <div>

              <label
                htmlFor="current-password"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Current Password
              </label>

              <div className="relative">

                <KeyRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="current-password"
                  type="password"
                  value={
                    currentPassword
                  }
                  onChange={(event) => {
                    setCurrentPassword(
                      event.target.value
                    );
                    setPasswordMessage("");
                    setPasswordError("");
                  }}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                />

              </div>

            </div>

            {/* New Password */}

            <div>

              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                New Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="new-password"
                  type="password"
                  value={
                    newPassword
                  }
                  onChange={(event) => {
                    setNewPassword(
                      event.target.value
                    );
                    setPasswordMessage("");
                    setPasswordError("");
                  }}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                />

              </div>

              <p className="mt-2 text-xs text-gray-400">
                Password must contain at least 6 characters.
              </p>

            </div>

            {/* Confirm Password */}

            <div>

              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Confirm New Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="confirm-password"
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(event) => {
                    setConfirmPassword(
                      event.target.value
                    );
                    setPasswordMessage("");
                    setPasswordError("");
                  }}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                />

              </div>

            </div>

            {/* Change Password */}

            <button
              type="submit"
              disabled={
                loadingPassword
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <Lock size={18} />

              {loadingPassword
                ? "Changing..."
                : "Change Password"}

            </button>

          </form>

        </section>

        {/* =========================
            LEARNING STATISTICS
        ========================== */}

        <section className="mt-6">

          <div className="mb-5">

            <h2 className="text-2xl font-black text-gray-950">
              Learning Statistics
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track your overall learning activity and progress.
            </p>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Overall Progress */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Trophy size={22} />
              </div>

              <div className="mt-5 flex items-end gap-1">

                <span className="text-3xl font-black text-gray-900">
                  {overallProgress}
                </span>

                <span className="mb-1 text-lg font-bold text-gray-400">
                  %
                </span>

              </div>

              <h3 className="mt-1 font-bold text-gray-500">
                Overall Progress
              </h3>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width:
                      `${overallProgress}%`,
                  }}
                />

              </div>

            </div>

            {/* Courses Started */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <BookOpen size={22} />
              </div>

              <div className="mt-5 text-3xl font-black text-gray-900">
                {coursesStarted}
              </div>

              <h3 className="mt-1 font-bold text-gray-500">
                Courses Started
              </h3>

            </div>

            {/* Lessons Completed */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle2 size={22} />
              </div>

              <div className="mt-5 text-3xl font-black text-gray-900">
                {completedLessons}
              </div>

              <h3 className="mt-1 font-bold text-gray-500">
                Lessons Completed
              </h3>

            </div>

            {/* Quizzes Completed */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                <Trophy size={22} />
              </div>

              <div className="mt-5 text-3xl font-black text-gray-900">
                {quizzesCompleted}
              </div>

              <h3 className="mt-1 font-bold text-gray-500">
                Quizzes Completed
              </h3>

            </div>

          </div>

        </section>

        {/* =========================
            ACCOUNT INFORMATION
        ========================== */}

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-xl font-black text-gray-950">
            Account Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <ShieldCheck size={20} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Account Type
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    Student Account
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                  <BookOpen size={20} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Platform
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    CodeNinja Academy
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            LEARNING PROFILE
        ========================== */}

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <Trophy size={22} />
            </div>

            <div>

              <h2 className="text-xl font-black text-gray-950">
                Learning Profile
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View your courses, progress and quiz
                results from the dashboard.
              </p>

            </div>

          </div>

          <div className="mt-6">

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >

              <BookOpen size={18} />

              View Learning Dashboard

              <ArrowLeft
                size={17}
                className="rotate-180"
              />

            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;