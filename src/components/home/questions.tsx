"use client";

import React, { useState, useEffect } from "react";
import { questions } from "@/data/Questions";
import SubmitButton from "./SubmitButton";
import { IoIosCheckmark } from "react-icons/io";

interface UserAnswers {
  [questionIndex: number]: boolean;
}

const Questions: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

  useEffect(() => {
    const initialAnswers: UserAnswers = {};
    questions.forEach((question: string, index: number) => {
      initialAnswers[index] = false;
    });
    setUserAnswers(initialAnswers);
  }, []);

  const handleQuestionToggle = (questionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex],
    }));
  };

  const calculateScore = () => {
    const answeredCount = Object.values(userAnswers).filter(
      (answer) => answer === true,
    ).length;
    return 100 - answeredCount;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    window.location.href = `/result?score=${score}`;
  };

  return (
    <div className="questions-container flex w-full flex-col space-y-3 px-6">
      {questions.map((question: string, index: number) => (
        <div key={index} className="question-block">
          <div
            className={`question-item flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
              userAnswers[index]
                ? "border-blue-200 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-blue-100"
            }`}
            onClick={() => handleQuestionToggle(index)}
          >
            <span className="question-number mr-3 min-w-[2rem] text-sm font-medium text-gray-500">
              {index + 1}.
            </span>
            <div
              className={`checkmark mr-4 flex h-6 w-6 items-center justify-center rounded border-2 transition-all duration-200 ${
                userAnswers[index]
                  ? "bg-purity-blue-200 border-blue-200 text-white"
                  : "border-gray-300 bg-white hover:border-blue-200"
              }`}
            >
              {" "}
              {userAnswers[index] && (
                <IoIosCheckmark className="h-full w-full text-white" />
              )}
            </div>
            <span
              className={`question-text flex-1 transition-colors duration-200 ${
                userAnswers[index]
                  ? "font-medium text-blue-800"
                  : "text-gray-700"
              }`}
            >
              {question}
            </span>
          </div>
        </div>
      ))}

      <div className="submit-section flex justify-center">
        <SubmitButton onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default Questions;
