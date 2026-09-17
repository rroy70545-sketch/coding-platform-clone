const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "codeninja.db");

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

// =====================================================
// USERS TABLE
// =====================================================

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// =====================================================
// COURSES TABLE
// =====================================================

db.prepare(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    level TEXT
  )
`).run();

// =====================================================
// PROGRESS TABLE
// =====================================================

db.prepare(`
  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    completed_lessons TEXT DEFAULT '[]',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, course_id),

    FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

    FOREIGN KEY(course_id)
      REFERENCES courses(id)
      ON DELETE CASCADE
  )
`).run();

// =====================================================
// QUIZ SCORES TABLE
// =====================================================

db.prepare(`
  CREATE TABLE IF NOT EXISTS quiz_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER,
    total_questions INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

    FOREIGN KEY(course_id)
      REFERENCES courses(id)
      ON DELETE CASCADE
  )
`).run();

// =====================================================
// FIX EXISTING QUIZ SCORES TABLE
// =====================================================

try {
  const quizColumns = db
    .prepare("PRAGMA table_info(quiz_scores)")
    .all();

  const columnNames = quizColumns.map(
    (column) => column.name
  );

  // Add total if it does not exist
  if (!columnNames.includes("total")) {
    db.prepare(`
      ALTER TABLE quiz_scores
      ADD COLUMN total INTEGER
    `).run();

    console.log("Added missing 'total' column.");
  }

  // Add total_questions if it does not exist
  if (!columnNames.includes("total_questions")) {
    db.prepare(`
      ALTER TABLE quiz_scores
      ADD COLUMN total_questions INTEGER NOT NULL DEFAULT 0
    `).run();

    console.log(
      "Added missing 'total_questions' column."
    );
  }

  // Copy total into total_questions where needed
  db.prepare(`
    UPDATE quiz_scores
    SET total_questions = total
    WHERE total_questions = 0
      AND total IS NOT NULL
  `).run();

} catch (error) {
  console.error(
    "Quiz scores table update error:",
    error.message
  );
}

// =====================================================
// INSERT COURSES
// =====================================================

const insertCourse = db.prepare(`
  INSERT OR IGNORE INTO courses
  (id, title, category, level)
  VALUES (?, ?, ?, ?)
`);

const courses = [
  [
    1,
    "Data Structures & Algorithms",
    "Computer Science",
    "Intermediate",
  ],
  [
    2,
    "Full Stack Web Development",
    "Web Development",
    "Intermediate",
  ],
  [
    3,
    "Artificial Intelligence",
    "Artificial Intelligence",
    "Beginner",
  ],
  [
    4,
    "Database Management",
    "Database",
    "Beginner",
  ],
  [
    5,
    "Android App Development",
    "Mobile Development",
    "Intermediate",
  ],
  [
    6,
    "Cybersecurity Fundamentals",
    "Cybersecurity",
    "Beginner",
  ],
  [
    7,
    "Data Analytics",
    "Data Science",
    "Intermediate",
  ],
  [
    8,
    "Backend Development",
    "Web Development",
    "Intermediate",
  ],
];

const insertCourses = db.transaction(() => {
  for (const course of courses) {
    insertCourse.run(...course);
  }
});

insertCourses();

// =====================================================
// CHECK DATABASE
// =====================================================

const courseCount = db
  .prepare("SELECT COUNT(*) AS count FROM courses")
  .get();

console.log("Database connected successfully.");
console.log("All tables are ready.");
console.log(`Courses in database: ${courseCount.count}`);

// =====================================================
// SHOW QUIZ SCORE COLUMNS
// =====================================================

const quizTableInfo = db
  .prepare("PRAGMA table_info(quiz_scores)")
  .all();

console.log(
  "Quiz score columns:",
  quizTableInfo.map((column) => column.name)
);

// =====================================================
// EXPORT DATABASE
// =====================================================

module.exports = db;