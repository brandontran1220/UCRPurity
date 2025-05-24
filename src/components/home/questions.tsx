"use client"

import React, {useState, useEffect } from "react";
import {questions} from "@/data/Questions";
import SubmitButton from "../SubmitButton";
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
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

  const calculateScore = () => {
    const answeredCount = Object.values(userAnswers).filter(answer => answer === true).length;
    return 100 - answeredCount;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    window.location.href = `/result?score=${score}`;
  };

  return (
    <div className="questions-container flex flex-col w-full px-6 space-y-3">
      {questions.map((question: string, index: number) => (
        <div key={index} className="question-block">
          <div
            className={`question-item flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
              userAnswers[index] 
                ? 'bg-blue-50 border-blue-200 shadow-sm' 
                : 'bg-white border-gray-200 hover:border-blue-100'
            }`}
            onClick={() => handleQuestionToggle(index)}
          >
            <span className="question-number text-sm font-medium text-gray-500 mr-3 min-w-[2rem]">
              {index + 1}.
            </span>
            <div
              className={`checkmark flex items-center justify-center w-6 h-6 rounded border-2 mr-4 transition-all duration-200 ${
                userAnswers[index]
                  ? 'bg-purity-blue-200 border-blue-200 text-white'
                  : 'bg-white border-gray-300 hover:border-blue-200'
              }`}
            >              {userAnswers[index] && (
                <IoIosCheckmark className="w-full h-full text-white" />
              )}
            </div>
            <span className={`question-text flex-1 transition-colors duration-200 ${
              userAnswers[index] ? 'text-blue-800 font-medium' : 'text-gray-700'
            }`}>
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
