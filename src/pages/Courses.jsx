import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import coursesData from "../data/courses";

function Courses() {
  const [courses, setCourses] = useState(coursesData);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  // Get courses from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        return response.json();
      })
      .then((data) => {
        // Backend currently provides basic course information.
        // Merge it with the existing local course data so
        // descriptions, icons, curriculum, etc. continue working.
        const mergedCourses = data.map((apiCourse) => {
          const localCourse = coursesData.find(
            (course) => course.id === apiCourse.id
          );

          return {
            ...localCourse,
            ...apiCourse,
          };
        });

        setCourses(mergedCourses);
        setApiConnected(true);
      })
      .catch((error) => {
        console.error("Course API error:", error);

        // Keep the existing local courses if backend is unavailable.
        setCourses(coursesData);
        setApiConnected(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(courses.map((course) => course.category))];
  }, [courses]);

  const levels = useMemo(() => {
    return ["All", ...new Set(courses.map((course) => course.level))];
  }, [courses]);

  const getCourseProgress = (course) => {
    const savedProgress = localStorage.getItem(
      `course-progress-${course.id}`
    );

    if (!savedProgress) {
      return 0;
    }

    try {
      const completedLessons = JSON.parse(savedProgress);

      if (!Array.isArray(completedLessons)) {
        return 0;
      }

      const totalLessons = course.curriculum?.length || 0;

      if (totalLessons === 0) {
        return 0;
      }

      return Math.min(
        100,
        Math.round((completedLessons.length / totalLessons) * 100)
      );
    } catch {
      return 0;
    }
  };

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter((course) => {
        return (
          course.title?.toLowerCase().includes(search) ||
          course.shortTitle?.toLowerCase().includes(search) ||
          course.description?.toLowerCase().includes(search)
        );
      });
    }

    // Category
    if (category !== "All") {
      result = result.filter(
        (course) => course.category === category
      );
    }

    // Level
    if (level !== "All") {
      result = result.filter(
        (course) => course.level === level
      );
    }

    // Sorting
    if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (sortBy === "popular") {
      result.sort((a, b) => {
        const studentsA = Number(a.students) || 0;
        const studentsB = Number(b.students) || 0;

        return studentsB - studentsA;
      });
    }

    if (sortBy === "lessons") {
      result.sort(
        (a, b) =>
          (b.lessons || b.curriculum?.length || 0) -
          (a.lessons || a.curriculum?.length || 0)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [courses, searchTerm, category, level, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setLevel("All");
    setSortBy("rating");
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <p className="text-blue-600 font-semibold mb-2">
              CodeNinja Academy
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
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
                <span className="text-sm text-green-600 font-medium">
                  ✓ Courses loaded from backend
                </span>
              ) : (
                <span className="text-sm text-amber-600 font-medium">
                  Using local course data
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
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
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl bg-white outline-none focus:border-blue-500"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All Categories"
                    : item}
                </option>
              ))}
            </select>

            {/* Level */}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl bg-white outline-none focus:border-blue-500"
            >
              {levels.map((item) => (
                <option key={item} value={item}>
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
                className="px-4 py-3 border border-slate-300 rounded-xl bg-white outline-none focus:border-blue-500"
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
          <div className="flex flex-wrap items-center gap-2 mt-4">
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
                className="text-sm text-blue-600 font-medium hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Courses */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-slate-600">
              Loading courses...
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-900">
              No courses found
            </h2>

            <p className="mt-2 text-slate-600">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => {
              const progress = getCourseProgress(course);
              const isCompleted = progress === 100;
              const isStarted =
                progress > 0 && progress < 100;

              const Icon = course.icon;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Course icon */}
                  <div
                    className={`h-40 flex items-center justify-center ${
                      course.color || "bg-blue-100"
                    }`}
                  >
                    {Icon ? (
                      <Icon
                        size={56}
                        strokeWidth={1.5}
                        className="text-slate-700"
                      />
                    ) : (
                      <BookOpenFallback />
                    )}
                  </div>

                  <div className="p-5">
                    {/* Category + level */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                        {course.category}
                      </span>

                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                        {course.level}
                      </span>
                    </div>

                    {/* Completed badge */}
                    {isCompleted && (
                      <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold mb-2">
                        <CheckCircle2 size={17} />
                        ✓ Completed
                      </div>
                    )}

                    <h2 className="text-xl font-bold text-slate-900">
                      {course.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Progress */}
                    <div className="mt-5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">
                          Progress
                        </span>

                        <span className="font-semibold text-slate-900">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                      {isCompleted && (
                        <p className="text-xs text-green-600 font-medium mt-2">
                          Course Completed
                        </p>
                      )}
                    </div>

                    {/* Action */}
                    <Link
                      to={`/courses/${course.id}`}
                      className="block text-center mt-5 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
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

// Simple fallback icon
function BookOpenFallback() {
  return (
    <div className="text-5xl">
      📚
    </div>
  );
}

export default Courses;