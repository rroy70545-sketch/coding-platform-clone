import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Award,
  PlayCircle,
  User,
  ArrowRight,
  Trophy,
  Target,
} from "lucide-react";

import courses from "../data/courses";

function Dashboard() {
  const storedUser = localStorage.getItem("codeninja-user");

  let user = {
    id: null,
    name: "Student",
    email: "student@example.com",
  };

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      console.log("Could not read user data.");
    }
  }

  const [courseProgress, setCourseProgress] = useState({});
  const [quizScores, setQuizScores] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  // ==========================================
  // LOAD USER-SPECIFIC PROGRESS + QUIZ SCORES
  // ==========================================

  useEffect(() => {
    const loadUserData = async () => {
      if (!user.id) {
        setLoadingProgress(false);
        return;
      }

      const progressData = {};
      const quizData = {};

      try {
        // ======================================
        // LOAD PROGRESS FOR EVERY COURSE
        // ======================================

        for (const course of courses) {
          try {
            const response = await fetch(
              `http://localhost:5000/api/progress/${user.id}/${course.id}`
            );

            const data = await response.json();

            if (response.ok && data.success) {
              // Backend uses completed_lessons
              // Support both snake_case and camelCase
              let completedLessons = [];

              if (Array.isArray(data.progress?.completed_lessons)) {
                completedLessons = data.progress.completed_lessons;
              } else if (Array.isArray(data.progress?.completedLessons)) {
                completedLessons = data.progress.completedLessons;
              } else if (Array.isArray(data.completedLessons)) {
                completedLessons = data.completedLessons;
              }

              progressData[course.id] = completedLessons;

              // Save ONLY for this user
              localStorage.setItem(
                `course-progress-${user.id}-${course.id}`,
                JSON.stringify(completedLessons)
              );
            } else {
              progressData[course.id] = [];
            }
          } catch (error) {
            console.error(
              `Could not load progress for course ${course.id}:`,
              error
            );

            // Fallback to this user's LocalStorage
            try {
              const savedProgress = localStorage.getItem(
                `course-progress-${user.id}-${course.id}`
              );

              const parsedProgress = savedProgress
                ? JSON.parse(savedProgress)
                : [];

              progressData[course.id] = Array.isArray(parsedProgress)
                ? parsedProgress
                : [];
            } catch {
              progressData[course.id] = [];
            }
          }
        }

        // ======================================
        // LOAD QUIZ SCORES FOR THIS USER
        // ======================================

        for (const course of courses) {
          try {
            const response = await fetch(
              `http://localhost:5000/api/quiz/${user.id}/${course.id}`
            );

            const data = await response.json();

            if (response.ok && data.success && data.result) {
              const result = data.result;

              const score = Number(result.score || 0);
              const total = Number(
                result.total ?? result.total_questions ?? 0
              );

              const percentage =
                total > 0
                  ? Math.round((score / total) * 100)
                  : 0;

              const quizResult = {
                score,
                total,
                percentage,
              };

              quizData[course.id] = quizResult;

              // Save ONLY for this user
              localStorage.setItem(
                `quiz-score-${user.id}-${course.id}`,
                JSON.stringify(quizResult)
              );
            } else {
              // If backend has no quiz score,
              // check this user's LocalStorage.
              const savedQuiz = localStorage.getItem(
                `quiz-score-${user.id}-${course.id}`
              );

              if (savedQuiz) {
                const parsedQuiz = JSON.parse(savedQuiz);

                if (parsedQuiz) {
                  quizData[course.id] = parsedQuiz;
                }
              }
            }
          } catch (error) {
            console.error(
              `Could not load quiz score for course ${course.id}:`,
              error
            );

            // Fallback to user-specific LocalStorage
            try {
              const savedQuiz = localStorage.getItem(
                `quiz-score-${user.id}-${course.id}`
              );

              if (savedQuiz) {
                const parsedQuiz = JSON.parse(savedQuiz);

                if (parsedQuiz) {
                  quizData[course.id] = parsedQuiz;
                }
              }
            } catch {
              // Ignore invalid LocalStorage data
            }
          }
        }

        setCourseProgress(progressData);
        setQuizScores(quizData);
      } catch (error) {
        console.error("Unable to load user data:", error);
      } finally {
        setLoadingProgress(false);
      }
    };

    loadUserData();
  }, [user.id]);

  // ==========================================
  // PREPARE COURSE DATA
  // ==========================================

  const courseData = courses.map((course) => {
    const completedLessons =
      courseProgress[course.id] || [];

    const quizScore =
      quizScores[course.id] || null;

    const totalLessons =
      course.curriculum?.length || 0;

    const progress =
      totalLessons > 0
        ? Math.min(
            100,
            Math.round(
              (completedLessons.length / totalLessons) * 100
            )
          )
        : 0;

    return {
      ...course,
      completedLessons,
      totalLessons,
      progress,
      quizScore,
    };
  });

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  const totalLessonsCompleted =
    courseData.reduce(
      (total, course) =>
        total + course.completedLessons.length,
      0
    );

  const coursesStarted =
    courseData.filter(
      (course) =>
        course.completedLessons.length > 0
    ).length;

  const completedCourses =
    courseData.filter(
      (course) => course.progress === 100
    ).length;

  const quizzesCompleted =
    courseData.filter(
      (course) => course.quizScore !== null
    ).length;

  const overallProgress =
    courseData.length > 0
      ? Math.round(
          courseData.reduce(
            (total, course) =>
              total + course.progress,
            0
          ) / courseData.length
        )
      : 0;

  // ==========================================
  // CONTINUE LEARNING
  // ==========================================

  // First choose an unfinished course that has progress.
  // This prevents a completed course from appearing here.
  const continueCourse =
    courseData.find(
      (course) =>
        course.progress > 0 &&
        course.progress < 100
    ) ||
    courseData.find(
      (course) =>
        course.progress === 0
    ) ||
    null;

  const firstLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "S";

  // ==========================================
  // LOADING
  // ==========================================

  if (loadingProgress) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="font-medium text-slate-600">
            Loading your learning progress...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="mb-2 text-sm font-medium text-blue-200">
                Student Dashboard
              </p>

              <h1 className="text-3xl font-bold md:text-4xl">
                Welcome back, {user.name}! 👋
              </h1>

              <p className="mt-3 text-slate-300">
                Continue learning and keep building your
                skills.
              </p>
            </div>

            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <User size={18} />
              View Profile
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* User Card */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
              {firstLetter}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {user.name}
              </h2>

              <p className="mt-1 text-slate-500">
                {user.email}
              </p>

              <p className="mt-2 text-sm text-green-600">
                ● Account Active
              </p>
            </div>
          </div>
        </div>

        {/* Learning Overview */}
        <section className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Learning Overview
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <Target size={22} />
                </div>

                <span className="text-2xl font-bold text-slate-900">
                  {overallProgress}%
                </span>
              </div>

              <h3 className="font-semibold text-slate-900">
                Overall Progress
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Across all courses
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                  <BookOpen size={22} />
                </div>

                <span className="text-2xl font-bold text-slate-900">
                  {coursesStarted}
                </span>
              </div>

              <h3 className="font-semibold text-slate-900">
                Courses Started
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Courses you have started
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-green-100 p-3 text-green-600">
                  <CheckCircle2 size={22} />
                </div>

                <span className="text-2xl font-bold text-slate-900">
                  {totalLessonsCompleted}
                </span>
              </div>

              <h3 className="font-semibold text-slate-900">
                Lessons Completed
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Lessons finished
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                  <Trophy size={22} />
                </div>

                <span className="text-2xl font-bold text-slate-900">
                  {quizzesCompleted}
                </span>
              </div>

              <h3 className="font-semibold text-slate-900">
                Quizzes Completed
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Quizzes attempted
              </p>
            </div>

          </div>
        </section>

        {/* Continue Learning */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Continue Learning
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Pick up where you left off.
            </p>
          </div>

          {continueCourse ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="grid md:grid-cols-3">

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white md:col-span-1">

                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
                    {continueCourse.icon && (
                      <continueCourse.icon size={28} />
                    )}
                  </div>

                  <p className="mb-2 text-sm text-blue-100">
                    {continueCourse.category}
                  </p>

                  <h3 className="text-2xl font-bold">
                    {continueCourse.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-blue-100">
                    {continueCourse.description}
                  </p>
                </div>

                <div className="p-8 md:col-span-2">

                  <div className="mb-6 flex items-center justify-between">

                    <div>
                      <p className="text-sm text-slate-500">
                        Your Progress
                      </p>

                      <p className="mt-1 text-3xl font-bold text-slate-900">
                        {continueCourse.progress}%
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                      <Clock3 size={24} />
                    </div>

                  </div>

                  <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${continueCourse.progress}%`,
                      }}
                    />
                  </div>

                  <div className="mb-6 flex flex-wrap gap-5 text-sm text-slate-500">

                    <span>
                      {continueCourse.completedLessons.length} /{" "}
                      {continueCourse.totalLessons} lessons completed
                    </span>

                    {continueCourse.quizScore && (
                      <span>
                        Quiz:{" "}
                        {continueCourse.quizScore.percentage}%
                      </span>
                    )}

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <Link
                      to={`/courses/${continueCourse.id}/learn`}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      <PlayCircle size={18} />
                      Continue Learning
                      <ArrowRight size={18} />
                    </Link>

                    <Link
                      to={`/courses/${continueCourse.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Course Details
                    </Link>

                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <Award
                className="mx-auto mb-4 text-green-500"
                size={42}
              />

              <h3 className="text-xl font-bold text-slate-900">
                All available courses completed!
              </h3>

              <p className="mt-2 text-slate-500">
                Explore more courses to continue learning.
              </p>

              <Link
                to="/courses"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Browse Courses
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </section>

        {/* My Learning */}
        <section className="mb-10">

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              My Learning
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track your progress across all courses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {courseData.map((course) => (
              <div
                key={course.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="flex items-center gap-4 border-b border-slate-100 p-5">

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      course.color ||
                      "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {course.icon && (
                      <course.icon size={24} />
                    )}
                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate font-bold text-slate-900">
                      {course.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {course.level}
                    </p>

                  </div>
                </div>

                <div className="p-5">

                  <div className="mb-2 flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      Progress
                    </span>

                    <span className="font-semibold text-slate-900">
                      {course.progress}%
                    </span>

                  </div>

                  <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${course.progress}%`,
                      }}
                    />
                  </div>

                  <div className="mb-5 flex items-center justify-between text-sm text-slate-500">

                    <span>
                      {course.completedLessons.length}/
                      {course.totalLessons} lessons
                    </span>

                    {course.quizScore ? (
                      <span className="font-medium text-green-600">
                        Quiz {course.quizScore.percentage}%
                      </span>
                    ) : (
                      <span>No quiz</span>
                    )}

                  </div>

                  <div className="flex gap-2">

                    <Link
                      to={`/courses/${course.id}/learn`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <PlayCircle size={16} />

                      {course.progress === 0
                        ? "Start Course"
                        : course.progress === 100
                          ? "Review Course"
                          : "Continue"}
                    </Link>

                    <Link
                      to={`/courses/${course.id}`}
                      className="flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Details
                    </Link>

                  </div>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Completed Courses */}
        {completedCourses > 0 && (
          <section className="mb-10">

            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-green-100 p-3 text-green-600">
                    <Award size={26} />
                  </div>

                  <div>

                    <h2 className="font-bold text-green-900">
                      Congratulations! 🎉
                    </h2>

                    <p className="mt-1 text-sm text-green-700">
                      You have completed{" "}
                      {completedCourses} course
                      {completedCourses > 1 ? "s" : ""}.
                    </p>

                  </div>
                </div>

                <span className="font-semibold text-green-700">
                  Keep learning!
                </span>

              </div>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="mb-10">

          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              to="/courses"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <BookOpen
                className="mb-3 text-blue-600"
                size={25}
              />

              <h3 className="font-bold text-slate-900">
                Browse Courses
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Explore all available courses.
              </p>

              <ArrowRight
                className="mt-4 text-slate-400 transition group-hover:translate-x-1"
                size={18}
              />
            </Link>

            <Link
              to="/profile"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <User
                className="mb-3 text-indigo-600"
                size={25}
              />

              <h3 className="font-bold text-slate-900">
                My Profile
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Manage your account.
              </p>

              <ArrowRight
                className="mt-4 text-slate-400 transition group-hover:translate-x-1"
                size={18}
              />
            </Link>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <CheckCircle2
                className="mb-3 text-green-600"
                size={25}
              />

              <h3 className="font-bold text-slate-900">
                Lessons
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {totalLessonsCompleted} lessons completed
                so far.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <Trophy
                className="mb-3 text-purple-600"
                size={25}
              />

              <h3 className="font-bold text-slate-900">
                Achievements
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {completedCourses} course
                {completedCourses !== 1 ? "s" : ""} completed.
              </p>

            </div>

          </div>
        </section>

        {/* Recent Activity */}
        <section>

          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Recent Activity
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            {totalLessonsCompleted === 0 &&
            quizzesCompleted === 0 ? (
              <div className="py-8 text-center">

                <BookOpen
                  className="mx-auto mb-4 text-slate-300"
                  size={40}
                />

                <h3 className="font-semibold text-slate-700">
                  No activity yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Start a course to see your learning activity here.
                </p>

                <Link
                  to="/courses"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Explore Courses
                  <ArrowRight size={16} />
                </Link>

              </div>
            ) : (
              <div className="space-y-4">

                {courseData
                  .filter(
                    (course) =>
                      course.completedLessons.length > 0 ||
                      course.quizScore !== null
                  )
                  .map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4"
                    >

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600">
                          <CheckCircle2 size={20} />
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-slate-900">
                            {course.title}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {course.completedLessons.length} lesson
                            {course.completedLessons.length !== 1
                              ? "s"
                              : ""}{" "}
                            completed
                          </p>

                        </div>
                      </div>

                      <Link
                        to={`/courses/${course.id}/learn`}
                        className="shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {course.progress === 100
                          ? "Review →"
                          : "Continue →"}
                      </Link>

                    </div>
                  ))}

              </div>
            )}

          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;