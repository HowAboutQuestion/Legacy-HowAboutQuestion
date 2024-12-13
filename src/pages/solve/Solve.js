import React, { useState } from 'react';
import Single from 'pages/solve/Single';
import Multiple from 'pages/solve/Multiple';
import { questionsAtom } from 'state/data';
import { useRecoilValue } from "recoil";


function Solve () {  
  const questions = useRecoilValue(questionsAtom);
const [questionIndex, setQuestionIndex] = useState(0); // 현재 문제의 인덱스
console.log("solve questions", questions );
//const curQuestion = questions[questionIndex]; // 현재 문제 데이터

const nextQuestion = () => {
  setQuestionIndex((prevIndex) =>
    prevIndex === questions.length - 1 ? prevIndex : prevIndex + 1
  );
};

const beforeQuestion = () => {
  setQuestionIndex((prevIndex) => (prevIndex === 0 ? prevIndex : prevIndex - 1));
};

  return (
    <main className="ml-20  bg-gray-50">
          <div className="sm:rounded-lg">
            <div className="p-4 flex justify-between border-b">
              <div>
                <h1 className="text-2xl font-semibold">MVC Pattern</h1>
                <h1 className="text-md font-normal text-gray-400">총 {questions.length}문제</h1>
              </div>
              <div className="text-right items-center flex gap-2">
                <div className="border-2 border-gray-200 hover:bg-blue-300 hover:border-blue-300 rounded-xl p-2.5 text-center me-2 mb-2"></div>
                <div className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2 mb-2">
                  제출
                </div>
              </div>
            </div>
            {questions[questionIndex].type === "주관식" ? (
                <Single question={questions[questionIndex]} index={questionIndex} />
              ) : (
                <Multiple question={questions[questionIndex]} index={questionIndex} />
              )}
          </div>
          <div className="fixed z-40 bottom-5 right-5 flex gap-2">
            <div 
            onClick={beforeQuestion}
            className="rounded-full p-2 text-white bg-blue-300 hover:bg-blue-500 shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </div>

            <div 
            onClick={nextQuestion}
            className="rounded-full p-2 text-white bg-blue-300 hover:bg-blue-500 shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </div>
    </main>
  
  );
    
}

export default Solve;