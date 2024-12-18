import React from 'react';
import SingleResult from 'pages/solve/SingleResult';
import MultipleResult from 'pages/solve/MultipleResult';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useLocation } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);



function SolveResult() {  
  const location = useLocation();
  const answers = location.state.answers;
  const tags = location.state.tags;

  let correct = 0;
  let wrong = 0;

  answers.map((question) => {question.answer === question.selected ? correct++ : wrong++});
  
  
  // 차트 데이터 구성
  const data = {
    labels: ["정답", "오답"],
    datasets: [
      {
        data: [correct, wrong],
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
            size: 10,
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false, // 차트 비율 고정 해제
  };


  const resultPage = () => {
    return answers.map((answer, index) => {
      return answer.type === "주관식" ? (
        <SingleResult 
          key={index}
          question={answer} 
          index={index}
        />
      ) : (
        <MultipleResult 
          key={index}
          question={answer} 
          index={index} 
        />
      );
    });
  };

  return (
    <main className="ml-20">
      <div className="sm:rounded-lg">
        <div className="p-4 flex justify-between border-b">
          <div>
            <h1 className="text-2xl font-semibold">
              {tags.map((tag) => `${tag} `)}
            </h1>
            <h1 className="text-md font-normal text-gray-400">
              총 {answers.length}문제
            </h1>
          </div>
        </div>

        <div className="m-10 h-40 w-40">
            <Doughnut data={data} options={options} />
        </div>

        
        <div>
          {resultPage()}
        </div>
      </div>
    </main>
  );
}

export default SolveResult;
