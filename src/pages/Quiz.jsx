import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

import courses from "../data/courses";
import quizzes from "../data/quizzes";

function Quiz() {
  const { id } = useParams();

  const courseId = Number(id);

  // ======================================================
  // CURRENT USER
  // ======================================================

  const getCurrentUser = () => {
    const userData =
      localStorage.getItem("codeninja-user");

    if (!userData) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  };

  const user = getCurrentUser();

  // ======================================================
  // QUIZ KEY
  // ======================================================

  const quizKeyMap = {
    1: "dsa",
    2: "full-stack",
    3: "ai",
    4: "database",
    5: "android",
    6: "cybersecurity",
    7: "data-analytics",
    8: "backend",
  };

  const quizKey = quizKeyMap[courseId];

  // ======================================================
  // COURSE
  // ======================================================

  const course = courses.find(
    (item) => Number(item.id) === courseId
  );

  const questions = quizKey
    ? quizzes[quizKey]
    : null;

  // ======================================================
  // USER-SPECIFIC QUIZ STORAGE KEY
  // ======================================================

  const quizScoreKey = user?.id
    ? `quiz-score-${user.id}-${courseId}`
    : `quiz-score-guest-${courseId}`;

  // ======================================================
  // QUIZ STATE
  // ======================================================

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [answers, setAnswers] = useState([]);

  const [submitted, setSubmitted] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const [score, setScore] = useState(0);

  const [saving, setSaving] = useState(false);

  // ======================================================
  // RESET QUIZ WHEN COURSE CHANGES
  // ======================================================

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setSubmitted(false);
    setFinished(false);
    setScore(0);
  }, [courseId]);

  // --------------------------------------------------
  // QUIZ NOT FOUND
  // --------------------------------------------------

  if (!course || !questions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

        <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">

          <h1 className="text-3xl font-bold text-gray-900">
            Quiz Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            The quiz for this course is not available.
          </p>

          <Link
            to="/courses"
            className="inline-block mt-6 px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Browse Courses
          </Link>

        </div>

      </div>
    );
  }

  const question =
    questions[currentQuestion];

  // --------------------------------------------------
  // SELECT ANSWER
  // --------------------------------------------------

  const handleSelect = (answerIndex) => {
    if (submitted) {
      return;
    }

    setSelectedAnswer(answerIndex);
  };

  // --------------------------------------------------
  // SUBMIT CURRENT ANSWER
  // --------------------------------------------------

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      return;
    }

    setAnswers((previousAnswers) => [
      ...previousAnswers,
      selectedAnswer,
    ]);

    setSubmitted(true);
  };

  // --------------------------------------------------
  // NEXT / FINISH QUIZ
  // --------------------------------------------------

  const handleNext = async () => {
    if (selectedAnswer === null) {
      return;
    }

    const finalAnswers = [
      ...answers,
      selectedAnswer,
    ];

    // Calculate score
    let finalScore = 0;

    questions.forEach((item, index) => {
      if (
        finalAnswers[index] ===
        item.answer
      ) {
        finalScore++;
      }
    });

    // ------------------------------------------------
    // LAST QUESTION
    // ------------------------------------------------

    if (
      currentQuestion ===
      questions.length - 1
    ) {
      setScore(finalScore);
      setFinished(true);
      setSaving(true);

      // ==============================================
      // SAVE QUIZ SCORE FOR CURRENT USER ONLY
      // ==============================================

      localStorage.setItem(
        quizScoreKey,
        JSON.stringify({
          score: finalScore,
          total: questions.length,
        })
      );

      console.log(
        "Quiz score saved locally:",
        quizScoreKey
      );

      // ==============================================
      // SAVE TO BACKEND
      // ==============================================

      if (user?.id) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/quiz/${user.id}/${courseId}`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                score: finalScore,
                total: questions.length,
              }),
            }
          );

          const data =
            await response.json();

          console.log(
            "Quiz backend response:",
            data
          );

          if (!response.ok) {
            console.error(
              "Quiz score was not saved:",
              data
            );
          }
        } catch (error) {
          console.error(
            "Quiz backend connection error:",
            error
          );
        }
      }

      setSaving(false);

      return;
    }

    // ------------------------------------------------
    // MOVE TO NEXT QUESTION
    // ------------------------------------------------

    setCurrentQuestion(
      (previousQuestion) =>
        previousQuestion + 1
    );

    setSelectedAnswer(null);
    setSubmitted(false);
  };

  // --------------------------------------------------
  // RETRY QUIZ
  // --------------------------------------------------

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setSubmitted(false);
    setFinished(false);
    setScore(0);
  };

  // --------------------------------------------------
  // QUIZ RESULT
  // --------------------------------------------------

  if (finished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">

        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">

              <CheckCircle
                size={44}
                className="text-green-600"
              />

            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Great Job! 🎉
            </h1>

            <p className="mt-3 text-gray-600">
              You have completed the{" "}
              {course.title} quiz.
            </p>

            {/* SCORE CARDS */}

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="bg-blue-50 rounded-xl p-5">

                <p className="text-3xl font-bold text-blue-600">
                  {percentage}%
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Your Score
                </p>

              </div>

              <div className="bg-green-50 rounded-xl p-5">

                <p className="text-3xl font-bold text-green-600">
                  {score}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Correct
                </p>

              </div>

              <div className="bg-red-50 rounded-xl p-5">

                <p className="text-3xl font-bold text-red-600">
                  {questions.length -
                    score}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Incorrect
                </p>

              </div>

              <div className="bg-gray-100 rounded-xl p-5">

                <p className="text-3xl font-bold text-gray-700">
                  {questions.length}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Total
                </p>

              </div>

            </div>

            {/* RESULT MESSAGE */}

            <div className="mt-8">

              {percentage >= 70 ? (
                <>

                  <h2 className="text-xl font-bold text-green-700">
                    Excellent Work! 🚀
                  </h2>

                  <p className="mt-2 text-gray-600">
                    You have a strong understanding of this course.
                  </p>

                </>
              ) : (
                <>

                  <h2 className="text-xl font-bold text-gray-800">
                    Good Effort! 👍
                  </h2>

                  <p className="mt-2 text-gray-600">
                    You have a good foundation. Review the lessons
                    and try the quiz again.
                  </p>

                </>
              )}

            </div>

            {/* BACKEND SAVE STATUS */}

            {saving && (
              <p className="mt-4 text-sm text-gray-500">
                Saving your quiz result...
              </p>
            )}

            {/* BUTTONS */}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

              <button
                onClick={handleRetry}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
              >

                <RotateCcw size={18} />

                Retry Quiz

              </button>

              <Link
                to={`/courses/${courseId}/learn`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >

                Continue Learn

                <ArrowRight size={18} />

              </Link>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // QUIZ QUESTION PAGE
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-sm font-semibold text-blue-600">
            {course.title}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Course Quiz
          </h1>

          <p className="mt-2 text-gray-600">
            Question{" "}
            {currentQuestion + 1} of{" "}
            {questions.length}
          </p>

        </div>

        {/* QUESTION CARD */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

          <h2 className="text-xl font-semibold text-gray-900">
            {question.question}
          </h2>

          {/* OPTIONS */}

          <div className="mt-6 space-y-3">

            {question.options.map(
              (option, index) => {

                const isSelected =
                  selectedAnswer ===
                  index;

                const isCorrect =
                  submitted &&
                  index ===
                    question.answer;

                const isWrong =
                  submitted &&
                  isSelected &&
                  index !==
                    question.answer;

                return (
                  <button
                    key={index}
                    onClick={() =>
                      handleSelect(index)
                    }
                    disabled={submitted}
                    className={`w-full text-left p-4 rounded-xl border transition ${
                      isCorrect
                        ? "border-green-500 bg-green-50"
                        : isWrong
                        ? "border-red-500 bg-red-50"
                        : isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <span className="font-semibold text-gray-500">

                        {String.fromCharCode(
                          65 + index
                        )}

                        .

                      </span>

                      <span className="flex-1">
                        {option}
                      </span>

                      {isCorrect && (
                        <CheckCircle
                          size={20}
                          className="text-green-600"
                        />
                      )}

                      {isWrong && (
                        <XCircle
                          size={20}
                          className="text-red-600"
                        />
                      )}

                    </div>

                  </button>
                );
              }
            )}

          </div>

          {/* ACTION BUTTON */}

          <div className="mt-8 flex justify-end">

            {!submitted ? (

              <button
                onClick={handleSubmit}
                disabled={
                  selectedAnswer === null
                }
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                Submit Answer
              </button>

            ) : (

              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
              >

                {currentQuestion ===
                questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}

              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Quiz;