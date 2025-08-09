"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Type definitions
type Question = {
  id: string;
  type: "mcq" | "text";
  question: string;
  options?: string[];
  correctAnswer: string;
};

type UserAnswer = {
  questionId: string;
  answer: string;
  isCorrect: boolean;
};

type QuizResult = {
  answers: UserAnswer[];
  score: number;
  totalQuestions: number;
};

interface QuizComponentProps {
  questions: Question[];
  onSubmit?: (results: QuizResult) => void;
  isEnrolled: boolean;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  questions,
  onSubmit,
  isEnrolled,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const quizRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswer = userAnswers[currentQuestion.id]?.trim();

  // Scroll to top of quiz when question changes
  useEffect(() => {
    if (quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentQuestionIndex]);

  // Handle answer selection/input
  const handleAnswerChange = useCallback(
    (questionId: string, answer: string) => {
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: answer,
      }));
      setShowValidation(false);
    },
    []
  );

  // Navigate to next question
  const handleNext = useCallback(() => {
    if (!hasAnswer) {
      setShowValidation(true);
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [hasAnswer, isLastQuestion, userAnswers]);

  // Handle quiz submission
  const handleSubmit = useCallback(() => {
    if (!hasAnswer) {
      setShowValidation(true);
      return;
    }

    const evaluatedAnswers: UserAnswer[] = questions.map((question) => {
      const userAnswer = userAnswers[question.id] || "";
      const isCorrect =
        question.type === "mcq"
          ? userAnswer === question.correctAnswer
          : question.type === "text"
          ? true
          : userAnswer.toLowerCase().trim() ===
            question.correctAnswer.toLowerCase().trim();

      return {
        questionId: question.id,
        answer: userAnswer,
        isCorrect,
      };
    });

    const score = evaluatedAnswers.filter(
      (answer) =>
        answer.isCorrect &&
        questions.find((q) => q.id === answer.questionId)?.type !== "text"
    ).length;
    const quizResult: QuizResult = {
      answers: evaluatedAnswers,
      score,
      totalQuestions: questions.filter((q) => q.type !== "text").length,
    };

    setResults(quizResult);
    setIsSubmitted(true);
    onSubmit?.(quizResult);
  }, [questions, userAnswers, hasAnswer, onSubmit]);

  // Reset quiz
  const handleRetry = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setResults(null);
    setShowValidation(false);
  }, []);

  // Get answer status for styling
  const getAnswerStatus = (questionId: string, answer: string) => {
    if (!isSubmitted) return "default";
    const result = results?.answers.find((a) => a.questionId === questionId);
    if (!result) return "default";

    const question = questions.find((q) => q.id === questionId);
    if (question?.type === "mcq") {
      if (answer === question.correctAnswer) return "correct";
      if (answer === result.answer && !result.isCorrect) return "incorrect";
    }
    return "default";
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">No questions available</p>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
        Please enroll in the course to access the quiz.
      </div>
    );
  }
  return (
    <div
      ref={quizRef}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {isSubmitted ? "Quiz Results" : "Knowledge Check"}
          </h3>
          {!isSubmitted && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / questions.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {isSubmitted && results ? (
          // Results View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score Summary */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {results.score}/{results.totalQuestions}
              </div>
              <p className="text-gray-600">
                {results.score === results.totalQuestions
                  ? "Perfect score! 🎉"
                  : results.score >= results.totalQuestions * 0.7
                  ? "Great job! 👏"
                  : "Keep practicing! 💪"}
              </p>
            </div>

            {/* Question Review */}
            <div className="space-y-4">
              {questions.map((question, index) => {
                const result = results.answers.find(
                  (a) => a.questionId === question.id
                );
                const isCorrect = result?.isCorrect ?? false;

                return (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCorrect
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isCorrect ? "✓" : "✗"}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          {question.question}
                        </p>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">
                            Your answer:{" "}
                            <span
                              className={
                                isCorrect ? "text-green-700" : "text-red-700"
                              }
                            >
                              {result?.answer || "No answer"}
                            </span>
                          </p>
                          <p className="text-gray-600">
                            Correct answer:{" "}
                            <span className="text-green-700">
                              {question.correctAnswer}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Retry Button */}
            {results.score === results.totalQuestions ? (
              <div className="flex justify-center pt-4">
                Congratulations on completing the course
              </div>
            ) : (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          // Question View
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Question */}
              <div>
                <h4 className="text-xl font-medium text-gray-900 leading-relaxed">
                  {currentQuestion.question}
                </h4>
              </div>

              {/* Answer Input */}
              <div className="space-y-3">
                {currentQuestion.type === "mcq" ? (
                  // Multiple Choice
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option, index) => {
                      const isSelected =
                        userAnswers[currentQuestion.id] === option;
                      const status = getAnswerStatus(
                        currentQuestion.id,
                        option
                      );

                      return (
                        <label
                          key={index}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            status === "correct"
                              ? "border-green-500 bg-green-50"
                              : status === "incorrect"
                              ? "border-red-500 bg-red-50"
                              : isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={option}
                            checked={isSelected}
                            onChange={(e) =>
                              handleAnswerChange(
                                currentQuestion.id,
                                e.target.value
                              )
                            }
                            disabled={isSubmitted}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span
                            className={`ml-3 text-gray-900 ${
                              status === "correct" ? "font-medium" : ""
                            }`}
                          >
                            {option}
                          </span>
                          {status === "correct" && (
                            <span className="ml-auto text-green-600 font-medium">
                              ✓
                            </span>
                          )}
                          {status === "incorrect" && (
                            <span className="ml-auto text-red-600 font-medium">
                              ✗
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  // Text Input
                  <div>
                    <input
                      type="text"
                      value={userAnswers[currentQuestion.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(currentQuestion.id, e.target.value)
                      }
                      disabled={isSubmitted}
                      placeholder="Type your answer..."
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        isSubmitted
                          ? results?.answers.find(
                              (a) => a.questionId === currentQuestion.id
                            )?.isCorrect
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                    {isSubmitted && (
                      <div className="mt-2 text-sm">
                        {results?.answers.find(
                          (a) => a.questionId === currentQuestion.id
                        )?.isCorrect ? (
                          <p className="text-green-700">✓ Correct!</p>
                        ) : (
                          <p className="text-red-700">
                            ✗ Correct answer: {currentQuestion.correctAnswer}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Validation Message */}
              {showValidation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <p className="text-amber-800 text-sm">
                    Please provide an answer before continuing.
                  </p>
                </motion.div>
              )}

              {/* Navigation */}
              {!isSubmitted && (
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLastQuestion ? "Submit Quiz" : "Next Question"}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
