import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { questionsAtom, appPathAtom } from "state/data";
import { addDays, format } from 'date-fns'; 
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { markdownComponents } from "utils/markdownUtils"

function Card() {
  const appPath = useRecoilValue(appPathAtom);

  const [questionIndex, setQuestionIndex] = useState(0); // 현재 문제의 인덱스
  const location = useLocation();
  const questions = location.state.questions;
  const tags = location.state.tags;
  const navigate = useNavigate();
  const today = new Date(); // 오늘 날짜 객체
  const formattedToday = format(today, 'yyyy-MM-dd'); // 'YYYY-MM-DD' 형식으로 포맷

  // Recoil 수정
  const setRecoilQuestions = useSetRecoilState(questionsAtom);

  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goResult = (correct, wrong) => {
    navigate("/card/result", {
      state: {
        questions: questions,
        tags: tags,
        result: { correct: correct, wrong: wrong },
      },
    });
  };

  // 레벨에 따른 updateDate 계산 함수
  const calculateUpdateDate = (currentDate, level) => {
    let daysToAdd;
    switch (level) {
      case 0:
        daysToAdd = 1;
        break;
      case 1:
        daysToAdd = 2;
        break;
      case 2:
        daysToAdd = 3;
        break;
      case 3:
      default:
        daysToAdd = 4;
        break;
    }
    return format(addDays(currentDate, daysToAdd), 'yyyy-MM-dd');
  };

  const correct = async () => {
    // 현재 질문 정보 가져오기
    const currentQuestion = questions[questionIndex];
    const currentLevel = currentQuestion.level ? parseInt(currentQuestion.level, 10) : 0;
    const newLevel = Math.min(currentLevel + 1, 3); // 레벨 증가 (최대 3)
    const newUpdateDate = calculateUpdateDate(today, newLevel);

    setCorrectCount((prevCount) => {
      const updatedCount = prevCount + 1;
      if (questionIndex === questions.length - 1) {
        goResult(updatedCount, wrongCount);
      } else {
        nextQuestion();
      }
      return updatedCount;
    });
    setShowAnswer(false);

    // Recoil 상태 업데이트: level, updateDate, solveddate 반영
    setRecoilQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((item) =>
        item.id === currentQuestion.id
          ? {
            ...item,
            level: newLevel.toString(),
            update: newUpdateDate,
            solveddate: formattedToday
          }
          : item
      );
      return updatedQuestions;
    });

    // history.csv 업데이트 호출
    try {
      const historyResponse = await window.electronAPI.updateHistory({ isCorrect: true });
      if (!historyResponse.success) {
        console.error(historyResponse.message);
      }
    } catch (error) {
      console.error('history.csv 업데이트 중 오류:', error);
    }
  };

  const wrong = async () => {
    // 현재 질문 정보 가져오기
    const currentQuestion = questions[questionIndex];
    const currentLevel = currentQuestion.level ? parseInt(currentQuestion.level, 10) : 0;
    const newLevel = Math.max(currentLevel - 1, 0); // 레벨 감소 (최소 0)
    const newUpdateDate = calculateUpdateDate(today, newLevel);

    setWrongCount((prevCount) => {
      const updatedCount = prevCount + 1;
      if (questionIndex === questions.length - 1) {
        goResult(correctCount, updatedCount);
      } else {
        nextQuestion();
      }
      return updatedCount;
    });
    setShowAnswer(false);

    // Recoil 상태 업데이트: level, updateDate, solveddate 반영
    setRecoilQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((item) =>
        item.id === currentQuestion.id
          ? {
            ...item,
            level: newLevel.toString(),
            update: newUpdateDate,
            solveddate: formattedToday
          }
          : item
      );
      return updatedQuestions;
    });

    // history.csv 업데이트 호출
    try {
      const historyResponse = await window.electronAPI.updateHistory({ isCorrect: false });
      if (!historyResponse.success) {
        console.error(`history.csv 업데이트 실패: ${historyResponse.message}`);
      }
    } catch (error) {
      console.error('history.csv 업데이트 중 오류:', error);
    }
  };

  const nextQuestion = () => {
    setQuestionIndex((prevIndex) => prevIndex + 1);
  };

  // 모달 열기/닫기 함수
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="ml-20 h-[100vh]">
      <div className="sm:rounded-lg h-full flex flex-col">
        <div className="p-4 flex justify-between border-b">
          <div>
            <h1 className="text-2xl font-semibold">{tags.join(" ")}</h1>
            <h1 className=" text-md font-normal text-gray-400">총 {questions.length} 문제</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-5 p-10 items-center bg-gray-50">
          {questions[questionIndex].img && (
            <div className="flex w-3/4 h-[300px] bg-white rounded-2xl">
              <img
                className="w-1/2 bg-gray-50 h-auto rounded-l-2xl"
                src={appPath + questions[questionIndex].img}
                alt=""
                onClick={openModal} // 이미지 클릭시 모달 열기
              />
              <div className="w-1/2 p-5">
                <div className="text-lg font-bold">
                  <span>{questions[questionIndex].title}</span>
                </div>
                <div className="text-md font-semibold mt-2 text-gray-500">
                  {showAnswer && <span>{questions[questionIndex].answer}</span>}
                </div>
              </div>
            </div>
          )}

          {!questions[questionIndex].img && (
            <div className="w-3/4 h-[300px] bg-white rounded-2xl">
              <div
                style={{
                  fontSize: "clamp(0.8rem, 2vw, 1.3rem)", 
                }}
                className="w-full text-center text-lg font-bold mt-10 px-3">
                {questions[questionIndex].title}
              </div>

              <div className="w-full text-md whitespace-nowrap font-semibold mt-5 text-gray-500 flex justify-center items-center">
                {showAnswer && <div>
                  <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkBreaks]}>
                   {questions[questionIndex].answer}
                  </ReactMarkdown>
                </div>
               
                }
              </div>
            </div>
          )}

          {!showAnswer && (
            <div className="flex justify-center">
              <div
                onClick={() => setShowAnswer(true)}
                className="cursor-pointer rounded-2xl bg-blue-500 font-bold text-white py-2 w-40 text-center text-sm">
                정답
              </div>
            </div>
          )}
          {showAnswer && (
            <div className="flex gap-5 justify-center">
              <div
                onClick={wrong}
                className="cursor-pointer rounded-2xl bg-gray-100 font-bold py-2 w-40 text-center text-sm">
                틀림
              </div>
              <div
                onClick={correct}
                className="cursor-pointer rounded-2xl bg-blue-500 font-bold text-white py-2 w-40 text-center text-sm">
                맞음
              </div>
            </div>
          )}

          <div className="w-3/4 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 네비게이션 화살표 버튼 */}
      <div className="hidden fixed z-40 bottom-5 right-5 flex gap-2">
        <div className="rounded-full p-2 text-white bg-blue-300 hover:bg-blue-500 shadow">
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
        <div className="rounded-full p-2 text-white bg-blue-300 hover:bg-blue-500 shadow">
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

      {/* 모달 컴포넌트 */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal} // 모달 배경 클릭 시 닫힘
        >
          <div className="relative">
            <img 
              src={appPath + questions[questionIndex].img} 
              alt=""
              className="max-w-full max-h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default Card;
