import React, { useState } from "react";
import { appPathAtom } from "state/data";
import { useRecoilValue } from "recoil";

function SingleResult({ question, index }) {
    const appPath = useRecoilValue(appPathAtom);
  
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const [showDescription, setShowDescription] = useState(false);
  const tags = question.tag || [];
  const tag = tags.map((tagName, index) => <div key={index} className="font-medium text-xs whitespace-nowrap bg-gray-200 rounded-xl py-1 px-2">{tagName}</div>);


  const Modal = ({ imgSrc, onClose}) => (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
    >
       <img
        src={imgSrc}
        alt="Enlarged"
        onClick={onClose}
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
        <div className={`box border font-bold rounded-lg p-2 px-5 text-center 
            ${question.answer === question.selected ? "text-blue-500" : "text-red-500"}
            `}>
            {question.selected ? question.selected : "답변안함"}
          </div>

          <div className="box text-blue-500 font-bold border rounded-lg p-2 px-5 mt-2 text-center">
            {question.answer}
          </div>
      </div>

      {/* 문제 해설 */}
      {question.description && (
        <div className="relative w-full">
          
          <div
          className={`mt-10 rounded-xl p-5 font-md bg-gray-100 w-full overflow-hidden text-clip transition-all inline-flex gap-1 ${
            !showDescription ? "blur-sm" : "blur-none"
          }`}>
          <img src="./images/light_icon.png" 
            onClick={() => setShowDescription(false)}
            className="w-5 h-5 cursor-pointer hover:scale-110 transition-all text"/>
            {question.description}
          </div>
          {!showDescription && (
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
