import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

import coursesData from "../data/courses";

const API_URL = "http://localhost:5000";

// Every course currently has 10 lessons
const TOTAL_LESSONS = 10;

function Courses() {
  const [courses, setCourses] = useState(coursesData);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  // ============================================
  // LOAD COURSES FROM BACKEND
  // ============================================

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/api/courses`);

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        console.log("Course API response:", data);

        if (!data.success || !Array.isArray(data.courses)) {
          throw new Error("Invalid course API response");
        }

        const mergedCourses = data.courses.map((apiCourse) => {
          const localCourse = coursesData.find(
            (course) =>
              Number(course.id) === Number(apiCourse.id)
          );

          return {
            ...(localCourse || {}),
            ...apiCourse,

            description:
              apiCourse.description ||
              localCourse?.description ||
              "Learn important concepts and practical skills through this course.",

            shortTitle:
              apiCourse.shortTitle ||
              localCourse?.shortTitle ||
              apiCourse.title,

            icon: localCourse?.icon || BookOpen,

            color:
              localCourse?.color ||
              "bg-blue-100",

            rating:
              apiCourse.rating ??
              localCourse?.rating ??
              0,

            students:
              apiCourse.students ??
              localCourse?.students ??
              0,

            // IMPORTANT:
            // LearnCourse.jsx contains 10 lessons.
            lessons: TOTAL_LESSONS,
          };
        });

        setCourses(mergedCourses);
        setApiConnected(true);
      } catch (error) {
        console.error("Course API error:", error);

        // Keep local courses as fallback
        setCourses(
          coursesData.map((course) => ({
            ...course,
            lessons: TOTAL_LESSONS,
          }))
        );

        setApiConnected(false);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // ============================================
  // CATEGORIES
  // ============================================

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        courses
          .map((course) => course.category)
          .filter(Boolean)
      ),
    ];
  }, [courses]);

  // ============================================
  // LEVELS
  // ============================================

  const levels = useMemo(() => {
    return [
      "All",
      ...new Set(
        courses
          .map((course) => course.level)
          .filter(Boolean)
      ),
    ];
  }, [courses]);

  // ============================================
  // GET CURRENT USER
  // ============================================

  const getCurrentUser = () => {
    const userData = localStorage.getItem(
      "codeninja-user"
    );

    if (!userData) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  };

  // ============================================
  // GET COURSE PROGRESS
  // ============================================

  const getCourseProgress = (course) => {
    const currentUser = getCurrentUser();

    const storageKey = currentUser?.id
      ? `course-progress-${currentUser.id}-${course.id}`
      : `course-progress-guest-${course.id}`;

    const savedProgress =
      localStorage.getItem(storageKey);

    if (!savedProgress) {
      return {
        completed: 0,
        percentage: 0,
      };
    }

    try {
      const completedLessons =
        JSON.parse(savedProgress);

      if (!Array.isArray(completedLessons)) {
        return {
          completed: 0,
          percentage: 0,
        };
      }

      const completed = Math.min(
        completedLessons.length,
        TOTAL_LESSONS
      );

      const percentage = Math.min(
        100,
        Math.round(
          (completed / TOTAL_LESSONS) * 100
        )
      );

      return {
        completed,
        percentage,
      };
    } catch {
      return {
        completed: 0,
        percentage: 0,
      };
    }
  };

  // ============================================
  // FILTER + SORT
  // ============================================

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search
    if (searchTerm.trim()) {
      const search =
        searchTerm.toLowerCase();

      result = result.filter((course) => {
        return (
          course.title
            ?.toLowerCase()
            .includes(search) ||
          course.shortTitle
            ?.toLowerCase()
            .includes(search) ||
          course.description
            ?.toLowerCase()
            .includes(search)
        );
      });
    }

    // Category
    if (category !== "All") {
      result = result.filter(
        (course) =>
          course.category === category
      );
    }

    // Level
    if (level !== "All") {
      result = result.filter(
        (course) =>
          course.level === level
      );
    }

    // Rating
    if (sortBy === "rating") {
      result.sort(
        (a, b) =>
          (b.rating || 0) -
          (a.rating || 0)
      );
    }

    // Popular
    if (sortBy === "popular") {
      result.sort((a, b) => {
        const studentsA =
          Number(a.students) || 0;

        const studentsB =
          Number(b.students) || 0;

        return studentsB - studentsA;
      });
    }

    // Lessons
    if (sortBy === "lessons") {
      result.sort(
        () => 0
      );
    }

    // Name
    if (sortBy === "name") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [
    courses,
    searchTerm,
    category,
    level,
    sortBy,
  ]);

  // ============================================
  // CLEAR FILTERS
  // ============================================

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setLevel("All");
    setSortBy("rating");
  };

  // ============================================
  // UI
  // ============================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ========================================
          HEADER
      ======================================== */}

      <section className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <p className="mb-2 font-semibold text-blue-600">
              CodeNinja Academy
            </p>

            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
              Explore Courses
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              Learn programming, web development, AI,
              cybersecurity and more.
            </p>

            {/* Backend status */}

            <div className="mt-4">

              {loading ? (

                <span className="text-sm text-slate-500">
                  Connecting to course server...
                </span>

              ) : apiConnected ? (

                <span className="font-medium text-sm text-green-600">
                  ✓ Courses loaded from backend
                </span>

              ) : (

                <span className="font-medium text-sm text-amber-600">
                  Using local course data
                </span>

              )}

            </div>

          </div>

        </div>

      </section>

      {/* ========================================
          FILTERS
      ======================================== */}

      <section className="sticky top-0 z-20 border-b bg-white">

        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 lg:flex-row">

            {/* Search */}

            <div className="relative flex-1">

              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Category */}

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >

              {categories.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "All Categories"
                    : item}
                </option>

              ))}

            </select>

            {/* Level */}

            <select
              value={level}
              onChange={(e) =>
                setLevel(e.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >

              {levels.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "All Levels"
                    : item}
                </option>

              ))}

            </select>

            {/* Sort */}

            <div className="flex items-center gap-2">

              <SlidersHorizontal
                size={18}
                className="text-slate-500"
              />

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >

                <option value="rating">
                  Highest Rating
                </option>

                <option value="popular">
                  Most Popular
                </option>

                <option value="lessons">
                  Most Lessons
                </option>

                <option value="name">
                  Course Name A–Z
                </option>

              </select>

            </div>

          </div>

          {/* Filter info */}

          <div className="mt-4 flex flex-wrap items-center gap-2">

            <span className="text-sm text-slate-600">

              Showing{" "}

              <strong>
                {filteredCourses.length}
              </strong>{" "}

              courses

            </span>

            {(searchTerm ||
              category !== "All" ||
              level !== "All" ||
              sortBy !== "rating") && (

              <button
                onClick={clearFilters}
                className="font-medium text-sm text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>

            )}

          </div>

        </div>

      </section>

      {/* ========================================
          COURSES
      ======================================== */}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {loading ? (

          <div className="py-20 text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

            <p className="mt-4 text-slate-600">
              Loading courses...
            </p>

          </div>

        ) : filteredCourses.length === 0 ? (

          <div className="py-20 text-center">

            <h2 className="text-2xl font-bold text-slate-900">
              No courses found
            </h2>

            <p className="mt-2 text-slate-600">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredCourses.map((course) => {

              const progressData =
                getCourseProgress(course);

              const progress =
                progressData.percentage;

              const completedLessons =
                progressData.completed;

              const isCompleted =
                progress === 100;

              const isStarted =
                progress > 0 &&
                progress < 100;

              const Icon =
                course.icon || BookOpen;

              // IMPORTANT:
              // Always use 10 lessons.
              const totalLessons =
                TOTAL_LESSONS;

              return (

                <div
                  key={course.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-xl"
                >

                  {/* Course icon */}

                  <div
                    className={`flex h-40 items-center justify-center ${
                      course.color ||
                      "bg-blue-100"
                    }`}
                  >

                    <Icon
                      size={56}
                      strokeWidth={1.5}
                      className="text-slate-700"
                    />

                  </div>

                  <div className="p-5">

                    {/* Category + level */}

                    <div className="mb-3 flex flex-wrap gap-2">

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {course.category}
                      </span>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {course.level}
                      </span>

                    </div>

                    {/* Completed badge */}

                    {isCompleted && (

                      <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-green-600">

                        <CheckCircle2 size={17} />

                        ✓ Completed

                      </div>

                    )}

                    {/* Title */}

                    <h2 className="text-xl font-bold text-slate-900">
                      {course.title}
                    </h2>

                    {/* Description */}

                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                      {course.description}
                    </p>

                    {/* Lesson count */}

                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">

                      <BookOpen size={16} />

                      <span>
                        {totalLessons} lessons
                      </span>

                    </div>

                    {/* Progress */}

                    <div className="mt-4">

                      <div className="mb-2 flex justify-between text-sm">

                        <span className="text-slate-600">
                          Progress
                        </span>

                        <span className="font-semibold text-slate-900">
                          {progress}%
                        </span>

                      </div>

                      {/* Progress Bar */}

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                      {/* Exact Lesson Progress */}

                      <p className="mt-2 text-xs text-slate-500">

                        {completedLessons} / {totalLessons} lessons completed

                      </p>

                    </div>

                    {/* Action */}

                    <Link
                      to={`/courses/${course.id}`}
                      className="mt-5 block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
                    >

                      {isCompleted
                        ? "View Completed Course"
                        : isStarted
                        ? "Continue Learning"
                        : "View Course"}

                    </Link>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </main>

    </div>
  );
}

export default Courses;