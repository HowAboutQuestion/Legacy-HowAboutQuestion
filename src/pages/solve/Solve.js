import React, { useState, useEffect } from "react";
import Single from './Single';
import Multiple from './Multiple';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { questionsAtom } from 'state/data';
import QuestionNav from 'pages/solve/QuestionNav';
import { addDays, format } from 'date-fns';

function Solve() {
  const location = useLocation();
  const navigate = useNavigate();
  const allQuestions = useRecoilValue(questionsAtom);
  const setRecoilQuestions = useSetRecoilState(questionsAtom);
  const [navCollapse, setNavCollapse] = useState(false);
  const today = new Date();

  // SelectSolve에서 전달한 timerMinutes와 timerSeconds받는 곳
  const timerMinutesInput = location.state?.timerMinutes || "00";
  const timerSecondsInput = location.state?.timerSeconds || "00";

  const initialTimer = parseInt(timerMinutesInput, 10) * 60 + parseInt(timerSecondsInput, 10);
  const [timeLeft, setTimeLeft] = useState(initialTimer);
  const [submitted, setSubmitted] = useState(false);

  // MM:SS 형식으로 남은 시간을 표시하는 함수
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // 타이머 카운트다운
  useEffect(() => {
    if (initialTimer > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [initialTimer]);

  // 타이머가 0이 되었을 때 자동 제출
  useEffect(() => {
    if (timeLeft === 0 && initialTimer > 0 && !submitted) {
      submit();
    }
  }, [timeLeft, initialTimer, submitted]);

  // 네비게이션을 통해 전달된 문제 집합 확인
  const passedQuestions = location.state?.questions || allQuestions; // 전달된 문제가 없으면 모든 문제 사용
  const passedTags = location.state?.tags || []; // 전달된 태그 없으면 빈 배열 사용

  // 전달된 문제들을 기반으로 답변 상태 초기화
  const [answers, setAnswers] = useState(
    passedQuestions.map((question) => ({
      ...question,
      selected: '',
    }))
  );

  const [questionIndex, setQuestionIndex] = useState(0); // 현재 문제 인덱스
  const [updatedQuestions, setUpdatedQuestions] = useState([]); // 업데이트된 질문 데이터

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

  const submit = async () => {
    // 오늘 날짜를 'YYYY-MM-DD' 형식으로 포맷
    const formattedToday = format(today, 'yyyy-MM-dd');

    // 모든 질문에 대해 level, updateDate, solveddate 업데이트 및 history 업데이트
    const updatedData = [];

    for (let i = 0; i < answers.length; i++) {
      const question = answers[i];
      const isCorrect = question.answer === question.selected;
      let newLevel = question.level ? parseInt(question.level, 10) : 0;

      if (isCorrect) {
        newLevel = Math.min(newLevel + 1, 3); // 레벨 증가 (최대 3)
      } else {
        newLevel = Math.max(newLevel - 1, 0); // 레벨 감소 (최소 0)
      }

      // 레벨에 따른 추가 일수 계산
      let daysToAdd;
      switch (newLevel) {
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

      // 새로운 updateDate 계산
      const newUpdateDate = format(addDays(today, daysToAdd), 'yyyy-MM-dd');

      // solveddate 포맷
      const solvedDateFormatted = formattedToday;

      // 업데이트된 질문 객체 생성
      const updatedQuestion = {
        ...question,
        level: newLevel.toString(),
        update: newUpdateDate,
        solveddate: solvedDateFormatted,
      };

      updatedData.push(updatedQuestion);

      // history 업데이트 호출
      try {
        const historyResponse = await window.electronAPI.updateHistory({ isCorrect: isCorrect });
        if (!historyResponse.success) {
          console.error(`history.csv 업데이트 실패: ${historyResponse.message}`);
        }
      } catch (error) {
        console.error('history.csv 업데이트 중 오류:', error);
      }
    }

    setUpdatedQuestions(updatedData);

    // Recoil 상태 업데이트: 기존 상태와 병합하여 업데이트된 질문 반영
    setRecoilQuestions((prevQuestions) => {
      const updatedQuestionsMap = updatedData.reduce((acc, updated) => {
        acc[updated.id] = updated;
        return acc;
      }, {});
      return prevQuestions.map((q) => {
        if(updatedQuestionsMap[q.id]) {
          return {
            ...q,
            level: updatedQuestionsMap[q.id].level,
            update: updatedQuestionsMap[q.id].update,
            solveddate: updatedQuestionsMap[q.id].solveddate,
          };
        }
        return q;
      });
    });

    navigate('/solve/result', {
      state: { answers: updatedData, tags: passedTags }, // 업데이트된 질문 데이터를 전달
    });
  };

  const allAnswered = answers.every(
    (question) => question.selected && question.selected.trim() !== ""
  );

  // 조건에 따른 스타일 변수들
  const isFirstQuestion = questionIndex === 0;
  const isLastQuestion = questionIndex === answers.length - 1;

  return (
    <main className="ml-20">
      <div className="sm:rounded-lg">
        <div className="p-4 flex justify-between border-b">
          <div>
            <h1 className="text-2xl font-semibold">
              {passedTags.length == 0 && "문제 풀이"}
              {passedTags.map((tag, idx) => (
                <span key={idx}>{tag} </span>
              ))}
            </h1>
            <h1 className="text-md font-normal text-gray-400">
              총 {passedQuestions.length}문제
            </h1>
          </div>
          
          <div className="text-right items-center flex gap-2">
          {initialTimer > 0 && (
              <h1 className="text-md font-normal text-gray-400">남은시간: {formatTime(timeLeft)}</h1>
            )}
            <div
              onClick={() => setNavCollapse(!navCollapse)}
              className="cursor-pointer border-2 border-gray-200 hover:bg-blue-300 hover:border-blue-300 rounded-xl p-2.5 text-center me-2 mb-2">
              {navCollapse && (
                <div className='absolute right-5 top-20 bg-white shadow p-4 rounded-lg w-40 h-50'>
                  <QuestionNav questions={passedQuestions} setQuestionIndex={setQuestionIndex}></QuestionNav>
                </div>
              )}
            </div>
            <div
              onClick={submit}
              className={`cursor-pointer ${allAnswered ? 'bg-blue-500' : 'bg-gray-500'} hover:scale-105 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2 mb-2 transition`}
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
          className={`rounded-full p-2 text-white ${isFirstQuestion ? 'bg-gray-500' : 'bg-blue-500'} hover:scale-105 transition shadow`}
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
          className={`rounded-full p-2 text-white ${isLastQuestion ? 'bg-gray-500' : 'bg-blue-500'} hover:scale-105 transition shadow cursor-pointer`}
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
