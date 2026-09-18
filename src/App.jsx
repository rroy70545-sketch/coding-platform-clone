import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import PopularCourses from "./components/PopularCourses";
import WhyUs from "./components/WhyUs";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import LearnCourse from "./pages/LearnCourse";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CertificateVerify from "./pages/CertificateVerify";

import ProtectedRoute from "./components/ProtectedRoute";

function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <PopularCourses />
      <WhyUs />
      <CTA />
    </>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((response) => response.json())
      .then((data) => {
        console.log("Backend response:", data);
      })
      .catch((error) => {
        console.error("Backend connection error:", error);
      });
  }, []);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-white">
      {!isAuthPage && <Navbar />}

      <main>
        <Routes>

          {/* =========================
              HOME
          ========================= */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* =========================
              COURSES
          ========================= */}
          <Route
            path="/courses"
            element={<Courses />}
          />

          <Route
            path="/courses/:id"
            element={<CourseDetails />}
          />

          {/* =========================
              LEARNING
          ========================= */}

          <Route
            path="/courses/:id/learn"
            element={<LearnCourse />}
          />

          <Route
            path="/learn/:id"
            element={<LearnCourse />}
          />

          {/* =========================
              QUIZ
          ========================= */}

          <Route
            path="/courses/:id/quiz"
            element={<Quiz />}
          />

          {/* =========================
              CERTIFICATE VERIFICATION
          ========================= */}

          <Route
            path="/certificate"
            element={<CertificateVerify />}
          />

          {/* =========================
              PROTECTED DASHBOARD
          ========================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* =========================
              PROTECTED PROFILE
          ========================= */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* =========================
              AUTHENTICATION
          ========================= */}

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;