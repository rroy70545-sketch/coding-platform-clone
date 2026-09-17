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

const API_URL = "http://localhost:5000";

// ============================================
// NORMALIZE QUIZ SCORE
// ============================================

function normalizeQuizScore(quiz) {
  if (!quiz) {
    return null;
  }

  const score = Number(quiz.score || 0);

  const total = Number(
    quiz.total ||
      quiz.totalQuestions ||
      0
  );

  let percentage = 0;

  if (
    quiz.percentage !== undefined &&
    quiz.percentage !== null
  ) {
    percentage = Number(quiz.percentage);
  } else if (total > 0) {
    percentage = Math.round(
      (score / total) * 100
    );
  }

  return {
    ...quiz,
    score: score,
    total: total,
    totalQuestions: total,
    percentage: percentage,
  };
}

// ============================================
// DASHBOARD
// ============================================

function Dashboard() {
  // ==========================================
  // USER
  // ==========================================

  const storedUser =
    localStorage.getItem("codeninja-user");

  let user = {
    name: "Student",
    email: "student@example.com",
  };

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      console.log(
        "Could not read user data."
      );
    }
  }

  // ==========================================
  // STATES
  // ==========================================

  const [courseProgress, setCourseProgress] =
    useState({});

  const [quizScores, setQuizScores] =
    useState({});

  const [loadingProgress, setLoadingProgress] =
    useState(true);

  const [loadingQuiz, setLoadingQuiz] =
    useState(true);

  // ==========================================
  // LOAD COURSE PROGRESS
  // ==========================================

  useEffect(() => {
    async function loadAllProgress() {
      if (!user.id) {
        setLoadingProgress(false);
        return;
      }

      const progressData = {};

      for (const course of courses) {
        try {
          const response = await fetch(
            API_URL +
              "/api/progress/" +
              user.id +
              "/" +
              course.id
          );

          const data = await response.json();

          if (
            response.ok &&
            Array.isArray(
              data.completedLessons
            )
          ) {
            progressData[course.id] =
              data.completedLessons;

            localStorage.setItem(
              "course-progress-" +
                course.id,
              JSON.stringify(
                data.completedLessons
              )
            );
          } else {
            const savedProgress =
              localStorage.getItem(
                "course-progress-" +
                  course.id
              );

            if (savedProgress) {
              const parsed =
                JSON.parse(savedProgress);

              progressData[course.id] =
                Array.isArray(parsed)
                  ? parsed
                  : [];
            } else {
              progressData[course.id] = [];
            }
          }
        } catch (error) {
          console.log(
            "Using local progress for course:",
            course.id
          );

          try {
            const savedProgress =
              localStorage.getItem(
                "course-progress-" +
                  course.id
              );

            const parsed = savedProgress
              ? JSON.parse(savedProgress)
              : [];

            progressData[course.id] =
              Array.isArray(parsed)
                ? parsed
                : [];
          } catch {
            progressData[course.id] = [];
          }
        }
      }

      setCourseProgress(progressData);
      setLoadingProgress(false);
    }

    loadAllProgress();
  }, [user.id]);

  // ==========================================
  // LOAD QUIZ SCORES
  // ==========================================

  useEffect(() => {
    async function loadQuizScores() {
      if (!user.id) {
        setLoadingQuiz(false);
        return;
      }

      const scoreData = {};

      try {
        const response = await fetch(
          API_URL +
            "/api/quiz/user/" +
            user.id
        );

        const data = await response.json();

        if (
          response.ok &&
          Array.isArray(data.scores)
        ) {
          data.scores.forEach((item) => {
            /*
             * IMPORTANT:
             *
             * Backend may return:
             * "1"
             * "1.0"
             * 1
             *
             * Convert all of them to:
             * "1"
             */

            const courseId = String(
              Number(item.courseId)
            );

            /*
             * Backend returns newest scores first.
             * Keep only the latest score.
             */

            if (!scoreData[courseId]) {
              scoreData[courseId] =
                normalizeQuizScore(item);
            }
          });
        }
      } catch (error) {
        console.log(
          "Could not load quiz scores from backend."
        );
      }

      // ========================================
      // LOCAL STORAGE FALLBACK
      // ========================================

      courses.forEach((course) => {
        const courseId = String(
          Number(course.id)
        );

        if (scoreData[courseId]) {
          localStorage.setItem(
            "quiz-score-" + course.id,
            JSON.stringify(
              scoreData[courseId]
            )
          );

          return;
        }

        try {
          const savedQuiz =
            localStorage.getItem(
              "quiz-score-" + course.id
            );

          if (savedQuiz) {
            const parsedQuiz =
              JSON.parse(savedQuiz);

            const normalized =
              normalizeQuizScore(
                parsedQuiz
              );

            if (normalized) {
              scoreData[courseId] =
                normalized;
            }
          }
        } catch {
          console.log(
            "Could not read quiz score for course:",
            course.id
          );
        }
      });

      setQuizScores(scoreData);
      setLoadingQuiz(false);
    }

    loadQuizScores();
  }, [user.id]);

  // ==========================================
  // CREATE COURSE DATA
  // ==========================================

  const courseData = courses.map((course) => {
    const completedLessons =
      courseProgress[course.id] || [];

    const courseId = String(
      Number(course.id)
    );

    const quizScore =
      quizScores[courseId] || null;

    const totalLessons =
      course.curriculum?.length || 0;

    const progress =
      totalLessons > 0
        ? Math.round(
            (completedLessons.length /
              totalLessons) *
              100
          )
        : 0;

    return {
      ...course,
      completedLessons:
        completedLessons,
      totalLessons: totalLessons,
      progress: progress,
      quizScore: quizScore,
    };
  });

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalCourses =
    courseData.length;

  const completedCourses =
    courseData.filter(
      (course) =>
        course.progress === 100
    ).length;

  const quizzesCompleted =
    courseData.filter(
      (course) =>
        course.quizScore !== null
    ).length;

  const totalLessonsCompleted =
    courseData.reduce(
      (total, course) =>
        total +
        course.completedLessons.length,
      0
    );

  const overallProgress =
    totalCourses > 0
      ? Math.round(
          courseData.reduce(
            (total, course) =>
              total + course.progress,
            0
          ) / totalCourses
        )
      : 0;

  // ==========================================
  // CONTINUE COURSE
  // ==========================================

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
    courseData[0];

  // ==========================================
  // RECENT ACTIVITY
  // ==========================================

  const recentCourses =
    courseData.filter(
      (course) =>
        course.completedLessons.length >
          0 ||
        course.quizScore !== null
    );

  // ==========================================
  // LOADING
  // ==========================================

  if (
    loadingProgress ||
    loadingQuiz
  ) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================
          HEADER
      ======================================= */}

      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <p className="text-sm text-blue-200 mb-2">
                Student Dashboard
              </p>

              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome, {user.name || "Student"}!
              </h1>

              <p className="mt-2 text-slate-300">
                Continue learning and improve your
                coding skills.
              </p>
            </div>

            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              <User size={18} />
              View Profile
            </Link>

          </div>
        </div>
      </section>

      {/* ======================================
          MAIN
      ======================================= */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ====================================
            STATISTICS
        ===================================== */}

        <section className="mb-10">

          <h2 className="text-2xl font-bold text-slate-900 mb-5">
            Learning Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Overall Progress */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between mb-4">

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Target size={22} />
                </div>

                <span className="text-2xl font-bold text-slate-900">
                  {overallProgress}%
                </span>

              </div>

              <h3 className="font-semibold text-slate-900">
                Overall Progress
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Across all courses
              </p>

            </div>

            {/* Courses */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between mb-4">

                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <BookOpen size={22} />
                </div>

                <span className="text-2xl font-bold text-slate-900">
                  {totalCourses}
                </span>

              </div>

              <h3 className="font-semibold text-slate-900">
                Total Courses
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Available courses
              </p>

            </div>

            {/* Lessons */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between mb-4">

                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 size={22} />
                </div>

                <span className="text-2xl font-bold text-slate-900">
                  {totalLessonsCompleted}
                </span>

              </div>

              <h3 className="font-semibold text-slate-900">
                Lessons Completed
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Lessons finished
              </p>

            </div>

            {/* Quizzes */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between mb-4">

                <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <Trophy size={22} />
                </div>

                <span className="text-2xl font-bold text-slate-900">
                  {quizzesCompleted}
                </span>

              </div>

              <h3 className="font-semibold text-slate-900">
                Quizzes Completed
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Quizzes attempted
              </p>

            </div>

          </div>
        </section>

        {/* ====================================
            CONTINUE LEARNING
        ===================================== */}

        {continueCourse && (
          <section className="mb-10">

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900">
                Continue Learning
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Pick up where you left off.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

              <div className="p-6">

                <div className="flex flex-col md:flex-row md:items-center gap-6">

                  {/* Icon */}

                  <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">

                    {continueCourse.icon ? (
                      <continueCourse.icon
                        size={30}
                      />
                    ) : (
                      <BookOpen size={30} />
                    )}

                  </div>

                  {/* Course Info */}

                  <div className="flex-1">

                    <h3 className="text-xl font-bold text-slate-900">
                      {continueCourse.title}
                    </h3>

                    <p className="text-slate-500 mt-1">
                      {continueCourse.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm">

                      <span className="text-slate-500">
                        {
                          continueCourse
                            .completedLessons
                            .length
                        }
                        /
                        {
                          continueCourse.totalLessons
                        }{" "}
                        lessons
                      </span>

                      {continueCourse.quizScore && (
                        <span className="text-green-600 font-semibold">
                          Quiz{" "}
                          {
                            continueCourse
                              .quizScore
                              .percentage
                          }%
                        </span>
                      )}

                    </div>

                  </div>

                  {/* Progress */}

                  <div className="w-full md:w-52">

                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-slate-500">
                        Progress
                      </span>

                      <span className="font-semibold text-slate-900">
                        {continueCourse.progress}%
                      </span>

                    </div>

                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width:
                            continueCourse.progress +
                            "%",
                        }}
                      />

                    </div>

                  </div>

                  {/* Button */}

                  <Link
                    to={
                      "/learn/" +
                      continueCourse.id
                    }
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shrink-0"
                  >
                    <PlayCircle size={18} />
                    Continue
                  </Link>

                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================
            MY LEARNING
        ===================================== */}

        <section className="mb-10">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-slate-900">
              My Learning
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Track your progress across all courses.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {courseData.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >

                {/* Course Header */}

                <div className="flex items-center gap-4 p-5 border-b border-slate-100">

                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">

                    {course.icon ? (
                      <course.icon size={24} />
                    ) : (
                      <BookOpen size={24} />
                    )}

                  </div>

                  <div className="min-w-0">

                    <h3 className="font-bold text-slate-900 truncate">
                      {course.title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {course.level ||
                        "Beginner"}
                    </p>

                  </div>

                </div>

                {/* Course Details */}

                <div className="p-5">

                  <div className="flex justify-between text-sm mb-2">

                    <span className="text-slate-500">
                      Progress
                    </span>

                    <span className="font-semibold text-slate-900">
                      {course.progress}%
                    </span>

                  </div>

                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-5">

                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width:
                          course.progress +
                          "%",
                      }}
                    />

                  </div>

                  <div className="flex items-center justify-between text-sm mb-5">

                    <span className="text-slate-500">
                      {
                        course
                          .completedLessons
                          .length
                      }
                      /
                      {course.totalLessons}{" "}
                      lessons
                    </span>

                    {course.quizScore ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <Trophy size={15} />
                        Quiz{" "}
                        {
                          course.quizScore
                            .percentage
                        }%
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        No quiz
                      </span>
                    )}

                  </div>

                  <div className="flex gap-2">

                    <Link
                      to={
                        "/learn/" +
                        course.id
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      <PlayCircle size={16} />

                      {course.progress === 0
                        ? "Start Course"
                        : course.progress === 100
                          ? "Review Course"
                          : "Continue"}
                    </Link>

                    <Link
                      to={
                        "/courses/" +
                        course.id
                      }
                      className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Details
                    </Link>

                  </div>

                </div>

              </div>
            ))}

          </div>
        </section>

        {/* ====================================
            COMPLETED COURSES
        ===================================== */}

        {completedCourses > 0 && (
          <section className="mb-10">

            <div className="mb-5">

              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Award
                  size={24}
                  className="text-yellow-500"
                />
                Achievements
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your completed courses and quiz
                results.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {courseData
                .filter(
                  (course) =>
                    course.progress ===
                    100
                )
                .map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-green-200 rounded-2xl p-5 shadow-sm"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                        <Award size={24} />
                      </div>

                      <div>

                        <h3 className="font-bold text-slate-900">
                          {course.title}
                        </h3>

                        <p className="text-sm text-green-600 mt-1">
                          Course Completed
                        </p>

                      </div>

                    </div>

                    {course.quizScore && (
                      <div className="mt-4 p-3 rounded-lg bg-green-50">

                        <div className="flex justify-between">

                          <span className="text-sm text-slate-600">
                            Quiz Score
                          </span>

                          <span className="font-bold text-green-600">
                            {
                              course.quizScore
                                .percentage
                            }%
                          </span>

                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          {
                            course.quizScore
                              .score
                          }{" "}
                          /{" "}
                          {
                            course.quizScore
                              .total
                          }{" "}
                          correct
                        </p>

                      </div>
                    )}

                  </div>
                ))}

            </div>
          </section>
        )}

        {/* ====================================
            RECENT ACTIVITY
        ===================================== */}

        <section>

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your recent learning activity.
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y">

            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >

                  <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <CheckCircle2 size={21} />
                  </div>

                  <div className="flex-1">

                    <h3 className="font-semibold text-slate-900">
                      {course.title}
                    </h3>

                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-slate-500">

                      <span>
                        {
                          course
                            .completedLessons
                            .length
                        }{" "}
                        lesson
                        {
                          course
                            .completedLessons
                            .length !== 1
                            ? "s"
                            : ""
                        }{" "}
                        completed
                      </span>

                      {course.quizScore && (
                        <span className="text-green-600 font-semibold">
                          Quiz{" "}
                          {
                            course.quizScore
                              .percentage
                          }%
                        </span>
                      )}

                    </div>

                  </div>

                  <Link
                    to={
                      "/learn/" +
                      course.id
                    }
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </Link>

                </div>
              ))
            ) : (
              <div className="p-8 text-center">

                <BookOpen
                  size={40}
                  className="mx-auto text-slate-300 mb-3"
                />

                <h3 className="font-semibold text-slate-900">
                  No recent activity
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Start a course to see your activity
                  here.
                </p>

                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Explore Courses
                  <ArrowRight size={16} />
                </Link>

              </div>
            )}

          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;