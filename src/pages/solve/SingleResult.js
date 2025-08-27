import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { addDays, format } from 'date-fns'; 
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { appPathAtom } from "state/data.js";
import { markdownComponents } from "utils/markdownUtils.js"

function SingleResult({ question, index, setQuestions, isShowAllDescription }) {
  const appPath = useRecoilValue(appPathAtom);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(question.answer === question.selected);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const [showDescription, setShowDescription] = useState(false);
  const tags = question.tag || [];
  const tag = tags.map((tagName, index) => <div key={index} className="font-medium text-xs whitespace-nowrap bg-gray-200 rounded-xl py-1 px-2">{tagName}</div>);
  const today = new Date(); // 오늘 날짜 객체


  // 25.03.09
  const reverseSubmit = async (question) => {
    // 기존 오답 처리된 level과 updateDate를 원래 값으로 복구
    let restoredLevel = question.level;
    let restoredUpdateDate = question.update;
  
    // 오답 처리되면서 level이 감소했으므로 다시 원래 값으로 복구
    let previousLevel = Math.min(parseInt(restoredLevel, 10) + 1, 3); // 감소했던 level을 다시 복구
  
    // 기존 updateDate에서 오답 처리 시 추가되었던 날짜를 빼줌
    let previousDaysToAdd;
    switch (parseInt(restoredLevel, 10)) {
      case 0:
        previousDaysToAdd = 1;
        break;
      case 1:
        previousDaysToAdd = 2;
        break;
      case 2:
        previousDaysToAdd = 3;
        break;
      case 3:
      default:
        previousDaysToAdd = 4;
        break;
    }
    let previousUpdateDate = format(addDays(new Date(restoredUpdateDate || today), -previousDaysToAdd), "yyyy-MM-dd");

    // 이제 원래 상태에서 다시 정답 처리를 진행
    let newLevel = Math.min(previousLevel + 1, 3); // 정답 처리: level 증가
  
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
  
    let newUpdateDate = format(addDays(new Date(previousUpdateDate), daysToAdd), "yyyy-MM-dd"); // 정답 처리된 updateDate
  
    // 업데이트된 문제 객체 생성
    const updatedQuestion = {
      ...question,
      level: newLevel.toString(), // 정답 처리된 level
      update: newUpdateDate, // 정답 처리된 updateDate
    };

  
    // history 업데이트
    try {
      const historyResponse = await window.electronAPI.updateHistory({ isCorrect: true });
      if (!historyResponse.success) {
        console.error(`history.csv 업데이트 실패: ${historyResponse.message}`);
      }
    } catch (error) {
      console.error("history.csv 업데이트 중 오류:", error);
    }

    setIsCorrect(true);
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };
  

  const Modal = ({ imgSrc, onClose}) => (
    <div
      onClick={() => onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
    >
       <img
        src={imgSrc}
        alt="Enlarged"
        className="max-w-full max-h-full rounded"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-3 p-10 items-start w-full">
    {/* 문제 제목 */}
      <div className="text-lg font-bold w-full text-start">
        <span>{index + 1}. </span>
        <span>{question.title}</span>
      </div>
      {/* 문제 태그 */}
      {tag.length > 0 && (<div className="flex gap-1 justify-start text-start">{tag}</div>)}

      {/* 문제 이미지 */}
      {question.img && (
        <div>
          <img
            onClick={openModal}
            className="bg-gray-50 w-full rounded h-auto"
            src={appPath + question.img}
            alt=""
          />
        </div>
      )}

      {/* 사용자 입력 답안 / 문제 정답 */}
      <div className="text-sm w-full"> 
        <div className={`box border font-bold rounded-lg p-2 px-5 flex justify-between
            ${isCorrect ? "text-blue-500" : "text-red-500"}
            `}>
            {question.selected ? question.selected : "답변안함"}


          {!isCorrect && (
          <div
            onClick={() => reverseSubmit(question)}
            className={`cursor-pointer ml-auto text-center text-sm p-1 px-3 rounded-lg text-white bg-red-100 hover:bg-red-500 hover:scale-105`}
          >
            정답처리
          </div>
          )}
        </div>
        
        <div className="box text-blue-500 font-bold border rounded-lg p-2 px-5 mt-2">
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkBreaks]}>
                {question.answer}
            </ReactMarkdown>
        </div>
        
      </div>
      

      {/* 문제 해설 */}
      {question.description && (
        <div className="relative w-full">
          
          <div
          className={`mt-10 rounded-xl p-5 font-md bg-gray-100 w-full overflow-hidden text-clip transition-all inline-flex gap-1 ${
            (!isShowAllDescription && !showDescription ) ? "blur-sm" : "blur-none"
          }`}>
          <img src="./images/light_icon.png" 
            onClick={() => setShowDescription(false)}
            className="w-5 h-5 cursor-pointer hover:scale-110 transition-all text hover:scale-110 mr-1"/>
            {question.description}
          </div>
          {(!isShowAllDescription && !showDescription) && (
            <button
              className="mt-10 absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white font-bold rounded-xl"
              onClick={() => setShowDescription(true)}
            >
              해설보기
            </button>
          )}
        </div>
      )}
      
      {showModal && <Modal imgSrc={appPath + question.img} onClose={closeModal} />}


    </div>
  );
}

export default SingleResult;
