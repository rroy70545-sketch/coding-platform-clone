import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import courseContent from "../data/courseContent";

const API_URL = "http://localhost:5000";

function LearnCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const courseId = Number(id);

  const currentUser = JSON.parse(
    localStorage.getItem("codeninja-user") || "null"
  );

  const content = courseContent[courseId];

  const [course, setCourse] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);

  const [courseStarted, setCourseStarted] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [courseExpired, setCourseExpired] = useState(false);

  const [daysLeft, setDaysLeft] = useState(null);
  const [deadline, setDeadline] = useState(null);

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);

  const [message, setMessage] = useState("");

  // ============================================================
  // ALL TOPICS
  // ============================================================

  const allTopics = useMemo(() => {
    if (!content) return [];

    return content.days.flatMap((day) =>
      day.topics.map((topic) => ({
        ...topic,
        day: day.day,
        dayTitle: day.title,
      }))
    );
  }, [content]);

  const totalTopics = allTopics.length;

  // ============================================================
  // CURRENT DAY / TOPIC
  // ============================================================

  const currentDay = content?.days?.[currentDayIndex];

  const currentTopic = currentDay?.topics?.[currentTopicIndex];

  const currentTopicPosition =
    content?.days
      ?.slice(0, currentDayIndex)
      .reduce((total, day) => total + day.topics.length, 0) +
    currentTopicIndex +
    1;

  // ============================================================
  // LOAD COURSE
  // ============================================================

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!content) {
      setLoading(false);
      return;
    }

    loadCourse();
    loadProgress();
    loadEnrollment();
  }, [courseId]);

  // ============================================================
  // LOAD COURSE DETAILS
  // ============================================================

  const loadCourse = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/courses/${courseId}`
      );

      const data = await response.json();

      if (data.success) {
        setCourse(data.course);
      } else {
        setMessage("Course not found.");
      }
    } catch (error) {
      console.error("Course loading error:", error);
      setMessage("Unable to load course.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD PROGRESS
  // ============================================================

  const loadProgress = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(
        `${API_URL}/api/progress/${currentUser.id}/${courseId}`
      );

      const data = await response.json();

      if (data.success) {
        const backendProgress =
          data.progress?.completed_lessons ||
          data.progress?.completedLessons ||
          [];

        const progressArray = Array.isArray(backendProgress)
          ? backendProgress
          : [];

        /*
         * Only keep IDs that belong to the current course.
         * This prevents old progress IDs from breaking the
         * new topic-based progress system.
         */
        const validTopicIds = new Set(
          allTopics.map((topic) => topic.id)
        );

        const cleanedProgress = progressArray.filter((id) =>
          validTopicIds.has(Number(id))
        );

        setCompletedLessons(cleanedProgress);

        localStorage.setItem(
          `course-progress-${currentUser.id}-${courseId}`,
          JSON.stringify(cleanedProgress)
        );
      }
    } catch (error) {
      console.error("Progress loading error:", error);

      const savedProgress = localStorage.getItem(
        `course-progress-${currentUser.id}-${courseId}`
      );

      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);

          const validTopicIds = new Set(
            allTopics.map((topic) => topic.id)
          );

          const cleanedProgress = Array.isArray(parsed)
            ? parsed.filter((id) => validTopicIds.has(Number(id)))
            : [];

          setCompletedLessons(cleanedProgress);
        } catch {
          setCompletedLessons([]);
        }
      }
    }
  };

  // ============================================================
  // LOAD ENROLLMENT
  // ============================================================

  const loadEnrollment = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(
        `${API_URL}/api/enrollment/${currentUser.id}/${courseId}`
      );

      const data = await response.json();

      if (data.success && data.enrollment) {
        const enrollment = data.enrollment;

        setCourseStarted(
          enrollment.status === "active" ||
            enrollment.status === "completed"
        );

        setCourseCompleted(
          enrollment.status === "completed" ||
            enrollment.completed === true
        );

        setCourseExpired(
          enrollment.status === "expired" ||
            enrollment.expired === true
        );

        if (enrollment.deadline) {
          setDeadline(enrollment.deadline);
        }

        if (typeof enrollment.daysLeft === "number") {
          setDaysLeft(enrollment.daysLeft);
        }
      }
    } catch (error) {
      console.error("Enrollment loading error:", error);
    }
  };

  // ============================================================
  // COUNTDOWN
  // ============================================================

  useEffect(() => {
    if (!deadline) return;

    const updateTimer = () => {
      const now = Date.now();
      const end = new Date(deadline).getTime();

      const difference = end - now;

      if (difference <= 0) {
        setDaysLeft(0);
        setCourseExpired(true);
        return;
      }

      const days = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );

      setDaysLeft(days);
    };

    updateTimer();

    const timer = setInterval(updateTimer, 60000);

    return () => clearInterval(timer);
  }, [deadline]);

  // ============================================================
  // START COURSE
  // ============================================================

  const startCourse = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setStarting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/enrollment/${currentUser.id}/${courseId}/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          data.message || "Unable to start course."
        );
        return;
      }

      setCourseStarted(true);
      setCourseExpired(false);

      setCourseCompleted(
        data.enrollment?.status === "completed"
      );

      if (data.enrollment?.deadline) {
        setDeadline(data.enrollment.deadline);
      }

      if (typeof data.enrollment?.daysLeft === "number") {
        setDaysLeft(data.enrollment.daysLeft);
      }

      setMessage(
        "Course started successfully. Your countdown has started!"
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the server."
      );
    } finally {
      setStarting(false);
    }
  };

  // ============================================================
  // MARK TOPIC COMPLETE
  // ============================================================

  const markTopicComplete = async () => {
    if (!courseStarted) {
      setMessage("Please click Start Course first.");
      return;
    }

    if (courseExpired) {
      setMessage("Your course deadline has expired.");
      return;
    }

    if (!currentTopic) return;

    const topicId = currentTopic.id;

    if (completedLessons.includes(topicId)) {
      goToNextTopic();
      return;
    }

    setSaving(true);
    setMessage("");

    const updatedProgress = [
      ...completedLessons,
      topicId,
    ];

    try {
      const response = await fetch(
        `${API_URL}/api/progress/${currentUser.id}/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completedLessons: updatedProgress,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          data.message || "Unable to save progress."
        );
        return;
      }

      setCompletedLessons(updatedProgress);

      localStorage.setItem(
        `course-progress-${currentUser.id}-${courseId}`,
        JSON.stringify(updatedProgress)
      );

      /*
       * Frontend completion is based on every topic.
       * Backend should also be configured for the same
       * number of topics.
       */
      if (
        data.enrollment?.status === "completed" ||
        updatedProgress.length >= totalTopics
      ) {
        setCourseCompleted(true);
      }

      if (data.enrollment?.deadline) {
        setDeadline(data.enrollment.deadline);
      }

      if (typeof data.enrollment?.daysLeft === "number") {
        setDaysLeft(data.enrollment.daysLeft);
      }

      if (currentTopicPosition < totalTopics) {
        goToNextTopic();
      }
    } catch (error) {
      console.error(error);

      setMessage("Unable to save progress.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // NEXT TOPIC
  // ============================================================

  const goToNextTopic = () => {
    if (!currentDay) return;

    if (
      currentTopicIndex <
      currentDay.topics.length - 1
    ) {
      setCurrentTopicIndex(
        currentTopicIndex + 1
      );
      return;
    }

    if (
      currentDayIndex <
      content.days.length - 1
    ) {
      setCurrentDayIndex(
        currentDayIndex + 1
      );

      setCurrentTopicIndex(0);
    }
  };

  // ============================================================
  // PREVIOUS TOPIC
  // ============================================================

  const goToPreviousTopic = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex(
        currentTopicIndex - 1
      );
      return;
    }

    if (currentDayIndex > 0) {
      const previousDay =
        content.days[currentDayIndex - 1];

      setCurrentDayIndex(
        currentDayIndex - 1
      );

      setCurrentTopicIndex(
        previousDay.topics.length - 1
      );
    }
  };

  // ============================================================
  // SELECT TOPIC
  // ============================================================

  const selectTopic = (
    dayIndex,
    topicIndex
  ) => {
    setCurrentDayIndex(dayIndex);
    setCurrentTopicIndex(topicIndex);
  };

  // ============================================================
  // OPEN YOUTUBE
  // ============================================================

  const openYouTube = () => {
    if (!currentTopic?.video) {
      setMessage(
        "No YouTube video is available for this topic."
      );
      return;
    }

    window.open(
      currentTopic.video,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ============================================================
  // CERTIFICATE
  // ============================================================

  const downloadCertificate = async () => {
    if (completedLessons.length < totalTopics) {
      setMessage(
        `Complete all ${totalTopics} topics before downloading your certificate.`
      );
      return;
    }

    if (!courseCompleted) {
      setMessage(
        "The backend has not confirmed course completion yet."
      );
      return;
    }

    if (courseExpired) {
      setMessage(
        "The course deadline has expired."
      );
      return;
    }

    setCertificateLoading(true);
    setMessage("");

    try {
      const certificateId =
        `CNA-${courseId}-${currentUser.id}-${Date.now()}`;

      const response = await fetch(
        `${API_URL}/api/certificate/${certificateId}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          data.message ||
            "Certificate verification failed."
        );
        return;
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        doc.internal.pageSize.getWidth();

      const pageHeight =
        doc.internal.pageSize.getHeight();

      doc.setLineWidth(2);

      doc.rect(
        10,
        10,
        pageWidth - 20,
        pageHeight - 20
      );

      doc.setLineWidth(0.5);

      doc.rect(
        15,
        15,
        pageWidth - 30,
        pageHeight - 30
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(28);

      doc.text(
        "CODENINJA ACADEMY",
        pageWidth / 2,
        35,
        {
          align: "center",
        }
      );

      doc.setFontSize(24);

      doc.text(
        "CERTIFICATE OF COMPLETION",
        pageWidth / 2,
        55,
        {
          align: "center",
        }
      );

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

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(24);

      doc.text(
        currentUser.name || "Student",
        pageWidth / 2,
        92,
        {
          align: "center",
        }
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(14);

      doc.text(
        "for successfully completing the course",
        pageWidth / 2,
        110,
        {
          align: "center",
        }
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(21);

      doc.text(
        course?.title || "Course",
        pageWidth / 2,
        128,
        {
          align: "center",
        }
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(12);

      doc.text(
        `Certificate ID: ${certificateId}`,
        pageWidth / 2,
        148,
        {
          align: "center",
        }
      );

      doc.text(
        "Issued by CodeNinja Academy",
        pageWidth / 2,
        158,
        {
          align: "center",
        }
      );

      doc.save(
        `CodeNinja-Certificate-${courseId}.pdf`
      );

      setMessage(
        "Certificate downloaded successfully!"
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to generate certificate."
      );
    } finally {
      setCertificateLoading(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">
          Loading course...
        </div>
      </div>
    );
  }

  // ============================================================
  // INVALID COURSE
  // ============================================================

  if (!course || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Course not found
          </h1>

          <button
            onClick={() =>
              navigate("/courses")
            }
            className="mt-5 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // PROGRESS
  // ============================================================

  const progressPercentage =
    totalTopics > 0
      ? Math.round(
          (completedLessons.length /
            totalTopics) *
            100
        )
      : 0;

  const topicCompleted =
    currentTopic &&
    completedLessons.includes(
      currentTopic.id
    );

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <button
                onClick={() =>
                  navigate("/courses")
                }
                className="text-sm text-blue-600 hover:underline mb-2"
              >
                ← Back to Courses
              </button>

              <h1 className="text-3xl font-bold text-gray-900">
                {course.title}
              </h1>

              <p className="text-gray-500 mt-1">
                {content.days.length}-day structured
                learning program
              </p>
            </div>

            {/* TIMER */}

            <div
              className={`rounded-xl border px-5 py-4 min-w-[230px] ${
                courseExpired
                  ? "bg-red-50 border-red-300"
                  : courseCompleted
                  ? "bg-green-50 border-green-300"
                  : courseStarted
                  ? "bg-blue-50 border-blue-300"
                  : "bg-gray-50 border-gray-300"
              }`}
            >

              {!courseStarted &&
              !courseCompleted ? (
                <>
                  <p className="text-sm text-gray-500">
                    Course Duration
                  </p>

                  <p className="text-2xl font-bold text-gray-800">
                    {course.duration_days || 7} Days
                  </p>
                </>
              ) : courseCompleted ? (
                <>
                  <p className="text-sm text-green-600 font-medium">
                    Course Status
                  </p>

                  <p className="text-2xl font-bold text-green-700">
                    Completed
                  </p>
                </>
              ) : courseExpired ? (
                <>
                  <p className="text-sm text-red-600 font-medium">
                    Course Status
                  </p>

                  <p className="text-2xl font-bold text-red-700">
                    Expired
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-blue-600 font-medium">
                    Time Remaining
                  </p>

                  <p className="text-2xl font-bold text-blue-700">
                    {daysLeft !== null
                      ? `${daysLeft} Days Left`
                      : "Calculating..."}
                  </p>

                  {deadline && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last day:{" "}
                      {new Date(
                        deadline
                      ).toLocaleDateString()}
                    </p>
                  )}
                </>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* MESSAGE */}

        {message && (
          <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3">
            {message}
          </div>
        )}

        {/* ==================================================== */}
        {/* START COURSE */}
        {/* ==================================================== */}

        {!courseStarted &&
          !courseCompleted &&
          !courseExpired && (
            <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8 text-center">

              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                🚀
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-4">
                Ready to Start?
              </h2>

              <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                Start your structured learning journey.
                You will have{" "}
                <strong>
                  {course.duration_days || 7} days
                </strong>{" "}
                to complete the course.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-3">

                <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">
                  📅 {content.days.length} Days
                </span>

                <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">
                  📚 {totalTopics} Topics
                </span>

                <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">
                  🎥 Video Lessons
                </span>

              </div>

              <button
                onClick={startCourse}
                disabled={starting}
                className="mt-6 px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {starting
                  ? "Starting..."
                  : "Start Course"}
              </button>

            </div>
          )}

        {/* ==================================================== */}
        {/* EXPIRED */}
        {/* ==================================================== */}

        {courseExpired &&
          !courseCompleted && (
            <div className="bg-red-50 border border-red-300 rounded-2xl p-8 mb-8 text-center">

              <div className="text-5xl mb-3">
                ⏰
              </div>

              <h2 className="text-2xl font-bold text-red-700">
                Course Deadline Expired
              </h2>

              <p className="text-red-600 mt-2">
                Your allowed course duration has ended.
              </p>

            </div>
          )}

        {/* ==================================================== */}
        {/* COMPLETED */}
        {/* ==================================================== */}

        {courseCompleted && (
          <div className="bg-green-50 border border-green-300 rounded-2xl p-8 mb-8 text-center">

            <div className="text-5xl mb-3">
              🎉
            </div>

            <h2 className="text-3xl font-bold text-green-700">
              Course Completed!
            </h2>

            <p className="text-green-700 mt-2">
              Congratulations! You have completed{" "}
              <strong>{course.title}</strong>.
            </p>

            <button
              onClick={downloadCertificate}
              disabled={certificateLoading}
              className="mt-6 px-7 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
            >
              {certificateLoading
                ? "Generating Certificate..."
                : "Download Certificate"}
            </button>

          </div>
        )}

        {/* ==================================================== */}
        {/* COURSE CONTENT */}
        {/* ==================================================== */}

        {courseStarted &&
          !courseExpired && (
            <div className="grid lg:grid-cols-4 gap-6">

              {/* ================================================= */}
              {/* SIDEBAR */}
              {/* ================================================= */}

              <div className="lg:col-span-1">

                <div className="bg-white rounded-xl border shadow-sm p-4 sticky top-5">

                  <div className="flex justify-between items-center mb-4">

                    <h2 className="font-bold text-lg">
                      Course Content
                    </h2>

                    <span className="text-sm font-semibold text-blue-600">
                      {progressPercentage}%
                    </span>

                  </div>

                  {/* PROGRESS BAR */}

                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-5">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>

                  {/* DAYS */}

                  <div className="space-y-3">

                    {content.days.map(
                      (day, dayIndex) => (
                        <div
                          key={day.day}
                          className="border rounded-lg overflow-hidden"
                        >

                          <div
                            className={`px-3 py-3 font-semibold ${
                              currentDayIndex ===
                              dayIndex
                                ? "bg-blue-50 text-blue-700"
                                : "bg-gray-50 text-gray-800"
                            }`}
                          >
                            <div>
                              Day {day.day}
                            </div>

                            <div className="text-xs font-normal mt-1">
                              {day.title}
                            </div>
                          </div>

                          <div className="p-2 space-y-1">

                            {day.topics.map(
                              (
                                topic,
                                topicIndex
                              ) => {
                                const completed =
                                  completedLessons.includes(
                                    topic.id
                                  );

                                const active =
                                  currentDayIndex ===
                                    dayIndex &&
                                  currentTopicIndex ===
                                    topicIndex;

                                return (
                                  <button
                                    key={topic.id}
                                    onClick={() =>
                                      selectTopic(
                                        dayIndex,
                                        topicIndex
                                      )
                                    }
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                                      active
                                        ? "bg-blue-600 text-white"
                                        : completed
                                        ? "bg-green-50 text-green-700"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`}
                                  >

                                    <div className="flex items-start gap-2">

                                      <span className="shrink-0">
                                        {completed
                                          ? "✓"
                                          : "○"}
                                      </span>

                                      <span>
                                        {topic.title}
                                      </span>

                                    </div>

                                  </button>
                                );
                              }
                            )}

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>

              </div>

              {/* ================================================= */}
              {/* RIGHT CONTENT */}
              {/* ================================================= */}

              <div className="lg:col-span-3">

                {/* PROGRESS */}

                <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">

                  <div className="flex justify-between items-center mb-2">

                    <span className="font-semibold text-gray-800">
                      Course Progress
                    </span>

                    <span className="font-bold text-blue-600">
                      {completedLessons.length} /{" "}
                      {totalTopics}
                    </span>

                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>

                </div>

                {/* ================================================= */}
                {/* VIDEO / YOUTUBE CARD */}
                {/* ================================================= */}

                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

                  <div className="bg-gray-900 p-8 md:p-12">

                    <div className="max-w-2xl mx-auto text-center text-white">

                      <div className="w-20 h-20 mx-auto rounded-full bg-red-600 flex items-center justify-center text-4xl shadow-lg">
                        ▶
                      </div>

                      <p className="text-sm text-gray-300 mt-5 uppercase tracking-wide">
                        Topic Video
                      </p>

                      <h3 className="text-2xl md:text-3xl font-bold mt-2">
                        {currentTopic?.title}
                      </h3>

                      <p className="text-gray-300 mt-3">
                        Find a video specifically for this
                        topic on YouTube.
                      </p>

                      <button
                        onClick={openYouTube}
                        className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                      >
                        ▶ Watch Topic Video on YouTube
                      </button>

                    </div>

                  </div>

                  {/* TOPIC DETAILS */}

                  <div className="p-7">

                    <div className="flex flex-wrap items-center gap-2 mb-3">

                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                        Day {currentDay?.day}
                      </span>

                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                        Topic {currentTopicPosition} of{" "}
                        {totalTopics}
                      </span>

                      {topicCompleted && (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                          ✓ Completed
                        </span>
                      )}

                    </div>

                    <h2 className="text-3xl font-bold text-gray-900">
                      {currentTopic?.title}
                    </h2>

                    <p className="text-gray-600 mt-4 leading-7">
                      {currentTopic?.description}
                    </p>

                    {/* ================================================= */}
                    {/* NAVIGATION */}
                    {/* ================================================= */}

                    <div className="flex flex-wrap gap-3 mt-8">

                      <button
                        onClick={goToPreviousTopic}
                        disabled={
                          currentDayIndex === 0 &&
                          currentTopicIndex === 0
                        }
                        className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                      >
                        ← Previous
                      </button>

                      <button
                        onClick={markTopicComplete}
                        disabled={
                          saving ||
                          topicCompleted
                        }
                        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving
                          ? "Saving..."
                          : topicCompleted
                          ? "✓ Completed"
                          : "Mark as Complete"}
                      </button>

                      <button
                        onClick={goToNextTopic}
                        disabled={
                          currentDayIndex ===
                            content.days.length - 1 &&
                          currentTopicIndex ===
                            currentDay.topics.length - 1
                        }
                        className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                      >
                        Next →
                      </button>

                    </div>

                  </div>

                </div>

                {/* ================================================= */}
                {/* COMPLETION */}
                {/* ================================================= */}

                <div className="mt-6 bg-white rounded-2xl border shadow-sm p-7">

                  <h2 className="text-2xl font-bold text-gray-900">
                    Course Completion
                  </h2>

                  <p className="text-gray-600 mt-2">
                    Complete all {totalTopics} topics
                    to finish the course.
                  </p>

                  <div className="flex flex-wrap gap-4 mt-6">

                    <button
                      onClick={() =>
                        navigate(`/quiz/${courseId}`)
                      }
                      className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
                    >
                      Take Quiz
                    </button>

                    <button
                      onClick={downloadCertificate}
                      disabled={
                        completedLessons.length <
                          totalTopics ||
                        !courseCompleted ||
                        certificateLoading
                      }
                      className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-40"
                    >
                      {certificateLoading
                        ? "Generating..."
                        : "Download Certificate"}
                    </button>

                  </div>

                </div>

              </div>

            </div>
          )}

      </div>
    </div>
  );
}

export default LearnCourse;