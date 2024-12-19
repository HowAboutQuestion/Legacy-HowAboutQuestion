import React, { useState, useEffect } from 'react';
import Single from './Single';
import Multiple from './Multiple';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { questionsAtom } from 'state/data';
import QuestionNav from 'pages/solve/QuestionNav';

function Solve() {
  const location = useLocation();
  const navigate = useNavigate();
  const allQuestions = useRecoilValue(questionsAtom); // Recoil에서 모든 문제 가져오기
  const [navCollapse, setNavCollapse] = useState(false);

  // 네비게이션을 통해 전달된 문제 집합 확인
  const passedQuestions = location.state?.questions || allQuestions; // 전달된 문제가 없으면 모든 문제 사용
  const passedTags = location.state?.tags || []; // 전달된 태그 없으면 빈 배열 사용

  // 전달된 문제들을 기반으로 답변 상태 초기화
  const [answers, setAnswers] = useState(
    passedQuestions.map((question) => ({
      ...question,
      selected: question.selected || '',
    }))
  );

  const [questionIndex, setQuestionIndex] = useState(0); // 현재 문제 인덱스

  const nextQuestion = () => {
    setQuestionIndex((prevIndex) =>
      prevIndex === answers.length - 1 ? prevIndex : prevIndex + 1
    );
  };

  const beforeQuestion = () => {
    setQuestionIndex((prevIndex) =>
      prevIndex === 0 ? prevIndex : prevIndex - 1
    );
  };

  const handleAnswerChange = (index, selectedAnswer) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[index].selected = selectedAnswer;
      return updatedAnswers;
    });
  };

  const submit = () => {
    navigate('/solve/result', {
      state: { answers, tags: passedTags },
    });
  };

  return (
    <main className="ml-20">
      <div className="sm:rounded-lg">
        <div className="p-4 flex justify-between border-b">
          <div>
            <h1 className="text-2xl font-semibold">
              {passedTags.map((tag, idx) => (
                <span key={idx}>{tag} </span>
              ))}
            </h1>
            <h1 className="text-md font-normal text-gray-400">
              총 {passedQuestions.length}문제
            </h1>
          </div>
          <div className="text-right items-center flex gap-2">
            <div
              onClick={() => setNavCollapse(!navCollapse)}
              className="border-2 border-gray-200 hover:bg-blue-300 hover:border-blue-300 rounded-xl p-2.5 text-center me-2 mb-2">
              {navCollapse && (<div className='absolute right-5 top-20 bg-white shadow p-4 rounded-lg w-40 h-50' >
                <QuestionNav questions={passedQuestions} setQuestionIndex={setQuestionIndex}></QuestionNav>
              </div>)}


            </div>
            <div
              onClick={submit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2 mb-2 cursor-pointer"
            >
              제출
            </div>
          </div>
        </div>
        {answers[questionIndex].type === '주관식' ? (
          <Single
            key={questionIndex}
            onAnswerChange={handleAnswerChange}
            question={answers[questionIndex]}
            index={questionIndex}
          />
        ) : (
          <Multiple
            key={questionIndex}
            onAnswerChange={handleAnswerChange}
            question={answers[questionIndex]}
            index={questionIndex}
          />
        )}
      </div>
      <div className="fixed z-40 bottom-5 right-5 flex gap-2">
        <div
          onClick={beforeQuestion}
          className="rounded-full p-2 text-white bg-blue-500 hover:scale-105 shadow cursor-pointer"
        >
          {/* 이전 아이콘 */}
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
          className="rounded-full p-2 text-white bg-blue-500 hover:scale-105 shadow cursor-pointer"
        >
          {/* 다음 아이콘 */}
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
