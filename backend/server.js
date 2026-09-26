const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 5000;

// =====================================================
// BASIC CONFIGURATION
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// COURSE SETTINGS
// =====================================================

// Every course currently contains:
// 7 days × 2 topics = 14 topics
const TOTAL_TOPICS_PER_COURSE = 14;

const COURSE_DURATION_DAYS = 7;

// =====================================================
// CREATE ENROLLMENTS TABLE IF IT DOES NOT EXIST
// =====================================================
//
// This keeps your existing database working.
// You do NOT need to delete codeninja.db.
//

db.prepare(`
  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    started_at TEXT,
    deadline TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
  )
`).run();

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function getUser(userId) {
  return db
    .prepare(
      `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = ?
      `
    )
    .get(userId);
}

function getCourse(courseId) {
  return db
    .prepare(
      `
      SELECT *
      FROM courses
      WHERE id = ?
      `
    )
    .get(courseId);
}

function parseCompletedLessons(value) {
  try {
    const parsed = JSON.parse(value || "[]");

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

function getDaysLeft(deadline) {
  if (!deadline) {
    return null;
  }

  const now = Date.now();
  const end = new Date(deadline).getTime();

  if (Number.isNaN(end)) {
    return null;
  }

  const difference = end - now;

  if (difference <= 0) {
    return 0;
  }

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
}

function getEnrollment(userId, courseId) {
  const enrollment = db
    .prepare(
      `
      SELECT *
      FROM enrollments
      WHERE user_id = ? AND course_id = ?
      `
    )
    .get(userId, courseId);

  if (!enrollment) {
    return null;
  }

  const daysLeft = getDaysLeft(enrollment.deadline);

  // Automatically mark an active course as expired
  // when its deadline has passed.
  if (
    enrollment.status === "active" &&
    daysLeft === 0
  ) {
    db.prepare(
      `
      UPDATE enrollments
      SET status = 'expired',
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND course_id = ?
      `
    ).run(userId, courseId);

    enrollment.status = "expired";
  }

  return {
    ...enrollment,
    completed:
      Boolean(enrollment.completed),
    daysLeft,
  };
}

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is working",
  });
});

// =====================================================
// DATABASE TEST
// =====================================================

app.get("/api/database-test", (req, res) => {
  try {
    const result = db
      .prepare("SELECT 1 AS test")
      .get();

    res.json({
      success: true,
      message: "Database connection is working",
      result,
    });
  } catch (error) {
    console.error(
      "Database test error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// =====================================================
// GET ALL COURSES
// =====================================================

app.get("/api/courses", (req, res) => {
  try {
    const courses = db
      .prepare(
        "SELECT * FROM courses ORDER BY id"
      )
      .all();

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error(
      "Get courses error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
});

// =====================================================
// GET SINGLE COURSE
// =====================================================

app.get("/api/courses/:id", (req, res) => {
  try {
    const courseId = Number(
      req.params.id
    );

    if (!Number.isInteger(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = getCourse(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error(
      "Get course error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
});

// =====================================================
// SIGN UP
// =====================================================

app.post("/api/signup", (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    const existingUser = db
      .prepare(
        "SELECT * FROM users WHERE email = ?"
      )
      .get(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const result = db
      .prepare(
        `
        INSERT INTO users
        (name, email, password)
        VALUES (?, ?, ?)
        `
      )
      .run(
        name,
        email,
        password
      );

    const user = db
      .prepare(
        `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
        `
      )
      .get(
        result.lastInsertRowid
      );

    res.status(201).json({
      success: true,
      message:
        "Account created successfully",
      user,
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message,
    });
  }
});

// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const user = db
      .prepare(
        `
        SELECT id, name, email, created_at
        FROM users
        WHERE email = ? AND password = ?
        `
      )
      .get(
        email,
        password
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

// =====================================================
// GET USER
// =====================================================

app.get("/api/users/:id", (req, res) => {
  try {
    const userId = Number(
      req.params.id
    );

    const user = getUser(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE USER PROFILE
// =====================================================

app.put("/api/users/:id", (req, res) => {
  try {
    const userId = Number(
      req.params.id
    );

    const {
      name,
      email,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Name and email are required",
      });
    }

    const existingUser = db
      .prepare(
        `
        SELECT id
        FROM users
        WHERE email = ? AND id != ?
        `
      )
      .get(
        email,
        userId
      );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email is already being used",
      });
    }

    db.prepare(
      `
      UPDATE users
      SET name = ?, email = ?
      WHERE id = ?
      `
    ).run(
      name,
      email,
      userId
    );

    const user = getUser(userId);

    res.json({
      success: true,
      message:
        "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update profile",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE PASSWORD
// =====================================================

app.put(
  "/api/users/:id/password",
  (req, res) => {
    try {
      const userId = Number(
        req.params.id
      );

      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current password and new password are required",
        });
      }

      const user = db
        .prepare(
          "SELECT * FROM users WHERE id = ?"
        )
        .get(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (
        user.password !==
        currentPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      db.prepare(
        `
        UPDATE users
        SET password = ?
        WHERE id = ?
        `
      ).run(
        newPassword,
        userId
      );

      res.json({
        success: true,
        message:
          "Password updated successfully",
      });
    } catch (error) {
      console.error(
        "Password update error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update password",
        error: error.message,
      });
    }
  }
);

// =====================================================
// START COURSE
// =====================================================
//
// POST:
// /api/enrollment/:userId/:courseId/start
//
// Starts a 7-day course countdown.
//

app.post(
  "/api/enrollment/:userId/:courseId/start",
  (req, res) => {
    try {
      const userId = Number(
        req.params.userId
      );

      const courseId = Number(
        req.params.courseId
      );

      if (
        !Number.isInteger(userId) ||
        !Number.isInteger(courseId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid user ID or course ID",
        });
      }

      const user = getUser(userId);
      const course = getCourse(courseId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      const existing = db
        .prepare(
          `
          SELECT *
          FROM enrollments
          WHERE user_id = ?
          AND course_id = ?
          `
        )
        .get(
          userId,
          courseId
        );

      // -------------------------------------------------
      // Existing active course
      // -------------------------------------------------

      if (
        existing &&
        existing.status === "active"
      ) {
        const enrollment =
          getEnrollment(
            userId,
            courseId
          );

        return res.json({
          success: true,
          message:
            "Course is already active",
          enrollment,
        });
      }

      // -------------------------------------------------
      // Existing completed course
      // -------------------------------------------------

      if (
        existing &&
        existing.status ===
          "completed"
      ) {
        const enrollment =
          getEnrollment(
            userId,
            courseId
          );

        return res.json({
          success: true,
          message:
            "Course has already been completed",
          enrollment,
        });
      }

      // -------------------------------------------------
      // New enrollment
      // -------------------------------------------------

      const startedAt =
        new Date();

      const deadline =
        new Date(
          startedAt.getTime() +
            COURSE_DURATION_DAYS *
              24 *
              60 *
              60 *
              1000
        );

      if (existing) {
        db.prepare(
          `
          UPDATE enrollments
          SET status = 'active',
              started_at = ?,
              deadline = ?,
              completed = 0,
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
          AND course_id = ?
          `
        ).run(
          startedAt.toISOString(),
          deadline.toISOString(),
          userId,
          courseId
        );
      } else {
        db.prepare(
          `
          INSERT INTO enrollments
          (
            user_id,
            course_id,
            status,
            started_at,
            deadline,
            completed
          )
          VALUES (?, ?, 'active', ?, ?, 0)
          `
        ).run(
          userId,
          courseId,
          startedAt.toISOString(),
          deadline.toISOString()
        );
      }

      const enrollment =
        getEnrollment(
          userId,
          courseId
        );

      res.json({
        success: true,
        message:
          "Course started successfully",
        enrollment,
      });
    } catch (error) {
      console.error(
        "Start course error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to start course",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET COURSE ENROLLMENT
// =====================================================

app.get(
  "/api/enrollment/:userId/:courseId",
  (req, res) => {
    try {
      const userId = Number(
        req.params.userId
      );

      const courseId = Number(
        req.params.courseId
      );

      const enrollment =
        getEnrollment(
          userId,
          courseId
        );

      if (!enrollment) {
        return res.json({
          success: true,
          enrollment: null,
        });
      }

      res.json({
        success: true,
        enrollment,
      });
    } catch (error) {
      console.error(
        "Get enrollment error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch enrollment",
        error: error.message,
      });
    }
  }
);

// =====================================================
// SAVE COURSE PROGRESS
// =====================================================
//
// IMPORTANT FIX:
//
// There is NO 10-topic limitation here.
//
// The backend accepts all topic IDs, including:
// 11
// 12
// 13
// 14
//
// Course completion happens at 14 completed topics.
//

app.post(
  "/api/progress/:userId/:courseId",
  (req, res) => {
    try {
      const userId = Number(
        req.params.userId
      );

      const courseId = Number(
        req.params.courseId
      );

      if (
        !Number.isInteger(userId) ||
        !Number.isInteger(courseId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid user ID or course ID",
        });
      }

      // -------------------------------------------------
      // Validate user
      // -------------------------------------------------

      const user = getUser(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // -------------------------------------------------
      // Validate course
      // -------------------------------------------------

      const course = getCourse(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // -------------------------------------------------
      // Accept both frontend naming styles
      // -------------------------------------------------

      const incoming =
        req.body.completedLessons ??
        req.body.completed_lessons ??
        [];

      if (!Array.isArray(incoming)) {
        return res.status(400).json({
          success: false,
          message:
            "completedLessons must be an array",
        });
      }

      // -------------------------------------------------
      // Remove duplicates
      // -------------------------------------------------

      const completedLessons =
        [...new Set(incoming)];

      // -------------------------------------------------
      // Save progress
      // -------------------------------------------------

      const completedLessonsJson =
        JSON.stringify(
          completedLessons
        );

      const existing = db
        .prepare(
          `
          SELECT id
          FROM progress
          WHERE user_id = ?
          AND course_id = ?
          `
        )
        .get(
          userId,
          courseId
        );

      if (existing) {
        db.prepare(
          `
          UPDATE progress
          SET completed_lessons = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
          AND course_id = ?
          `
        ).run(
          completedLessonsJson,
          userId,
          courseId
        );
      } else {
        db.prepare(
          `
          INSERT INTO progress
          (
            user_id,
            course_id,
            completed_lessons
          )
          VALUES (?, ?, ?)
          `
        ).run(
          userId,
          courseId,
          completedLessonsJson
        );
      }

      // -------------------------------------------------
      // Check whether all 14 topics are completed
      // -------------------------------------------------

      const courseCompleted =
        completedLessons.length >=
        TOTAL_TOPICS_PER_COURSE;

      // -------------------------------------------------
      // Update enrollment status
      // -------------------------------------------------

      let enrollment = getEnrollment(
        userId,
        courseId
      );

      if (enrollment) {
        if (courseCompleted) {
          db.prepare(
            `
            UPDATE enrollments
            SET status = 'completed',
                completed = 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
            AND course_id = ?
            `
          ).run(
            userId,
            courseId
          );
        } else if (
          enrollment.status ===
          "expired"
        ) {
          // Do not reopen an expired course.
        }
      }

      enrollment = getEnrollment(
        userId,
        courseId
      );

      // -------------------------------------------------
      // Get saved progress
      // -------------------------------------------------

      const progress = db
        .prepare(
          `
          SELECT *
          FROM progress
          WHERE user_id = ?
          AND course_id = ?
          `
        )
        .get(
          userId,
          courseId
        );

      res.json({
        success: true,
        message:
          "Progress saved successfully",

        progress,

        completedLessons,

        totalTopics:
          TOTAL_TOPICS_PER_COURSE,

        completedTopics:
          completedLessons.length,

        progressPercentage:
          Math.min(
            100,
            Math.round(
              (completedLessons.length /
                TOTAL_TOPICS_PER_COURSE) *
                100
            )
          ),

        courseCompleted,

        enrollment,
      });
    } catch (error) {
      console.error(
        "Save progress error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to save progress",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET COURSE PROGRESS
// =====================================================

app.get(
  "/api/progress/:userId/:courseId",
  (req, res) => {
    try {
      const userId = Number(
        req.params.userId
      );

      const courseId = Number(
        req.params.courseId
      );

      const progress = db
        .prepare(
          `
          SELECT *
          FROM progress
          WHERE user_id = ?
          AND course_id = ?
          `
        )
        .get(
          userId,
          courseId
        );

      if (!progress) {
        return res.json({
          success: true,

          progress: {
            completed_lessons: "[]",
          },

          completedLessons: [],

          totalTopics:
            TOTAL_TOPICS_PER_COURSE,

          completedTopics: 0,

          progressPercentage: 0,

          courseCompleted: false,
        });
      }

      const completedLessons =
        parseCompletedLessons(
          progress.completed_lessons
        );

      const progressPercentage =
        Math.min(
          100,
          Math.round(
            (completedLessons.length /
              TOTAL_TOPICS_PER_COURSE) *
              100
          )
        );

      const courseCompleted =
        completedLessons.length >=
        TOTAL_TOPICS_PER_COURSE;

      res.json({
        success: true,

        progress,

        completedLessons,

        totalTopics:
          TOTAL_TOPICS_PER_COURSE,

        completedTopics:
          completedLessons.length,

        progressPercentage,

        courseCompleted,
      });
    } catch (error) {
      console.error(
        "Get progress error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch progress",
        error: error.message,
      });
    }
  }
);

// =====================================================
// SAVE QUIZ SCORE
// =====================================================

app.post(
  "/api/quiz/:userId/:courseId",
  (req, res) => {
    try {
      const userId = Number(
        req.params.userId
      );

      const courseId = Number(
        req.params.courseId
      );

      const score = Number(
        req.body.score ?? 0
      );

      const totalQuestions =
        Number(
          req.body.total_questions ??
            req.body.total ??
            0
        );

      const existing = db
        .prepare(
          `
          SELECT id
          FROM quiz_scores
          WHERE user_id = ?
          AND course_id = ?
          `
        )
        .get(
          userId,
          courseId
        );

      if (existing) {
        db.prepare(
          `
          UPDATE quiz_scores
          SET score = ?,
              total_questions = ?,
              total = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
          AND course_id = ?
          `
        ).run(
          score,
          totalQuestions,
          totalQuestions,
          userId,
          courseId
        );
      } else {
        db.prepare(
          `
          INSERT INTO quiz_scores
          (
            user_id,
            course_id,
            score,
            total_questions,
            total
          )
          VALUES (?, ?, ?, ?, ?)
          `
        ).run(
          userId,
          courseId,
          score,
          totalQuestions,
          totalQuestions
        );
      }

      const quiz = db
        .prepare(
          `
          SELECT *
          FROM quiz_scores
          WHERE user_id = ?
          AND course_id = ?
          `
        )
        .get(
          userId,
          courseId
        );

      res.json({
        success: true,
        message:
          "Quiz score saved successfully",

        quiz,

        // Compatibility with older frontend code
        result: quiz,
      });
    } catch (error) {
      console.error(
        "Save quiz score error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to save quiz score",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET QUIZ SCORE
// =====================================================

app.get(
  "/api/quiz/:userId/:courseId",
  (req, res) => {
    try {
      const userId = Number(
        req.params.userId
      );

      const courseId = Number(
        req.params.courseId
      );

      const quiz = db
        .prepare(
          `
          SELECT *
          FROM quiz_scores
          WHERE user_id = ?
          AND course_id = ?
          `
        )
        .get(
          userId,
          courseId
        );

      if (!quiz) {
        return res.json({
          success: true,
          quiz: null,
          result: null,
        });
      }

      res.json({
        success: true,

        quiz,

        // Compatibility with Dashboard
        result: quiz,
      });
    } catch (error) {
      console.error(
        "Get quiz score error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch quiz score",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET ALL QUIZ SCORES FOR USER
// =====================================================

app.get(
  "/api/quiz/user/:userId",
  (req, res) => {
    try {
      const userId = Number(
        req.params.userId
      );

      const quizzes = db
        .prepare(
          `
          SELECT *
          FROM quiz_scores
          WHERE user_id = ?
          ORDER BY course_id
          `
        )
        .all(userId);

      res.json({
        success: true,
        quizzes,
      });
    } catch (error) {
      console.error(
        "Get user quiz scores error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch quiz scores",
        error: error.message,
      });
    }
  }
);

// =====================================================
// CERTIFICATE VERIFICATION
// =====================================================
//
// Certificate format:
//
// CNA-{courseId}-{userId}-{timestamp}
//
// Example:
//
// CNA-1-2-1789704585624
//
// IMPORTANT:
// Certificate is valid only after ALL 14 topics
// have been completed.
//

app.get(
  "/api/certificate/:certificateId",
  (req, res) => {
    try {
      const certificateId =
        req.params.certificateId;

      if (!certificateId) {
        return res.status(400).json({
          success: false,
          message:
            "Certificate ID is required",
        });
      }

      const parts =
        certificateId.split("-");

      if (
        parts.length !== 4 ||
        parts[0] !== "CNA"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid certificate ID format. Please download a new certificate.",
        });
      }

      const courseId = Number(
        parts[1]
      );

      const userId = Number(
        parts[2]
      );

      const timestamp = Number(
        parts[3]
      );

      if (
        !Number.isInteger(courseId) ||
        !Number.isInteger(userId) ||
        !Number.isFinite(timestamp)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid certificate ID",
        });
      }

      // -------------------------------------------------
      // Check course
      // -------------------------------------------------

      const course =
        getCourse(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message:
            "Course associated with this certificate was not found",
        });
      }

      // -------------------------------------------------
      // Check user
      // -------------------------------------------------

      const user = db
        .prepare(
          `
          SELECT id, name, email
          FROM users
          WHERE id = ?
          `
        )
        .get(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "Student associated with this certificate was not found",
        });
      }

      // -------------------------------------------------
      // Get progress
      // -------------------------------------------------

      const progress = db
        .prepare(
          `
          SELECT *
          FROM progress
          WHERE user_id = ?
          AND course_id = ?
          `
        )
        .get(
          userId,
          courseId
        );

      if (!progress) {
        return res.status(404).json({
          success: false,
          message:
            "No course completion record was found",
        });
      }

      const completedLessons =
        parseCompletedLessons(
          progress.completed_lessons
        );

      // -------------------------------------------------
      // IMPORTANT:
      // Must have all 14 topics
      // -------------------------------------------------

      if (
        completedLessons.length <
        TOTAL_TOPICS_PER_COURSE
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Course has not been completed. All 14 topics must be completed.",
        });
      }

      const completionDate =
        progress.updated_at ||
        new Date(
          timestamp
        ).toISOString();

      res.json({
        success: true,

        verified: true,

        certificate: {
          certificateId,

          studentName:
            user.name,

          studentEmail:
            user.email,

          courseTitle:
            course.title,

          courseId:
            course.id,

          userId:
            user.id,

          completionDate,

          completionPercentage: 100,

          completedTopics:
            completedLessons.length,

          totalTopics:
            TOTAL_TOPICS_PER_COURSE,
        },
      });
    } catch (error) {
      console.error(
        "Certificate verification error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to verify certificate",
        error: error.message,
      });
    }
  }
);

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      "API route not found",
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Server error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
      error: error.message,
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );

    console.log(
      `Course completion requires ${TOTAL_TOPICS_PER_COURSE} topics.`
    );
  }
);