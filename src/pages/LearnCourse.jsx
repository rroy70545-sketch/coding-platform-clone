import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jsPDF } from "jspdf";

const API_URL = "http://localhost:5000";

function LearnCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  // ============================================
  // GET CURRENT USER
  // ============================================
  useEffect(() => {
    const userData = localStorage.getItem("codeninja-user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error reading user:", error);
        setCurrentUser(null);
      }
    }
  }, []);

  // ============================================
  // LOAD COURSE
  // ============================================
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/courses/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load course");
        }

        setCourse(data.course);

        // ----------------------------------------
        // Course lessons
        // ----------------------------------------
        const courseLessons = getLessonsForCourse(
          Number(id),
          data.course
        );

        setLessons(courseLessons);

        setLoading(false);
      } catch (error) {
        console.error("Course loading error:", error);
        setError("Unable to load this course.");
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  // ============================================
  // LOAD USER PROGRESS
  // ============================================
  useEffect(() => {
    if (!currentUser || !id) return;

    const loadProgress = async () => {
      const backendCourseId = Number(id);

      const storageKey = `course-progress-${currentUser.id}-${backendCourseId}`;

      try {
        // First load local progress
        const savedProgress = localStorage.getItem(storageKey);

        if (savedProgress) {
          try {
            const parsedProgress = JSON.parse(savedProgress);

            if (Array.isArray(parsedProgress)) {
              setProgress(parsedProgress);
            }
          } catch (error) {
            console.error("Local progress error:", error);
          }
        }

        // Then load backend progress
        const response = await fetch(
          `${API_URL}/api/progress/${currentUser.id}/${backendCourseId}`
        );

        const data = await response.json();

        if (response.ok && data.success) {
          let backendProgress = [];

          if (Array.isArray(data.completedLessons)) {
            backendProgress = data.completedLessons;
          } else if (
            data.progress &&
            Array.isArray(data.progress.completed_lessons)
          ) {
            backendProgress = data.progress.completed_lessons;
          } else if (
            data.progress &&
            typeof data.progress.completed_lessons === "string"
          ) {
            try {
              backendProgress = JSON.parse(
                data.progress.completed_lessons
              );
            } catch {
              backendProgress = [];
            }
          }

          if (Array.isArray(backendProgress)) {
            setProgress(backendProgress);

            localStorage.setItem(
              storageKey,
              JSON.stringify(backendProgress)
            );
          }
        }
      } catch (error) {
        console.error("Progress loading error:", error);
      }
    };

    loadProgress();
  }, [currentUser, id]);

  // ============================================
  // GET LESSONS
  // ============================================
  const getLessonsForCourse = (courseId, courseData) => {
    const lessonData = {
      1: [
        {
          id: 1,
          title: "Introduction to Data Structures",
          content:
            "Learn the fundamentals of data structures and why they are important in computer science.",
        },
        {
          id: 2,
          title: "Arrays and Strings",
          content:
            "Understand arrays, strings, indexing, traversal and common operations.",
        },
        {
          id: 3,
          title: "Linked Lists",
          content:
            "Learn singly linked lists, doubly linked lists and their common operations.",
        },
        {
          id: 4,
          title: "Stacks and Queues",
          content:
            "Understand stacks, queues, LIFO and FIFO concepts with practical examples.",
        },
        {
          id: 5,
          title: "Trees and Binary Trees",
          content:
            "Learn tree structures, binary trees and tree traversal techniques.",
        },
        {
          id: 6,
          title: "Graphs",
          content:
            "Understand graph terminology, representations and graph traversal.",
        },
        {
          id: 7,
          title: "Searching Algorithms",
          content:
            "Learn linear search and binary search algorithms.",
        },
        {
          id: 8,
          title: "Sorting Algorithms",
          content:
            "Study bubble sort, selection sort, insertion sort and other sorting techniques.",
        },
        {
          id: 9,
          title: "Algorithm Complexity",
          content:
            "Understand time complexity, space complexity and Big O notation.",
        },
        {
          id: 10,
          title: "Final DSA Practice",
          content:
            "Review important DSA concepts and prepare for the final quiz.",
        },
      ],

      2: [
        {
          id: 1,
          title: "Introduction to Web Development",
          content:
            "Understand how modern websites and web applications work.",
        },
        {
          id: 2,
          title: "HTML Fundamentals",
          content:
            "Learn HTML elements, headings, forms, links, images and page structure.",
        },
        {
          id: 3,
          title: "CSS Fundamentals",
          content:
            "Learn selectors, layouts, colors, spacing and responsive design.",
        },
        {
          id: 4,
          title: "JavaScript Basics",
          content:
            "Understand variables, functions, conditions, loops and JavaScript fundamentals.",
        },
        {
          id: 5,
          title: "DOM Manipulation",
          content:
            "Learn how JavaScript interacts with HTML through the DOM.",
        },
        {
          id: 6,
          title: "React Fundamentals",
          content:
            "Understand components, props, state and React application structure.",
        },
        {
          id: 7,
          title: "Backend Development",
          content:
            "Learn the basics of servers, APIs and backend applications.",
        },
        {
          id: 8,
          title: "REST APIs",
          content:
            "Understand GET, POST, PUT and DELETE requests.",
        },
        {
          id: 9,
          title: "Databases",
          content:
            "Learn how web applications store and retrieve data.",
        },
        {
          id: 10,
          title: "Full Stack Project",
          content:
            "Review the complete full-stack development workflow.",
        },
      ],

      3: [
        {
          id: 1,
          title: "Introduction to Artificial Intelligence",
          content:
            "Understand what artificial intelligence is and how AI systems are used.",
        },
        {
          id: 2,
          title: "Types of AI",
          content:
            "Learn about narrow AI, general AI and other AI classifications.",
        },
        {
          id: 3,
          title: "Machine Learning",
          content:
            "Understand the basic concepts of machine learning.",
        },
        {
          id: 4,
          title: "Supervised Learning",
          content:
            "Learn how supervised learning uses labelled training data.",
        },
        {
          id: 5,
          title: "Unsupervised Learning",
          content:
            "Understand clustering and other unsupervised learning techniques.",
        },
        {
          id: 6,
          title: "Reinforcement Learning",
          content:
            "Learn how agents learn through rewards and penalties.",
        },
        {
          id: 7,
          title: "Deep Learning",
          content:
            "Understand neural networks and deep learning concepts.",
        },
        {
          id: 8,
          title: "Natural Language Processing",
          content:
            "Learn how AI systems process and understand human language.",
        },
        {
          id: 9,
          title: "Generative AI",
          content:
            "Understand how generative AI can create text, images and other content.",
        },
        {
          id: 10,
          title: "Prompt Engineering",
          content:
            "Learn how to write effective prompts for AI systems.",
        },
      ],

      4: [
        {
          id: 1,
          title: "Introduction to Databases",
          content:
            "Understand databases and why applications use them.",
        },
        {
          id: 2,
          title: "Database Models",
          content:
            "Learn relational and non-relational database concepts.",
        },
        {
          id: 3,
          title: "SQL Fundamentals",
          content:
            "Learn SELECT, INSERT, UPDATE and DELETE operations.",
        },
        {
          id: 4,
          title: "Tables and Relationships",
          content:
            "Understand tables, primary keys and relationships.",
        },
        {
          id: 5,
          title: "Joins",
          content:
            "Learn INNER JOIN, LEFT JOIN and other SQL joins.",
        },
        {
          id: 6,
          title: "Normalization",
          content:
            "Understand database normalization and its benefits.",
        },
        {
          id: 7,
          title: "Indexes",
          content:
            "Learn how indexes improve database query performance.",
        },
        {
          id: 8,
          title: "Transactions",
          content:
            "Understand transactions and ACID properties.",
        },
        {
          id: 9,
          title: "Database Security",
          content:
            "Learn basic database security practices.",
        },
        {
          id: 10,
          title: "Database Project",
          content:
            "Review the major database concepts learned throughout the course.",
        },
      ],

      5: [
        {
          id: 1,
          title: "Introduction to Android Development",
          content:
            "Understand Android applications and the Android development ecosystem.",
        },
        {
          id: 2,
          title: "Android Studio",
          content:
            "Learn the basics of Android Studio and project setup.",
        },
        {
          id: 3,
          title: "Activities and Lifecycle",
          content:
            "Understand Android activities and their lifecycle.",
        },
        {
          id: 4,
          title: "Layouts and Views",
          content:
            "Learn how Android user interfaces are designed.",
        },
        {
          id: 5,
          title: "User Input",
          content:
            "Learn how applications handle user input.",
        },
        {
          id: 6,
          title: "Navigation",
          content:
            "Understand navigation between Android screens.",
        },
        {
          id: 7,
          title: "Data Storage",
          content:
            "Learn basic techniques for storing application data.",
        },
        {
          id: 8,
          title: "APIs",
          content:
            "Understand how Android applications communicate with APIs.",
        },
        {
          id: 9,
          title: "Testing Android Apps",
          content:
            "Learn basic Android application testing.",
        },
        {
          id: 10,
          title: "Android Project",
          content:
            "Review the complete Android application development process.",
        },
      ],

      6: [
        {
          id: 1,
          title: "Introduction to Cybersecurity",
          content:
            "Understand cybersecurity and the importance of protecting digital systems.",
        },
        {
          id: 2,
          title: "CIA Triad",
          content:
            "Learn confidentiality, integrity and availability.",
        },
        {
          id: 3,
          title: "Common Cyber Attacks",
          content:
            "Understand phishing, malware, denial-of-service and other common attacks.",
        },
        {
          id: 4,
          title: "Authentication",
          content:
            "Learn passwords, authentication and access control.",
        },
        {
          id: 5,
          title: "Encryption",
          content:
            "Understand encryption and its role in protecting information.",
        },
        {
          id: 6,
          title: "Network Security",
          content:
            "Learn basic concepts of firewalls, secure networks and monitoring.",
        },
        {
          id: 7,
          title: "Web Security",
          content:
            "Understand common web application security risks.",
        },
        {
          id: 8,
          title: "Social Engineering",
          content:
            "Learn how attackers manipulate users into revealing information.",
        },
        {
          id: 9,
          title: "Cybersecurity Best Practices",
          content:
            "Learn practical methods for improving security.",
        },
        {
          id: 10,
          title: "Security Review",
          content:
            "Review the key cybersecurity concepts from the course.",
        },
      ],

      7: [
        {
          id: 1,
          title: "Introduction to Data Analytics",
          content:
            "Understand data analytics and how organizations use data.",
        },
        {
          id: 2,
          title: "Types of Data",
          content:
            "Learn structured, unstructured and semi-structured data.",
        },
        {
          id: 3,
          title: "Data Collection",
          content:
            "Understand common methods of collecting data.",
        },
        {
          id: 4,
          title: "Data Cleaning",
          content:
            "Learn how to identify and handle missing and incorrect data.",
        },
        {
          id: 5,
          title: "Exploratory Data Analysis",
          content:
            "Understand how analysts explore datasets.",
        },
        {
          id: 6,
          title: "Statistics",
          content:
            "Learn basic statistical concepts used in data analysis.",
        },
        {
          id: 7,
          title: "Data Visualization",
          content:
            "Understand charts and visualizations used to communicate data.",
        },
        {
          id: 8,
          title: "Python for Analytics",
          content:
            "Learn how Python can be used for data analysis.",
        },
        {
          id: 9,
          title: "Data Interpretation",
          content:
            "Learn how to interpret analytical results.",
        },
        {
          id: 10,
          title: "Analytics Project",
          content:
            "Review the complete data analytics workflow.",
        },
      ],

      8: [
        {
          id: 1,
          title: "Introduction to Backend Development",
          content:
            "Understand servers, backend applications and APIs.",
        },
        {
          id: 2,
          title: "Node.js Fundamentals",
          content:
            "Learn the basics of Node.js.",
        },
        {
          id: 3,
          title: "Express.js",
          content:
            "Understand Express.js and backend routing.",
        },
        {
          id: 4,
          title: "REST APIs",
          content:
            "Learn how to build and consume REST APIs.",
        },
        {
          id: 5,
          title: "Middleware",
          content:
            "Understand middleware in backend applications.",
        },
        {
          id: 6,
          title: "Databases",
          content:
            "Learn how backend applications interact with databases.",
        },
        {
          id: 7,
          title: "Authentication",
          content:
            "Understand login, authentication and authorization.",
        },
        {
          id: 8,
          title: "Error Handling",
          content:
            "Learn how backend applications handle errors.",
        },
        {
          id: 9,
          title: "API Security",
          content:
            "Learn basic practices for securing backend APIs.",
        },
        {
          id: 10,
          title: "Backend Project",
          content:
            "Review the complete backend development workflow.",
        },
      ],
    };

    return (
      lessonData[courseId] || [
        {
          id: 1,
          title: "Introduction",
          content:
            courseData?.title
              ? `Welcome to ${courseData.title}.`
              : "Welcome to the course.",
        },
        {
          id: 2,
          title: "Core Concepts",
          content:
            "Learn the important concepts covered in this course.",
        },
        {
          id: 3,
          title: "Practical Applications",
          content:
            "Explore practical applications of the concepts.",
        },
        {
          id: 4,
          title: "Final Review",
          content:
            "Review the important concepts before completing the course.",
        },
      ]
    );
  };

  // ============================================
  // MARK LESSON COMPLETE
  // ============================================
  const markLessonComplete = async () => {
    if (!currentUser || !lessons[currentLesson]) return;

    const lessonId = lessons[currentLesson].id;

    let updatedProgress = [...progress];

    if (!updatedProgress.includes(lessonId)) {
      updatedProgress.push(lessonId);
    }

    setProgress(updatedProgress);

    const backendCourseId = Number(id);

    const storageKey = `course-progress-${currentUser.id}-${backendCourseId}`;

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedProgress)
    );

    // Save progress to backend
    try {
      await fetch(
        `${API_URL}/api/progress/${currentUser.id}/${backendCourseId}`,
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
    } catch (error) {
      console.error("Error saving progress:", error);
    }

    // Move to next lesson
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  // ============================================
  // GO TO LESSON
  // ============================================
  const goToLesson = (index) => {
    setCurrentLesson(index);
  };

  // ============================================
  // CALCULATE PROGRESS
  // ============================================
  const progressPercentage =
    lessons.length > 0
      ? Math.round((progress.length / lessons.length) * 100)
      : 0;

  const isCourseComplete =
    lessons.length > 0 &&
    progress.length >= lessons.length;

  // ============================================
  // DOWNLOAD CERTIFICATE
  // ============================================
  const downloadCertificate = () => {
    if (!currentUser) {
      alert("Please login before downloading your certificate.");
      navigate("/login");
      return;
    }

    if (!isCourseComplete) {
      alert(
        "Please complete all lessons before downloading your certificate."
      );
      return;
    }

    try {
      const userData = localStorage.getItem("codeninja-user");

      let userName = "CodeNinja Student";

      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);

          if (parsedUser.name) {
            userName = parsedUser.name;
          }
        } catch (error) {
          console.error("User data error:", error);
        }
      }

      // ========================================
      // NEW CERTIFICATE ID FORMAT
      // CNA-courseId-userId-timestamp
      // ========================================
      const certificateId = `CNA-${course.id}-${currentUser.id}-${Date.now()}`;

      const completionDate = new Date().toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );

      const doc = new jsPDF("landscape", "mm", "a4");

      // ----------------------------------------
      // Certificate border
      // ----------------------------------------
      doc.setLineWidth(2);
      doc.rect(10, 10, 277, 190);

      doc.setLineWidth(0.5);
      doc.rect(15, 15, 267, 180);

      // ----------------------------------------
      // Academy name
      // ----------------------------------------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);

      doc.text(
        "CodeNinja Academy",
        148.5,
        38,
        { align: "center" }
      );

      // ----------------------------------------
      // Certificate title
      // ----------------------------------------
      doc.setFontSize(24);

      doc.text(
        "CERTIFICATE OF COMPLETION",
        148.5,
        58,
        { align: "center" }
      );

      // ----------------------------------------
      // Presented to
      // ----------------------------------------
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);

      doc.text(
        "This certificate is proudly presented to",
        148.5,
        78,
        { align: "center" }
      );

      // ----------------------------------------
      // Student name
      // ----------------------------------------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);

      doc.text(
        userName,
        148.5,
        95,
        { align: "center" }
      );

      // ----------------------------------------
      // Course completion text
      // ----------------------------------------
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);

      doc.text(
        "for successfully completing the course",
        148.5,
        112,
        { align: "center" }
      );

      // ----------------------------------------
      // Course title
      // ----------------------------------------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);

      doc.text(
        course.title,
        148.5,
        130,
        { align: "center" }
      );

      // ----------------------------------------
      // Completion percentage
      // ----------------------------------------
      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);

      doc.text(
        `Course Completion: ${progressPercentage}%`,
        148.5,
        148,
        { align: "center" }
      );

      // ----------------------------------------
      // Completion date
      // ----------------------------------------
      doc.text(
        `Completion Date: ${completionDate}`,
        148.5,
        158,
        { align: "center" }
      );

      // ----------------------------------------
      // Certificate ID
      // ----------------------------------------
      doc.setFontSize(10);

      doc.text(
        `Certificate ID: ${certificateId}`,
        148.5,
        174,
        { align: "center" }
      );

      // ----------------------------------------
      // Footer
      // ----------------------------------------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);

      doc.text(
        "CodeNinja Academy",
        148.5,
        186,
        { align: "center" }
      );

      // ----------------------------------------
      // Download
      // ----------------------------------------
      doc.save(
        `CodeNinja-Certificate-${course.title.replace(
          /[^a-z0-9]/gi,
          "-"
        )}.pdf`
      );

      alert(
        `Certificate downloaded successfully!\n\nCertificate ID:\n${certificateId}`
      );
    } catch (error) {
      console.error("Certificate generation error:", error);

      alert(
        "Unable to generate the certificate. Please try again."
      );
    }
  };

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">
            Loading course...
          </div>

          <p className="text-slate-400">
            Please wait.
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================
  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Course Not Found
          </h1>

          <p className="text-slate-400 mb-6">
            {error || "This course could not be found."}
          </p>

          <button
            onClick={() => navigate("/courses")}
            className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN UI
  // ============================================
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ========================================
          HEADER
      ======================================== */}
      <div className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <button
                onClick={() => navigate("/courses")}
                className="text-slate-400 hover:text-white text-sm mb-2"
              >
                ← Back to Courses
              </button>

              <h1 className="text-2xl font-bold">
                {course.title}
              </h1>

              <p className="text-slate-400 mt-1">
                {course.category} • {course.level}
              </p>
            </div>

            <div className="min-w-[220px]">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">
                  Course Progress
                </span>

                <span className="font-semibold">
                  {progressPercentage}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ====================================
              LESSON SIDEBAR
          ==================================== */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h2 className="font-bold">
                  Course Lessons
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  {progress.length} of {lessons.length} completed
                </p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {lessons.map((lesson, index) => {
                  const completed = progress.includes(
                    lesson.id
                  );

                  const active =
                    currentLesson === index;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => goToLesson(index)}
                      className={`w-full text-left p-4 border-b border-slate-800 transition ${
                        active
                          ? "bg-blue-600/20 border-l-4 border-l-blue-500"
                          : "hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            completed
                              ? "bg-green-500 text-white"
                              : active
                              ? "bg-blue-500 text-white"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {completed
                            ? "✓"
                            : index + 1}
                        </div>

                        <div>
                          <div className="font-medium text-sm">
                            {lesson.title}
                          </div>

                          <div className="text-xs text-slate-500 mt-1">
                            Lesson {index + 1}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ====================================
              LESSON CONTENT
          ==================================== */}
          <main className="lg:col-span-3">
            {lessons.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-blue-400 text-sm font-semibold">
                      Lesson {currentLesson + 1} of{" "}
                      {lessons.length}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      {lessons[currentLesson].title}
                    </h2>
                  </div>

                  {progress.includes(
                    lessons[currentLesson].id
                  ) && (
                    <div className="px-3 py-2 rounded-lg bg-green-500/10 text-green-400 text-sm font-semibold">
                      ✓ Completed
                    </div>
                  )}
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 text-lg leading-8">
                    {lessons[currentLesson].content}
                  </p>
                </div>

                {/* ==================================
                    LESSON ACTIONS
                ================================== */}
                <div className="mt-10 pt-6 border-t border-slate-800">
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                    <button
                      onClick={() =>
                        setCurrentLesson(
                          Math.max(0, currentLesson - 1)
                        )
                      }
                      disabled={currentLesson === 0}
                      className="px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      ← Previous
                    </button>

                    {!progress.includes(
                      lessons[currentLesson].id
                    ) ? (
                      <button
                        onClick={markLessonComplete}
                        className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition"
                      >
                        Mark as Complete
                      </button>
                    ) : currentLesson <
                      lessons.length - 1 ? (
                      <button
                        onClick={() =>
                          setCurrentLesson(
                            currentLesson + 1
                          )
                        }
                        className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition"
                      >
                        Next Lesson →
                      </button>
                    ) : (
                      <div className="text-green-400 font-semibold flex items-center">
                        ✓ All lessons completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ====================================
                COURSE COMPLETION
            ==================================== */}
            {isCourseComplete && (
              <div className="mt-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div>
                    <div className="text-green-400 font-bold text-xl">
                      🎉 Course Completed!
                    </div>

                    <p className="text-slate-300 mt-2">
                      Congratulations! You have completed
                      all lessons in this course.
                    </p>

                    <p className="text-slate-400 text-sm mt-2">
                      Your completion progress is{" "}
                      {progressPercentage}%.
                    </p>
                  </div>

                  <button
                    onClick={downloadCertificate}
                    className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold transition whitespace-nowrap"
                  >
                    Download Certificate
                  </button>
                </div>
              </div>
            )}

            {/* ====================================
                QUIZ
            ==================================== */}
            {isCourseComplete && (
              <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      Ready for the Quiz?
                    </h3>

                    <p className="text-slate-400 mt-1">
                      Test your knowledge of this course.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/quiz/${course.id}`)
                    }
                    className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold transition"
                  >
                    Take Quiz →
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default LearnCourse;