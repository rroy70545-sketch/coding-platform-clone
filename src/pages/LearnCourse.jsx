import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  Download,
  PartyPopper,
  PlayCircle,
  RotateCcw,
} from "lucide-react";
import jsPDF from "jspdf";

import courses from "../data/courses";

function LearnCourse() {
  const { id } = useParams();

  // ======================================================
  // COURSE ID
  // ======================================================

  const backendCourseId = Number(id);

  // Find course using numeric course ID
  const course = courses.find(
    (item) => Number(item.id) === backendCourseId
  );

  // Progress is stored using the numeric course ID
  const storageKey = `course-progress-${backendCourseId}`;

  // ======================================================
  // CURRENT USER
  // ======================================================

  const getCurrentUser = () => {
    const userData = localStorage.getItem("codeninja-user");

    if (!userData) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  };

  // ======================================================
  // LOCAL PROGRESS
  // ======================================================

  const getSavedProgress = () => {
    const savedProgress = localStorage.getItem(storageKey);

    if (!savedProgress) {
      return [];
    }

    try {
      const parsedProgress = JSON.parse(savedProgress);

      return Array.isArray(parsedProgress) ? parsedProgress : [];
    } catch {
      return [];
    }
  };

  // ======================================================
  // INITIAL LESSON
  // ======================================================

  const getInitialLesson = () => {
    if (!course) {
      return 0;
    }

    const savedProgress = getSavedProgress();

    const firstUnfinishedLesson = course.curriculum.findIndex(
      (_, index) => !savedProgress.includes(index)
    );

    if (firstUnfinishedLesson !== -1) {
      return firstUnfinishedLesson;
    }

    return course.curriculum.length - 1;
  };

  const [currentLesson, setCurrentLesson] = useState(
    getInitialLesson
  );

  const [completedLessons, setCompletedLessons] = useState(
    getSavedProgress
  );

  const [savingProgress, setSavingProgress] = useState(false);

  const [loadingProgress, setLoadingProgress] = useState(true);

  // ======================================================
  // SAVE PROGRESS TO BACKEND
  // ======================================================

  const saveProgressToBackend = async (progress) => {
    const user = getCurrentUser();

    if (!user || !user.id) {
      console.log(
        "No logged-in user. Progress saved locally only."
      );
      return;
    }

    if (
      !backendCourseId ||
      Number.isNaN(backendCourseId)
    ) {
      console.error("Invalid course ID:", id);
      return;
    }

    try {
      setSavingProgress(true);

      const response = await fetch(
        `http://localhost:5000/api/progress/${user.id}/${backendCourseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completedLessons: progress,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Progress save failed:",
          data.message
        );
        return;
      }

      console.log(
        "Progress saved to backend:",
        data
      );
    } catch (error) {
      console.error(
        "Backend progress error:",
        error
      );
    } finally {
      setSavingProgress(false);
    }
  };

  // ======================================================
  // LOAD PROGRESS FROM BACKEND
  // ======================================================

  useEffect(() => {
    const loadBackendProgress = async () => {
      const user = getCurrentUser();

      if (
        !user ||
        !user.id ||
        !course ||
        !backendCourseId ||
        Number.isNaN(backendCourseId)
      ) {
        setLoadingProgress(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/progress/${user.id}/${backendCourseId}`
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Unable to load backend progress:",
            data.message
          );

          setLoadingProgress(false);
          return;
        }

        if (Array.isArray(data.completedLessons)) {
          const backendProgress = data.completedLessons;

          // Update React state
          setCompletedLessons(backendProgress);

          // Synchronize local storage
          localStorage.setItem(
            storageKey,
            JSON.stringify(backendProgress)
          );

          // Open first unfinished lesson
          const firstUnfinishedLesson =
            course.curriculum.findIndex(
              (_, index) =>
                !backendProgress.includes(index)
            );

          if (firstUnfinishedLesson !== -1) {
            setCurrentLesson(firstUnfinishedLesson);
          } else if (course.curriculum.length > 0) {
            setCurrentLesson(
              course.curriculum.length - 1
            );
          }
        }
      } catch (error) {
        console.error(
          "Backend progress loading error:",
          error
        );
      } finally {
        setLoadingProgress(false);
      }
    };

    loadBackendProgress();
  }, [course, backendCourseId, storageKey]);

  // ======================================================
  // SAVE TO LOCAL STORAGE
  // ======================================================

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(completedLessons)
    );
  }, [completedLessons, storageKey]);

  // ======================================================
  // COURSE NOT FOUND
  // ======================================================

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
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

  // ======================================================
  // LOADING PROGRESS
  // ======================================================

  if (loadingProgress) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // PROGRESS CALCULATION
  // ======================================================

  const totalLessons = course.curriculum.length;

  const progress =
    totalLessons > 0
      ? Math.round(
          (completedLessons.length / totalLessons) * 100
        )
      : 0;

  const courseCompleted =
    totalLessons > 0 &&
    completedLessons.length === totalLessons;

  const lesson = course.curriculum[currentLesson];

  // ======================================================
  // MARK LESSON COMPLETE
  // ======================================================

  const markComplete = () => {
    if (completedLessons.includes(currentLesson)) {
      return;
    }

    const updatedProgress = [
      ...completedLessons,
      currentLesson,
    ].sort((a, b) => a - b);

    setCompletedLessons(updatedProgress);

    saveProgressToBackend(updatedProgress);
  };

  // ======================================================
  // NEXT LESSON
  // ======================================================

  const nextLesson = () => {
    if (currentLesson < totalLessons - 1) {
      setCurrentLesson(currentLesson + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ======================================================
  // PREVIOUS LESSON
  // ======================================================

  const previousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ======================================================
  // RESTART COURSE
  // ======================================================

  const restartCourse = () => {
    setCompletedLessons([]);
    setCurrentLesson(0);

    localStorage.setItem(
      storageKey,
      JSON.stringify([])
    );

    saveProgressToBackend([]);
  };

  // ======================================================
  // DOWNLOAD CERTIFICATE
  // ======================================================

  const downloadCertificate = () => {
    const userData =
      localStorage.getItem("codeninja-user");

    let userName = "CodeNinja Student";

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);

        if (parsedUser.name) {
          userName = parsedUser.name;
        }
      } catch {
        userName = "CodeNinja Student";
      }
    }

    const today = new Date();

    const completionDate =
      today.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

    const certificateId =
      `CNA-${course.id}-${Date.now()}`;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    // Outer border
    doc.setLineWidth(1.5);

    doc.rect(
      10,
      10,
      pageWidth - 20,
      pageHeight - 20
    );

    // Inner border
    doc.setLineWidth(0.5);

    doc.rect(
      14,
      14,
      pageWidth - 28,
      pageHeight - 28
    );

    // Academy
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(26);

    doc.text(
      "CodeNinja Academy",
      pageWidth / 2,
      35,
      {
        align: "center",
      }
    );

    // Certificate title
    doc.setFontSize(30);

    doc.text(
      "CERTIFICATE OF COMPLETION",
      pageWidth / 2,
      58,
      {
        align: "center",
      }
    );

    // Presented text
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(14);

    doc.text(
      "This certificate is proudly presented to",
      pageWidth / 2,
      75,
      {
        align: "center",
      }
    );

    // Student name
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(28);

    doc.text(
      userName,
      pageWidth / 2,
      92,
      {
        align: "center",
      }
    );

    // Course completion text
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(14);

    doc.text(
      "for successfully completing the course",
      pageWidth / 2,
      108,
      {
        align: "center",
      }
    );

    // Course title
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(22);

    const courseTitle =
      course.title.length > 50
        ? course.title.substring(0, 50) + "..."
        : course.title;

    doc.text(
      courseTitle,
      pageWidth / 2,
      125,
      {
        align: "center",
      }
    );

    // Completion information
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(13);

    doc.text(
      "Course Completion: 100%",
      pageWidth / 2,
      143,
      {
        align: "center",
      }
    );

    doc.text(
      `Completion Date: ${completionDate}`,
      pageWidth / 2,
      153,
      {
        align: "center",
      }
    );

    // Certificate ID
    doc.setFontSize(10);

    doc.text(
      `Certificate ID: ${certificateId}`,
      pageWidth / 2,
      171,
      {
        align: "center",
      }
    );

    // Signature lines
    doc.setLineWidth(0.5);

    doc.line(
      45,
      183,
      95,
      183
    );

    doc.line(
      pageWidth - 95,
      183,
      pageWidth - 45,
      183
    );

    doc.setFontSize(10);

    doc.text(
      "CodeNinja Academy",
      70,
      190,
      {
        align: "center",
      }
    );

    doc.text(
      "Course Completion",
      pageWidth - 70,
      190,
      {
        align: "center",
      }
    );

    doc.setFontSize(9);

    doc.text(
      "This certificate recognizes successful completion of the course.",
      pageWidth / 2,
      196,
      {
        align: "center",
      }
    );

    doc.save(
      `CodeNinja-Certificate-${
        course.shortTitle || course.id
      }.pdf`
    );
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">

          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Course
          </Link>

          <div className="hidden text-center md:block">
            <h1 className="font-bold text-slate-900">
              {course.title}
            </h1>

            <p className="text-xs text-slate-500">
              {completedLessons.length} of{" "}
              {totalLessons} lessons completed
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
            <BookOpen size={18} />
            {progress}%
          </div>

        </div>
      </header>

      {/* PROGRESS BAR */}

      <div className="h-2 bg-slate-200">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[320px_1fr]">

        {/* SIDEBAR */}

        <aside className="border-b border-slate-200 bg-white lg:min-h-[calc(100vh-74px)] lg:border-b-0 lg:border-r">

          <div className="p-6">

            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Course Lessons
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {completedLessons.length}/
                {totalLessons} completed
              </p>
            </div>

            {/* Progress */}

            <div className="mb-6">

              <div className="mb-2 flex items-center justify-between text-xs">

                <span className="font-medium text-slate-500">
                  Course Progress
                </span>

                <span className="font-bold text-blue-600">
                  {progress}%
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

            {/* Lessons */}

            <div className="space-y-2">

              {course.curriculum.map(
                (item, index) => {

                  const isCompleted =
                    completedLessons.includes(index);

                  const isCurrent =
                    currentLesson === index;

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        setCurrentLesson(index)
                      }
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        isCurrent
                          ? "border-blue-300 bg-blue-50"
                          : isCompleted
                            ? "border-green-200 bg-green-50 hover:bg-green-100"
                            : "border-transparent bg-slate-50 hover:border-slate-200 hover:bg-slate-100"
                      }`}
                    >

                      <div className="flex items-start gap-3">

                        <div className="mt-0.5 shrink-0">

                          {isCompleted ? (
                            <CheckCircle2
                              size={21}
                              className="text-green-600"
                            />
                          ) : isCurrent ? (
                            <PlayCircle
                              size={21}
                              className="text-blue-600"
                            />
                          ) : (
                            <Circle
                              size={21}
                              className="text-slate-400"
                            />
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="mb-1 flex items-center justify-between gap-2">

                            <span
                              className={`text-xs font-semibold ${
                                isCompleted
                                  ? "text-green-600"
                                  : isCurrent
                                    ? "text-blue-600"
                                    : "text-slate-400"
                              }`}
                            >
                              LESSON {index + 1}
                            </span>

                            {isCompleted && (
                              <span className="text-[10px] font-bold uppercase tracking-wide text-green-600">
                                Completed
                              </span>
                            )}

                            {!isCompleted &&
                              isCurrent && (
                                <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
                                  Current
                                </span>
                              )}

                          </div>

                          <p
                            className={`text-sm font-semibold ${
                              isCurrent
                                ? "text-blue-900"
                                : isCompleted
                                  ? "text-green-900"
                                  : "text-slate-700"
                            }`}
                          >
                            {item.title}
                          </p>

                          {item.duration && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                              <Clock3 size={13} />
                              {item.duration}
                            </div>
                          )}

                        </div>

                      </div>

                    </button>
                  );
                }
              )}

            </div>

          </div>

        </aside>

        {/* MAIN */}

        <main className="p-6 md:p-10">

          {courseCompleted ? (

            /* ==================================================
               COMPLETED COURSE
            ================================================== */

            <div className="mx-auto max-w-3xl rounded-3xl border border-green-200 bg-white p-8 text-center shadow-sm md:p-12">

              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                <PartyPopper size={40} />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Course Completed! 🎉
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-slate-500">
                Congratulations! You have completed all
                the lessons in this course.
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-2xl bg-green-50 p-5">

                <div className="text-3xl font-bold text-green-700">
                  100%
                </div>

                <p className="mt-1 text-sm text-green-600">
                  {totalLessons} of {totalLessons} lessons
                  completed
                </p>

              </div>

              {/* Certificate */}

              <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-yellow-200 bg-yellow-50 p-6">

                <div className="flex flex-col items-center text-center">

                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                    <Award size={32} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    Certificate Ready 🏆
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    You have successfully completed all{" "}
                    {totalLessons} lessons of this course.
                  </p>

                  <div className="mt-4 rounded-xl bg-white px-5 py-3">

                    <p className="text-2xl font-bold text-green-600">
                      100%
                    </p>

                    <p className="text-xs text-slate-500">
                      Course Completion
                    </p>

                  </div>

                  <button
                    onClick={downloadCertificate}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <Download size={19} />
                    Download Certificate
                  </button>

                  <p className="mt-3 text-xs text-slate-500">
                    Your certificate will be downloaded as a PDF.
                  </p>

                </div>

              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                <button
                  onClick={restartCourse}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw size={18} />
                  Restart Course
                </button>

                <Link
                  to={`/courses/${course.id}/quiz`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  Take Quiz
                  <ArrowRight size={18} />
                </Link>

              </div>

            </div>

          ) : (

            /* ==================================================
               LESSON CONTENT
            ================================================== */

            <>

              <div className="mb-8">

                <div className="mb-3 flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    LESSON {currentLesson + 1}
                  </span>

                  {completedLessons.includes(
                    currentLesson
                  ) ? (

                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      <CheckCircle2 size={14} />
                      Completed
                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      <PlayCircle size={14} />
                      In Progress
                    </span>

                  )}

                </div>

                <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  {lesson.title}
                </h2>

                {lesson.duration && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 size={17} />
                    {lesson.duration}
                  </div>
                )}

              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">

                {lesson.description && (
                  <div className="mb-8 rounded-2xl bg-slate-50 p-6">

                    <p className="leading-7 text-slate-600">
                      {lesson.description}
                    </p>

                  </div>
                )}

                {lesson.content && (
                  <div>

                    {Array.isArray(lesson.content) ? (

                      lesson.content.map(
                        (paragraph, index) => (
                          <p
                            key={index}
                            className="mb-5 leading-8 text-slate-700"
                          >
                            {paragraph}
                          </p>
                        )
                      )

                    ) : (

                      <p className="leading-8 text-slate-700">
                        {lesson.content}
                      </p>

                    )}

                  </div>
                )}

                {lesson.topics && (
                  <div className="mt-8">

                    <h3 className="mb-4 text-xl font-bold text-slate-900">
                      Topics Covered
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">

                      {lesson.topics.map(
                        (topic, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                          >

                            <CheckCircle2
                              size={18}
                              className="shrink-0 text-blue-600"
                            />

                            <span className="text-sm font-medium text-slate-700">
                              {topic}
                            </span>

                          </div>
                        )
                      )}

                    </div>

                  </div>
                )}

                {lesson.skills && (
                  <div className="mt-8">

                    <h3 className="mb-4 text-xl font-bold text-slate-900">
                      What You Will Learn
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {lesson.skills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}

                {/* COMPLETE BUTTON */}

                <div className="mt-10 border-t border-slate-200 pt-8">

                  {completedLessons.includes(
                    currentLesson
                  ) ? (

                    <div className="flex flex-col gap-4 rounded-2xl bg-green-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-3">

                        <CheckCircle2
                          size={25}
                          className="text-green-600"
                        />

                        <div>

                          <p className="font-bold text-green-800">
                            Lesson Completed
                          </p>

                          <p className="text-sm text-green-600">
                            Progress saved to your account.
                          </p>

                        </div>

                      </div>

                      {currentLesson <
                        totalLessons - 1 && (
                        <button
                          onClick={nextLesson}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                        >
                          Next Lesson
                          <ArrowRight size={18} />
                        </button>
                      )}

                    </div>

                  ) : (

                    <button
                      onClick={markComplete}
                      disabled={savingProgress}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >

                      <CheckCircle2 size={20} />

                      {savingProgress
                        ? "Saving Progress..."
                        : "Mark Lesson as Complete"}

                    </button>

                  )}

                </div>

              </div>

              {/* NAVIGATION */}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <button
                  onClick={previousLesson}
                  disabled={currentLesson === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={18} />
                  Previous Lesson
                </button>

                <span className="text-center text-sm text-slate-500">
                  Lesson {currentLesson + 1} of {totalLessons}
                </span>

                <button
                  onClick={nextLesson}
                  disabled={
                    currentLesson === totalLessons - 1
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next Lesson
                  <ArrowRight size={18} />
                </button>

              </div>

            </>

          )}

        </main>

      </div>

    </div>
  );
}

export default LearnCourse;