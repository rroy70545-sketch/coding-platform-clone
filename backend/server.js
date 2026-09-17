const express = require("express");
const cors = require("cors");

const db = require("./database");

const app = express();
const PORT = 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "CodeNinja backend is working!",
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
      message: "Database connection successful!",
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

// =====================================================
// GET ALL COURSES
// =====================================================

app.get("/api/courses", (req, res) => {
  try {
    const courses = db
      .prepare(`
        SELECT *
        FROM courses
        ORDER BY id
      `)
      .all();

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Courses fetch error:", error);

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
  const courseId = Number(req.params.id);

  try {
    const course = db
      .prepare(`
        SELECT *
        FROM courses
        WHERE id = ?
      `)
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
    console.error("Single course fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
});

// =====================================================
// SIGNUP
// =====================================================

app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  try {
    const existingUser = db
      .prepare(`
        SELECT id
        FROM users
        WHERE email = ?
      `)
      .get(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const createUser = db.prepare(`
      INSERT INTO users
      (
        name,
        email,
        password
      )
      VALUES (?, ?, ?)
    `);

    const result = createUser.run(
      name,
      email,
      password
    );

    const user = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          created_at
        FROM users
        WHERE id = ?
      `)
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
      message: "Failed to create account",
      error: error.message,
    });
  }
});

// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          password,
          created_at
        FROM users
        WHERE email = ?
      `)
      .get(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    delete user.password;

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

// =====================================================
// GET USER
// =====================================================

app.get("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  try {
    const user = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          created_at
        FROM users
        WHERE id = ?
      `)
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
    console.error("User fetch error:", error);

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
  const userId = Number(req.params.id);
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required",
    });
  }

  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim();

  if (!trimmedName || !trimmedEmail) {
    return res.status(400).json({
      success: false,
      message: "Name and email cannot be empty",
    });
  }

  try {
    // Check whether another user already uses this email
    const existingUser = db
      .prepare(`
        SELECT id
        FROM users
        WHERE email = ?
          AND id != ?
      `)
      .get(trimmedEmail, userId);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered by another user",
      });
    }

    // Update profile
    const result = db
      .prepare(`
        UPDATE users
        SET
          name = ?,
          email = ?
        WHERE id = ?
      `)
      .run(
        trimmedName,
        trimmedEmail,
        userId
      );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get updated user
    const updatedUser = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          created_at
        FROM users
        WHERE id = ?
      `)
      .get(userId);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

// =====================================================
// CHANGE USER PASSWORD
// =====================================================

app.put("/api/users/:id/password", (req, res) => {
  const userId = Number(req.params.id);
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message:
        "Current password and new password are required",
    });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({
      success: false,
      message:
        "New password must be at least 6 characters long",
    });
  }

  try {
    // Get current password from database
    const user = db
      .prepare(`
        SELECT
          id,
          password
        FROM users
        WHERE id = ?
      `)
      .get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    if (user.password !== currentPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    db.prepare(`
      UPDATE users
      SET password = ?
      WHERE id = ?
    `).run(
      newPassword,
      userId
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
});

// =====================================================
// SAVE COURSE PROGRESS
// =====================================================

app.post("/api/progress/:userId/:courseId", (req, res) => {
  const userId = Number(req.params.userId);
  const courseId = Number(req.params.courseId);

  const completedLessons =
    Array.isArray(req.body.completedLessons)
      ? req.body.completedLessons
      : [];

  try {
    const saveProgress = db.prepare(`
      INSERT INTO progress
      (
        user_id,
        course_id,
        completed_lessons,
        updated_at
      )
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)

      ON CONFLICT(user_id, course_id)
      DO UPDATE SET
        completed_lessons = excluded.completed_lessons,
        updated_at = CURRENT_TIMESTAMP
    `);

    saveProgress.run(
      userId,
      courseId,
      JSON.stringify(completedLessons)
    );

    const progress = db
      .prepare(`
        SELECT *
        FROM progress
        WHERE user_id = ?
          AND course_id = ?
      `)
      .get(userId, courseId);

    res.json({
      success: true,
      message: "Progress saved successfully",
      progress: {
        id: progress.id,
        userId: progress.user_id,
        courseId: progress.course_id,
        completedLessons: JSON.parse(
          progress.completed_lessons || "[]"
        ),
        updatedAt: progress.updated_at,
      },
    });
  } catch (error) {
    console.error("Progress save error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save progress",
      error: error.message,
    });
  }
});

// =====================================================
// GET COURSE PROGRESS
// =====================================================

app.get("/api/progress/:userId/:courseId", (req, res) => {
  const userId = Number(req.params.userId);
  const courseId = Number(req.params.courseId);

  try {
    const progress = db
      .prepare(`
        SELECT *
        FROM progress
        WHERE user_id = ?
          AND course_id = ?
      `)
      .get(userId, courseId);

    if (!progress) {
      return res.json({
        success: true,
        userId,
        courseId,
        completedLessons: [],
        updatedAt: null,
      });
    }

    res.json({
      success: true,
      userId: progress.user_id,
      courseId: progress.course_id,
      completedLessons: JSON.parse(
        progress.completed_lessons || "[]"
      ),
      updatedAt: progress.updated_at,
    });
  } catch (error) {
    console.error("Progress fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
      error: error.message,
    });
  }
});

// =====================================================
// SAVE QUIZ SCORE
// =====================================================

app.post("/api/quiz/:userId/:courseId", (req, res) => {
  const userId = Number(req.params.userId);
  const courseId = Number(req.params.courseId);

  const score = Number(req.body.score);
  const total = Number(req.body.total);

  if (
    Number.isNaN(score) ||
    Number.isNaN(total)
  ) {
    return res.status(400).json({
      success: false,
      message: "Score and total are required",
    });
  }

  try {
    const saveQuizScore = db.prepare(`
      INSERT INTO quiz_scores
      (
        user_id,
        course_id,
        score,
        total_questions,
        total
      )
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = saveQuizScore.run(
      userId,
      courseId,
      score,
      total,
      total
    );

    res.json({
      success: true,
      message: "Quiz score saved successfully",
      score: {
        id: result.lastInsertRowid,
        userId,
        courseId,
        score,
        total,
        totalQuestions: total,
      },
    });
  } catch (error) {
    console.error("Quiz score save error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save quiz score",
      error: error.message,
    });
  }
});

// =====================================================
// GET LATEST QUIZ SCORE
// =====================================================

app.get("/api/quiz/:userId/:courseId", (req, res) => {
  const userId = Number(req.params.userId);
  const courseId = Number(req.params.courseId);

  try {
    const quizScore = db
      .prepare(`
        SELECT *
        FROM quiz_scores
        WHERE user_id = ?
          AND course_id = ?
        ORDER BY id DESC
        LIMIT 1
      `)
      .get(userId, courseId);

    if (!quizScore) {
      return res.json({
        success: true,
        score: null,
      });
    }

    res.json({
      success: true,
      score: {
        id: quizScore.id,
        userId: quizScore.user_id,
        courseId: quizScore.course_id,
        score: quizScore.score,
        total:
          quizScore.total ??
          quizScore.total_questions,
        totalQuestions:
          quizScore.total_questions ??
          quizScore.total,
        createdAt:
          quizScore.created_at ??
          quizScore.updated_at ??
          null,
      },
    });
  } catch (error) {
    console.error("Quiz score fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz score",
      error: error.message,
    });
  }
});

// =====================================================
// GET ALL QUIZ SCORES FOR USER
// =====================================================

app.get("/api/quiz/user/:userId", (req, res) => {
  const userId = Number(req.params.userId);

  try {
    const scores = db
      .prepare(`
        SELECT
          quiz_scores.*,
          courses.title AS course_title
        FROM quiz_scores
        LEFT JOIN courses
          ON quiz_scores.course_id = courses.id
        WHERE quiz_scores.user_id = ?
        ORDER BY quiz_scores.id DESC
      `)
      .all(userId);

    const formattedScores = scores.map((item) => ({
      id: item.id,
      userId: item.user_id,
      courseId: item.course_id,
      courseTitle: item.course_title,
      score: item.score,
      total:
        item.total ??
        item.total_questions,
      totalQuestions:
        item.total_questions ??
        item.total,
      createdAt:
        item.created_at ??
        item.updated_at ??
        null,
    }));

    res.json({
      success: true,
      scores: formattedScores,
    });
  } catch (error) {
    console.error("User quiz scores fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz scores",
      error: error.message,
    });
  }
});

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `CodeNinja backend running on http://localhost:${PORT}`
  );
});