const Database = require("better-sqlite3");

const db = new Database("codeninja.db");

console.log("Database connected successfully.");

// Enable foreign keys
db.pragma("foreign_keys = ON");

// ===============================
// USERS TABLE
// ===============================

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();


// ===============================
// COURSES TABLE
// ===============================

db.prepare(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    duration_days INTEGER DEFAULT 7
  )
`).run();


// ===============================
// PROGRESS TABLE
// ===============================

db.prepare(`
  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    completed_lessons TEXT DEFAULT '[]',
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, course_id),

    FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

    FOREIGN KEY(course_id)
      REFERENCES courses(id)
      ON DELETE CASCADE
  )
`).run();


// ===============================
// QUIZ SCORES TABLE
// ===============================

db.prepare(`
  CREATE TABLE IF NOT EXISTS quiz_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, course_id),

    FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

    FOREIGN KEY(course_id)
      REFERENCES courses(id)
      ON DELETE CASCADE
  )
`).run();


// ===============================
// COURSE ENROLLMENTS TABLE
// ===============================
//
// This table controls the student's
// course timer and deadline.
//

db.prepare(`
  CREATE TABLE IF NOT EXISTS course_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    course_id INTEGER NOT NULL,

    started_at TEXT NOT NULL,

    deadline TEXT NOT NULL,

    completed_at TEXT,

    status TEXT DEFAULT 'active',

    UNIQUE(user_id, course_id),

    FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

    FOREIGN KEY(course_id)
      REFERENCES courses(id)
      ON DELETE CASCADE
  )
`).run();


// ===============================
// ADD duration_days TO OLD DATABASE
// ===============================

try {
  db.prepare(`
    ALTER TABLE courses
    ADD COLUMN duration_days INTEGER DEFAULT 7
  `).run();

  console.log("duration_days column added.");
} catch (error) {
  // Column already exists
}


// ===============================
// INSERT / UPDATE COURSES
// ===============================

const courses = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    category: "Computer Science",
    level: "Intermediate",
    duration: 7
  },
  {
    id: 2,
    title: "Full Stack Web Development",
    category: "Web Development",
    level: "Intermediate",
    duration: 14
  },
  {
    id: 3,
    title: "Artificial Intelligence",
    category: "Artificial Intelligence",
    level: "Beginner",
    duration: 7
  },
  {
    id: 4,
    title: "Database Management",
    category: "Database",
    level: "Beginner",
    duration: 7
  },
  {
    id: 5,
    title: "Android App Development",
    category: "Mobile Development",
    level: "Intermediate",
    duration: 10
  },
  {
    id: 6,
    title: "Cybersecurity Fundamentals",
    category: "Cybersecurity",
    level: "Beginner",
    duration: 7
  },
  {
    id: 7,
    title: "Data Analytics",
    category: "Data Science",
    level: "Intermediate",
    duration: 10
  },
  {
    id: 8,
    title: "Backend Development",
    category: "Web Development",
    level: "Intermediate",
    duration: 10
  }
];

const insertCourse = db.prepare(`
  INSERT OR IGNORE INTO courses
  (id, title, category, level, duration_days)
  VALUES (?, ?, ?, ?, ?)
`);

const updateCourse = db.prepare(`
  UPDATE courses
  SET
    title = ?,
    category = ?,
    level = ?,
    duration_days = ?
  WHERE id = ?
`);

const updateCourses = db.transaction(() => {
  for (const course of courses) {
    insertCourse.run(
      course.id,
      course.title,
      course.category,
      course.level,
      course.duration
    );

    updateCourse.run(
      course.title,
      course.category,
      course.level,
      course.duration,
      course.id
    );
  }
});

updateCourses();


// ===============================
// DATABASE INFORMATION
// ===============================

console.log("All tables are ready.");

const courseCount = db
  .prepare("SELECT COUNT(*) AS count FROM courses")
  .get();

console.log("Courses in database:", courseCount.count);

const courseList = db
  .prepare(`
    SELECT id, title, duration_days
    FROM courses
    ORDER BY id
  `)
  .all();

console.log("Course durations:");

courseList.forEach((course) => {
  console.log(
    `${course.id}. ${course.title} - ${course.duration_days} days`
  );
});


// ===============================
// EXPORT DATABASE
// ===============================

module.exports = db;