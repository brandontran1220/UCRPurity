"use client"

import React, {useState, useEffect } from "react";
import {questions} from "@/data/Questions";

interface UserAnswers {
  [questionIndex: number]: boolean; 
}

const Questions: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isComplete, setIsComplete] = useState(false);


  useEffect(() => {
    const initialAnswers: UserAnswers = {};
    questions.forEach((question: string, index: number) => {
      initialAnswers[index] = false;
    });
    setUserAnswers(initialAnswers);
  }, []);

  useEffect(() => {
    const answeredCount = Object.values(userAnswers).filter(answer => answer === true).length;
    setIsComplete(answeredCount > 0);
  }, [userAnswers]);

  const handleQuestionToggle = (questionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));  };  return (
    <div className="questions-container flex flex-col w-full px-6 space-y-3 pb-10">
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
            >
              {userAnswers[index] && (
                <svg 
                  className="w-4 h-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
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
      {isComplete && (
        <div className="completion-message bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded-lg p-6 mt-8 shadow-md">
          <p className="text-blue-800 font-semibold text-center">
            🎓 You've experienced {Object.values(userAnswers).filter(answer => answer === true).length} out of {questions.length} UCR experiences!
          </p>
        </div>
      )}
    </div>
  );
};

export default Questions;
