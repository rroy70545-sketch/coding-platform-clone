import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

function CourseCard({ course }) {
  const Icon = course.icon;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

      {/* Course Icon */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="flex items-start justify-between">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <Icon size={25} />
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
            {course.category}
          </span>

        </div>
      </div>

      {/* Course Information */}
      <div className="p-6">

        <h3 className="text-xl font-extrabold text-gray-900">
          {course.title}
        </h3>

        <p className="mt-3 min-h-14 text-sm leading-6 text-gray-600">
          {course.description}
        </p>

        {/* Rating */}
        <div className="mt-5 flex items-center gap-3 text-sm">

          <div className="flex items-center gap-1 font-bold text-gray-900">
            <Star
              size={16}
              className="fill-yellow-400 text-yellow-400"
            />

            {course.rating}
          </div>

          <span className="text-gray-300">
            •
          </span>

          <span className="text-gray-500">
            {course.students} learners
          </span>

        </div>

        {/* Bottom */}
        <div className="mt-5 border-t border-gray-100 pt-5">

          <div className="flex items-center justify-between">

            <span className="text-sm font-semibold text-gray-500">
              {course.level}
            </span>

            <Link
              to={`/courses/${course.id}`}
              className="flex items-center gap-1 text-sm font-bold text-blue-600 transition-all group-hover:gap-2"
            >
              View course
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </div>
    </article>
  );
}

export default CourseCard;