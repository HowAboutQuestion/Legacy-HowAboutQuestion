import React,{ useState } from "react";
import { appPathAtom } from "state/data";
import { useRecoilValue } from "recoil";
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { markdownComponents } from "utils/markdownUtil"


function MultipleResult({ question, index }) {
  const appPath = useRecoilValue(appPathAtom);

  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const [showDescription, setShowDescription] = useState(false);
  const tags = question.tag || [];
  const tag = tags.map((tagName, index) => <div key={index} className="font-medium text-xs whitespace-nowrap bg-gray-200 rounded-xl py-1 px-2">{tagName}</div>);



  const Modal = ({ imgSrc, onClose }) => {
    return (
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
  };

  return (
  <div className="flex flex-col gap-3 p-10 items-start w-full">
      {/* 문제 제목 */} 
      <div className="text-lg font-bold w-full text-start">
        <span>{index + 1}. </span>
        <span>{question.title}</span>
      </div>

      {/* 문제 태그 */}
      {tag.length > 0 && (<div className="flex gap-1 justify-start text-start">{tag}</div>)}

      <div className="flex gap-3 flex-col w-full">

      {/* 문제 이미지지 */}      
      {question.img && (
        <div>
          <img
            onClick={openModal}
            className="bg-gray-50 w-full h-auto rounded"
            src={appPath + question.img}
            alt=""
          />
        </div>
      )}

      {/* 사용자 입력 답안 / 문제 정답 */}
      <div className="font-normal text-sm flex flex-col gap-2 w-full">     
        {question.select1 && (<div className={`box border rounded-lg p-2 px-5
              ${
                question.answer === question.select1 ? "text-blue-500 font-bold" : question.selected === question.select1 ? "text-red-500 font-bold" : "" 
                }
              `}>
                  <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkBreaks]}>{question.select1}</ReactMarkdown>
          </div>)}
          
          {question.select2 && (<div className={`box border rounded-lg p-2 px-5
              ${
                question.answer === question.select2 ? "text-blue-500 font-bold" : question.selected === question.select2 ? "text-red-500 font-bold" : "" 
                }
              `}>
                  <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkBreaks]}>{question.select2}</ReactMarkdown>

          </div>)}
          
          {question.select3 && (<div className={`box border rounded-lg p-2 px-5
              ${
                question.answer === question.select3 ? "text-blue-500 font-bold" : question.selected === question.select3 ? "text-red-500 font-bold" : "" 
                }
              `}>
                  <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkBreaks]}>{question.select3}</ReactMarkdown>

          </div>)}
          
          {question.select4 && (<div className={`box border rounded-lg p-2 px-5
              ${
                question.answer === question.select4 ? "text-blue-500 font-bold" : question.selected === question.select4 ? "text-red-500 font-bold" : "" 
                }
              `}>
                  <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkBreaks]}>{question.select4}</ReactMarkdown>

          </div>)}
                 
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
  
      </div>
      {showModal && <Modal imgSrc={appPath + question.img} onClose={closeModal} />}
    </div>
  );
}

export default MultipleResult;