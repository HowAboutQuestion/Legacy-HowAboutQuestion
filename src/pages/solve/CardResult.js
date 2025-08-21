import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function CardResult() {
  const location = useLocation();
  const questions = location.state.questions;
  const tags = location.state.tags;
  const result = location.state.result;
  const navigate = useNavigate();
  const goCard = () => { navigate("/card", { state :  { "questions" : questions, "tags" : tags }})}
  const retryWrongQuestions = () => { 
    const retryTags = new Set();
    const retryQuestions = questions.filter((item) => item.answer !== item.selected);
    retryQuestions.forEach((item) => {
      if (item.tag) {
        item.tag.forEach((tag) => retryTags.add(tag));
      }
    });

    if(retryQuestions.length <= 0) {
      if (!toast.isActive("no-question-retry-error")) {
        toast.error("다시 풀 문제가 없습니다!", { toastId: "no-question-retry-error" });
      } 
      return;
    }

    navigate("/card", { 
      state :  { 
        "questions" : retryQuestions, 
        "tags" : retryTags 
      }
    }
  )}
  const goDashBoard = () => { navigate("/dashboard")}

  
  // 차트 데이터 구성
  const data = {
    labels: ["정답", "오답"],
    datasets: [
      {
        data: [result.correct, result.wrong],
        backgroundColor: ["#3B8BF6", "#F44336"], // 정답은 초록, 틀린 답은 빨강
        borderColor: ["#3B8BF6", "#F44336"], // 경계선 색상
        borderWidth: 1,
      },
    ],
  };

  // 차트 옵션
  const options = {
    plugins: {
      legend: {
        position: "top", // 범례 위치
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false, // 차트 비율 고정 해제
  };

  return (
    <main className="ml-20 h-[100vh] bg-gray-50">
      <div className="h-full flex">

        <div className="hidden p-4 flex justify-between border-b">
          <div>
            <h1 className="text-2xl font-semibold">
              {tags.length == 0 && "문제 결과"}
              {tags.map((tag) => tag + " ")}
            </h1>
            <h1 className="text-md font-normal text-gray-400">{questions.length} 문제</h1>
          </div>
        </div>

        <div className="my-auto flex-1 flex flex-col gap-2 p-10 items-center">
            <div className="flex flex-col w-3/4 h-[400px] bg-white rounded-2xl shadow flex justify-around">
              <div>
                <div className="font-bold text-xl text-center">
                  {tags.length == 0 && "문제 결과"}
                  {tags.map((tag) => tag + " ")}
                </div>
                <div className="text-sm font-semibold text-gray-400 text-center mt-1">총 {questions.length}문제 중 {result.correct}문제를 맞췄어요</div>
              </div>
              <div className="mt-2 h-1/2">
                  <Doughnut data={data} options={options} />
              </div>
              <div className="flex justify-between w-full px-5">
                <div className="flex gap-1">
                  <div 
                    onClick={goCard}
                    className="cursor-pointer bg-blue-500 rounded-2xl py-2 w-20 whitespace-nowrap text-white font-bold text-xs text-center hover:shadow hover:scale-105 transition ">
                      전체 다시풀기
                    </div>
                  <div 
                    onClick={retryWrongQuestions}
                    className="cursor-pointer bg-blue-500 rounded-2xl py-2 w-20 whitespace-nowrap text-white font-bold text-xs text-center hover:shadow hover:scale-105 transition ">
                      오답 다시풀기
                  </div>
                </div>
                <div 
                  onClick={goDashBoard}
                  className="cursor-pointer bg-blue-500 rounded-2xl py-2 w-20 whitespace-nowrap text-white font-bold text-xs text-center hover:shadow hover:scale-105 transition ">완료</div>
                </div>
              
            </div>
        </div>
      </div>
    </main>
  );
}

export default CardResult;
