import React, { useRef } from "react";
import { useSetRecoilState } from "recoil";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

import { useNavigate, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { questionsAtom }  from "state/data.js";
import SingleResult from "pages/solve/SingleResult.js";
import MultipleResult from "pages/solve/MultipleResult.js";


ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
function SolveResult() {
  
  const location = useLocation();
  const setQuestions = useSetRecoilState(questionsAtom);
  const tags = location.state.tags;
  const pdfRef = useRef(); // PDF로 변환할 영역 참조


  const answers = location.state.answers;
  let correct = 0;
  let wrong = 0;

  // 태그별 정답/오답 개수 저장 객체
  const tagAccuracy = {};

  answers.forEach((question) => {
    const isCorrect = question.answer === question.selected;

    if (isCorrect) correct++;
    else wrong++;

    // 태그별 정답률 계산
    (question.tag || []).forEach((tag) => {
      if (!tagAccuracy[tag]) {
        tagAccuracy[tag] = { correct: 0, wrong: 0 };
      }
      if (isCorrect) {
        tagAccuracy[tag].correct++;
      } else {
        tagAccuracy[tag].wrong++;
      }
    });
  });

  // 태그 및 데이터 추출
  const tagLabels = Object.keys(tagAccuracy);
  const correctData = tagLabels.map((tag) => tagAccuracy[tag].correct);
  const wrongData = tagLabels.map((tag) => tagAccuracy[tag].wrong);

  // 정답/오답 전체 그래프
  const totalData = {
    labels: ["정답", "오답"],
    datasets: [
      {
        data: [correct, wrong],
        backgroundColor: ["#3B8BF6", "#F44336"],
        borderColor: ["#3B8BF6", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  // 태그별 정답률 그래프
  const tagData = {
    labels: tagLabels,
    datasets: [
      {
        label: "정답",
        data: correctData,
        backgroundColor: "#3B8BF6",
      },
      {
        label: "오답",
        data: wrongData,
        backgroundColor: "#F44336",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 10,
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };


  /**
   * 현재 페이지 pdf 로 변환하는 메소드
   * png 로 변환 -> pdf 로 변환환
   */
  const handleDownloadPDF = () => {
    const input = pdfRef.current;
    
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 기준 width(mm)
      const pageHeight = 297; // A4 기준 height(mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // 비율 유지

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("solve_result.pdf"); // PDF 다운로드
    });
  };

  /**
   * 풀이 완료한 문제 각각 채점 후 결과 제공
   * @returns 문제 풀이 채점 결과 제공
   */
  const resultPage = () => {
    return answers.map((answer, index) => {
      return answer.type === "주관식" ? (
        <SingleResult key={index} question={answer} index={index} setQuestions={setQuestions} />
      ) : (
        <MultipleResult key={index} question={answer} index={index} />
      );
    });
  };

  const navigate = useNavigate();

  const retry = () => {
    const retryTags = new Set();
    const retryQuestions = answers.filter((item) => item.answer !== item.selected);
    
    if(retryQuestions.length <= 0){
      // if (!toast.isActive("no-question-error")) {
      //         toast.error("현재 풀이 가능한 문제가 없습니다! 문제를 생성해주세요", { toastId: "no-question-error" });
      // } 
      return;
    }
     // 틀린 문제에서 태그 값을 Set에 추가
    retryQuestions.forEach((item) => {
      if (item.tag) {
        item.tag.forEach((tag) => retryTags.add(tag)); // 중복 없이 태그 추가
      }
    });

    navigate("/solve", {
      state: { questions: retryQuestions, tags: [...retryTags] },
    });
  
  }


  return (
    <main className="ml-20">
      {/* PDF 처리할 REF 설정 */}
      <div className="sm:rounded-lg flex flex-col items-center" ref={pdfRef}> 
        <div className="p-4 flex justify-between items-center border-b w-full">
          <div>
            <h1 className="text-2xl font-semibold overflow-hidden text-ellipsis">
            {tags.length == 0 && "문제 풀이 결과"}
              {tags.map((tag) => `${tag} `)}
            </h1>
            <h1 className="text-md font-normal text-gray-400">
              총 {answers.length}문제
            </h1>
          </div>
          <div className="flex items-center">
            {/* PDF 다운로드 버튼 */}
          <div 
          className="cursor-pointer bg-blue-500 hover:scale-105 transition text-white font-semibold rounded-2xl text-xs h-8 w-8 inline-flex items-center justify-center me-2 mb-2"

          onClick={handleDownloadPDF}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
              />
            </svg>
          </div>
          <div
              onClick={retry}
              className={`cursor-pointer bg-blue-500 hover:scale-105 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2 mb-2 transition`}
            >
              다시풀기
          </div>
          </div>
        </div>

        <div className="w-80 max-w-full m-10 flex gap-10 items-baseline justify-center max-[800px]:flex-wrap min-[800px]:flex-nowrap ">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-center">총 정답/오답 비율</h2>
              <div className="h-40">
              <Doughnut data={totalData} options={options} />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold text-center">태그별 정답/오답</h2>
              <div className="h-60">
                <Bar data={tagData} options={options} />
              </div>
            </div>
        </div>

        <div className="flex flex-col items-center max-[800px]:w-full min-[800px]:w-3/5">
          <div className="w-full max-w-full">{resultPage()}</div>
        </div>
      </div>
    </main>
  );
}

export default SolveResult;
