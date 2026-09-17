import { ArrowRight, BookOpen, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

import courses from "../data/courses";

function PopularCourses() {
  const popularCourses = courses.slice(0, 4);

  const getCourseProgress = (course) => {
    try {
      const savedProgress = JSON.parse(
        localStorage.getItem(`course-progress-${course.id}`) || "[]"
      );

      if (!Array.isArray(savedProgress) || !course.curriculum?.length) {
        return 0;
      }

      const completed = savedProgress.filter((item) =>
        course.curriculum.some(
          (_, index) => index === item || index + 1 === item
        )
      ).length;

      return Math.min(
        100,
        Math.round((completed / course.curriculum.length) * 100)
      );
    } catch {
      return 0;
    }
  };

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
              <BookOpen size={14} />
              Start Learning
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Popular Courses
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Explore our most popular courses and build practical skills
              through structured lessons and projects.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
          >
            View All Courses
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Course Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularCourses.map((course) => {
            const Icon = course.icon;
            const progress = getCourseProgress(course);

            return (
              <div
                key={course.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                {/* Course Top */}
                <div
                  className={`bg-gradient-to-br ${course.color} p-6`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur">
                      <Icon size={25} />
                    </div>

                    {progress === 100 && (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-green-600">
                        ✓ Completed
                      </span>
                    )}
                  </div>

                  <p className="mt-6 text-xs font-bold uppercase tracking-wider text-white/80">
                    {course.category}
                  </p>

                  <h3 className="mt-2 min-h-[56px] text-xl font-extrabold leading-7 text-white">
                    {course.title}
                  </h3>
                </div>

                {/* Course Content */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                    {course.description}
                  </p>

                  {/* Rating & Students */}
                  <div className="mt-5 flex items-center justify-between border-b border-slate-100 pb-4 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Star
                        size={15}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      {course.rating}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Users size={14} />
                      {course.students}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>{course.level}</span>
                    <span>{course.duration}</span>
                    <span>{course.lessons} lessons</span>
                  </div>

                  {/* Progress */}
                  {progress > 0 && (
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">
                          Your Progress
                        </span>

                        <span className="font-bold text-blue-600">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Button */}
                  <Link
                    to={`/courses/${course.id}`}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                  >
                    {progress > 0 ? "Continue Learning" : "View Course"}
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PopularCourses;