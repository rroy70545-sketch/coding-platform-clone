import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";

import courses from "../data/courses";

function CourseDetails() {
  const { id } = useParams();

  const course = courses.find(
    (item) => String(item.id) === String(id)
  );

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Course Not Found
          </h1>

          <p className="mt-3 text-slate-500">
            The course you are looking for does not exist.
          </p>

          <Link
            to="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Get saved lesson progress
  const savedProgress = localStorage.getItem(
    `course-progress-${course.id}`
  );

  let completedLessons = [];

  try {
    const parsedProgress = savedProgress
      ? JSON.parse(savedProgress)
      : [];

    if (Array.isArray(parsedProgress)) {
      completedLessons = parsedProgress;
    }
  } catch {
    completedLessons = [];
  }

  const totalLessons = course.curriculum?.length || 0;

  const completedCount = completedLessons.length;

  const progress =
    totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

  const isStarted = completedCount > 0;
  const isCompleted = progress === 100;

  const CourseIcon = course.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-900 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          {/* Back */}
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_350px] lg:items-center">
            {/* Course Info */}
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
                  {course.category}
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
                  {course.level}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
                {course.title}
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                {course.description}
              </p>

              {/* Rating */}
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-2">
                  <Star
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="font-bold">
                    {course.rating}
                  </span>

                  <span className="text-sm text-slate-400">
                    rating
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Users size={17} />
                  {course.students}
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock size={17} />
                  {course.duration}
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <BookOpen size={17} />
                  {totalLessons} lessons
                </div>
              </div>
            </div>

            {/* Course Icon */}
            <div
              className={`mx-auto flex h-64 w-full max-w-sm items-center justify-center rounded-3xl ${course.color}`}
            >
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white/20 text-white backdrop-blur-sm">
                <CourseIcon size={70} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Curriculum */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Course Curriculum
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Complete the lessons to finish this course.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {course.curriculum?.map((lesson, index) => {
                const lessonNumber = index + 1;

                const isLessonCompleted =
                  completedLessons.includes(index) ||
                  completedLessons.includes(lessonNumber);

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                      isLessonCompleted
                        ? "border-green-200 bg-green-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    {/* Lesson Number */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold ${
                        isLessonCompleted
                          ? "bg-green-100 text-green-600"
                          : "bg-white text-slate-600"
                      }`}
                    >
                      {isLessonCompleted ? (
                        <CheckCircle2 size={22} />
                      ) : (
                        lessonNumber
                      )}
                    </div>

                    {/* Lesson Name */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-semibold ${
                          isLessonCompleted
                            ? "text-green-700"
                            : "text-slate-800"
                        }`}
                      >
                        {lesson.title || lesson}
                      </p>

                      {isLessonCompleted && (
                        <p className="mt-1 text-xs font-medium text-green-600">
                          Lesson completed
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    {isLessonCompleted ? (
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-green-500"
                      />
                    ) : (
                      <PlayCircle
                        size={20}
                        className="shrink-0 text-slate-400"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Progress Card */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <GraduationCap size={25} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Your Progress
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {progress}%
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Course completion
                </span>

                <span className="text-xs font-bold text-blue-600">
                  {completedCount}/{totalLessons}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted
                      ? "bg-green-500"
                      : "bg-blue-600"
                  }`}
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {/* Status */}
            {isCompleted ? (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 size={20} />

                  <span className="font-bold">
                    Course Completed!
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-green-700">
                  Congratulations! You have completed all
                  lessons in this course.
                </p>
              </div>
            ) : isStarted ? (
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  Keep going! 🚀
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-600">
                  Continue your learning journey and complete
                  the remaining lessons.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Ready to start?
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Start learning and track your progress as
                  you complete each lesson.
                </p>
              </div>
            )}

            {/* Main Action */}
            <Link
              to={`/courses/${course.id}/learn`}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-white transition ${
                isCompleted
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 size={19} />
                  Review Course
                </>
              ) : isStarted ? (
                <>
                  <PlayCircle size={19} />
                  Continue Learning
                </>
              ) : (
                <>
                  <PlayCircle size={19} />
                  Start Learning
                </>
              )}
            </Link>

            {/* Quiz */}
            <Link
              to={`/courses/${course.id}/quiz`}
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Take Course Quiz
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CourseDetails;