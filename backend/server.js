const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ===============================
// TEST ROUTE
// ===============================
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is working",
  });
});

// ===============================
// DATABASE TEST
// ===============================
app.get("/api/database-test", (req, res) => {
  try {
    const result = db.prepare("SELECT 1 AS test").get();

    res.json({
      success: true,
      message: "Database connection is working",
      result,
    });
  } catch (error) {
    console.error("Database test error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ===============================
// GET ALL COURSES
// ===============================
app.get("/api/courses", (req, res) => {
  try {
    const courses = db
      .prepare("SELECT * FROM courses ORDER BY id")
      .all();

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
});

// ===============================
// GET SINGLE COURSE
// ===============================
app.get("/api/courses/:id", (req, res) => {
  try {
    const courseId = Number(req.params.id);

    const course = db
      .prepare("SELECT * FROM courses WHERE id = ?")
      .get(courseId);

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
    console.error("Get course error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
});

// ===============================
// SIGN UP
// ===============================
app.post("/api/signup", (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const result = db
      .prepare(
        `INSERT INTO users (name, email, password)
         VALUES (?, ?, ?)`
      )
      .run(name, email, password);

    const user = db
      .prepare("SELECT id, name, email, created_at FROM users WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message,
    });
  }
});

// ===============================
// LOGIN
// ===============================
app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = db
      .prepare(
        `SELECT id, name, email, created_at
         FROM users
         WHERE email = ? AND password = ?`
      )
      .get(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

// ===============================
// GET USER
// ===============================
app.get("/api/users/:id", (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = db
      .prepare(
        `SELECT id, name, email, created_at
         FROM users
         WHERE id = ?`
      )
      .get(userId);

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
    console.error("Get user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

// ===============================
// UPDATE USER PROFILE
// ===============================
app.put("/api/users/:id", (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const existingUser = db
      .prepare(
        `SELECT id FROM users
         WHERE email = ? AND id != ?`
      )
      .get(email, userId);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already being used",
      });
    }

    db.prepare(
      `UPDATE users
       SET name = ?, email = ?
       WHERE id = ?`
    ).run(name, email, userId);

    const user = db
      .prepare(
        `SELECT id, name, email, created_at
         FROM users
         WHERE id = ?`
      )
      .get(userId);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

// ===============================
// UPDATE PASSWORD
// ===============================
app.put("/api/users/:id/password", (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    db.prepare(
      `UPDATE users
       SET password = ?
       WHERE id = ?`
    ).run(newPassword, userId);

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
});

// ===============================
// SAVE COURSE PROGRESS
// ===============================
app.post("/api/progress/:userId/:courseId", (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const courseId = Number(req.params.courseId);

    // Accept both naming styles so existing frontend code continues working.
    const completedLessons =
      req.body.completed_lessons ??
      req.body.completedLessons ??
      [];

    const completedLessonsJson = JSON.stringify(completedLessons);

    const existing = db
      .prepare(
        `SELECT id
         FROM progress
         WHERE user_id = ? AND course_id = ?`
      )
      .get(userId, courseId);

    if (existing) {
      db.prepare(
        `UPDATE progress
         SET completed_lessons = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND course_id = ?`
      ).run(completedLessonsJson, userId, courseId);
    } else {
      db.prepare(
        `INSERT INTO progress
         (user_id, course_id, completed_lessons)
         VALUES (?, ?, ?)`
      ).run(userId, courseId, completedLessonsJson);
    }

    const progress = db
      .prepare(
        `SELECT *
         FROM progress
         WHERE user_id = ? AND course_id = ?`
      )
      .get(userId, courseId);

    res.json({
      success: true,
      message: "Progress saved successfully",
      progress,
    });
  } catch (error) {
    console.error("Save progress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save progress",
      error: error.message,
    });
  }
});

// ===============================
// GET COURSE PROGRESS
// ===============================
app.get("/api/progress/:userId/:courseId", (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const courseId = Number(req.params.courseId);

    const progress = db
      .prepare(
        `SELECT *
         FROM progress
         WHERE user_id = ? AND course_id = ?`
      )
      .get(userId, courseId);

    if (!progress) {
      return res.json({
        success: true,
        progress: {
          completed_lessons: "[]",
        },
        completedLessons: [],
      });
    }

    let completedLessons = [];

    try {
      completedLessons = JSON.parse(
        progress.completed_lessons || "[]"
      );
    } catch {
      completedLessons = [];
    }

    res.json({
      success: true,
      progress,
      completedLessons,
    });
  } catch (error) {
    console.error("Get progress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
      error: error.message,
    });
  }
});

// ===============================
// SAVE QUIZ SCORE
// ===============================
app.post("/api/quiz/:userId/:courseId", (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const courseId = Number(req.params.courseId);

    const score = Number(req.body.score ?? 0);
    const totalQuestions = Number(
      req.body.total_questions ??
      req.body.total ??
      0
    );

    const existing = db
      .prepare(
        `SELECT id
         FROM quiz_scores
         WHERE user_id = ? AND course_id = ?`
      )
      .get(userId, courseId);

    if (existing) {
      db.prepare(
        `UPDATE quiz_scores
         SET score = ?,
             total_questions = ?,
             total = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND course_id = ?`
      ).run(
        score,
        totalQuestions,
        totalQuestions,
        userId,
        courseId
      );
    } else {
      db.prepare(
        `INSERT INTO quiz_scores
         (user_id, course_id, score, total_questions, total)
         VALUES (?, ?, ?, ?, ?)`
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
        `SELECT *
         FROM quiz_scores
         WHERE user_id = ? AND course_id = ?`
      )
      .get(userId, courseId);

    res.json({
      success: true,
      message: "Quiz score saved successfully",
      quiz,
    });
  } catch (error) {
    console.error("Save quiz score error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save quiz score",
      error: error.message,
    });
  }
});

// ===============================
// GET QUIZ SCORE
// ===============================
app.get("/api/quiz/:userId/:courseId", (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const courseId = Number(req.params.courseId);

    const quiz = db
      .prepare(
        `SELECT *
         FROM quiz_scores
         WHERE user_id = ? AND course_id = ?`
      )
      .get(userId, courseId);

    if (!quiz) {
      return res.json({
        success: true,
        quiz: null,
      });
    }

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Get quiz score error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz score",
      error: error.message,
    });
  }
});

// ===============================
// GET ALL QUIZ SCORES FOR USER
// ===============================
app.get("/api/quiz/user/:userId", (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const quizzes = db
      .prepare(
        `SELECT *
         FROM quiz_scores
         WHERE user_id = ?
         ORDER BY course_id`
      )
      .all(userId);

    res.json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Get user quiz scores error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz scores",
      error: error.message,
    });
  }
});

// =====================================================
// CERTIFICATE VERIFICATION
// =====================================================
// New certificate format:
//
// CNA-{courseId}-{userId}-{timestamp}
//
// Example:
//
// CNA-1-2-1789704585624
//
// The important difference is that the certificate now
// contains the USER ID. Therefore we don't have to search
// all users and accidentally return somebody else's name.
// =====================================================
app.get("/api/certificate/:certificateId", (req, res) => {
  try {
    const certificateId = req.params.certificateId;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID is required",
      });
    }

    const parts = certificateId.split("-");

    // Expected:
    // CNA
    // courseId
    // userId
    // timestamp
    if (parts.length !== 4 || parts[0] !== "CNA") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid certificate ID format. Please download a new certificate.",
      });
    }

    const courseId = Number(parts[1]);
    const userId = Number(parts[2]);
    const timestamp = Number(parts[3]);

    if (
      !Number.isInteger(courseId) ||
      !Number.isInteger(userId) ||
      !Number.isFinite(timestamp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID",
      });
    }

    // Check that the course exists.
    const course = db
      .prepare("SELECT * FROM courses WHERE id = ?")
      .get(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course associated with this certificate was not found",
      });
    }

    // Check that the user exists.
    const user = db
      .prepare(
        `SELECT id, name, email
         FROM users
         WHERE id = ?`
      )
      .get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student associated with this certificate was not found",
      });
    }

    // Get ONLY this user's progress for this course.
    const progress = db
      .prepare(
        `SELECT *
         FROM progress
         WHERE user_id = ? AND course_id = ?`
      )
      .get(userId, courseId);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No course completion record was found",
      });
    }

    let completedLessons = [];

    try {
      completedLessons = JSON.parse(
        progress.completed_lessons || "[]"
      );
    } catch {
      completedLessons = [];
    }

    if (
      !Array.isArray(completedLessons) ||
      completedLessons.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "Course has not been completed",
      });
    }

    // The timestamp is part of the certificate ID and is kept
    // as certificate metadata. We intentionally do NOT compare
    // it with progress.updated_at because a student may download
    // their certificate days after completing the course.
    const completionDate =
      progress.updated_at || new Date(timestamp).toISOString();

    res.json({
      success: true,
      verified: true,

      certificate: {
        certificateId,
        studentName: user.name,
        studentEmail: user.email,
        courseTitle: course.title,
        courseId: course.id,
        userId: user.id,
        completionDate,
        completionPercentage: 100,
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify certificate",
      error: error.message,
    });
  }
});

// ===============================
// 404 ROUTE
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ===============================
// ERROR HANDLER
// ===============================
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});