import React, {useState, useEffect} from 'react';
import { questionsAtom, allTagAtom } from "state/data";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {generateUniqueId} from "utils/util"
import { getTodayDate } from "utils/formatDate";


function InsertModal({setInsertModal}) {
  
    //문제추가폼
    const [title, setTitle] = useState("");
    const [type, setType] = useState("객관식");
    const [select1, setSelect1] = useState("");
    const [select2, setSelect2] = useState("");
    const [select3, setSelect3] = useState("");
    const [select4, setSelect4] = useState("");
    const [answer, setAnswer] = useState("");
    const [tag, setTag] = useState("");
    const [date, setDate] = useState(getTodayDate());

    const questions = useRecoilValue(questionsAtom);
    const setQuestions = useSetRecoilState(questionsAtom);
    const setAlltag = useSetRecoilState(allTagAtom);
    //console.log(questions)


    //이미지 업로드
    const [thumbnail, setThumbnail] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    
    const handleFileChange = (event) => {
      const image = event.target.files[0];
      if (image) {
        const reader = new FileReader();
        reader.onload = () => {
          setThumbnail(reader.result);
        };
        reader.readAsDataURL(image);
        setImageFile(image);
      }
    };

   
    async function handleSave(id, file) {
      try {
        const result = await window.electronAPI.saveImage(id, file);
        return result; // 저장 결과 반환
      } catch (error) {
        console.error("이미지 저장 중 오류 발생:", error);
        return { success: false, error: error.message };
      }
    }
    
    
    
    const insertEvent = async () => {
      if (!(title)) {
        alert("제목은 필수 입력 항목입니다"); 
        return;
      }
      
      const tags = tag ? [...new Set(tag.split(",").map((item) => item.trim()))] : [];

      // 초기 question 데이터 생성
      const question = {
        title,
        type,
        select1,
        select2,
        select3,
        select4,
        answer,
        img: null, // 초기 이미지는 null
        level: 0,
        date,
        update:date,
        recommenddate:date,
        solveddate:null,
        id: generateUniqueId(questions),
        tag: tags,
        checked:false,
      };

      let selectedAnswer;
      if(type === "객관식"){
        selectedAnswer = document.querySelector('input[name="answer"]:checked');

        if(!selectedAnswer){
          alert("객관식 답안을 설정해주세요");
          return;
        }

        question.answer = selectedAnswer.value;
      }
      

      // 이미지가 있는 경우 처리
      if (imageFile) {
        try {
          const result = await handleSave(
            question.id, // 질문의 id를 파일명으로 사용
            imageFile, // 파일 내용
          );

          if (result.success) {
            question.img = result.path; // 저장된 경로를 할당
          } else {
            console.error("이미지 저장 실패:", result.error);
            alert("이미지 저장에 실패했습니다.");
          }
        } catch (error) {
          console.error("이미지 저장 중 오류 발생:", error);
          alert("이미지 저장 중 오류가 발생했습니다.");
        }
      }

      
      
      
    
      // 상태 초기화 (항상 빈 문자열 사용)
      setTitle("");
      setSelect1("");
      setSelect2("");
      setSelect3("");
      setSelect4("");
      setAnswer("");
      setThumbnail(null);
      setTag(""); // 태그 초기화
    
      setQuestions((prevQuestions) => [question, ...prevQuestions]);
      };
    

      return (

        <div className="h-full w-full p-7 flex flex-col gap-2">
                    <div className="flex justify-between">
                      <div className="font-bold text-xl pl-1">문제 추가하기</div>
                      <div className="items-center flex">
                        <div
                          onClick={insertEvent}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2"
                        >
                          저장하기
                        </div>
                        <div
                          onClick={() => setInsertModal(false)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-full text-xs h-8 w-8 inline-flex items-center justify-center me-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        className="block min-w-[50%] outline-none border-b-2 border-gray-200 focus:border-blue-500 text-sm px-2 py-1 h-10"
                        placeholder="문제를 입력해주세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                      <select
                        className="block border-b-2 text-sm px-2 py-1 h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="객관식">객관식</option>
                        <option value="주관식">주관식</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      className="block outline-none border-b-2 border-gray-200 focus:border-blue-500 text-sm px-2 py-1 h-10 w-1/2 flex-none"
                      placeholder="태그를 입력해주세요"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                    />

                    {type === "객관식" ? (<div className="flex gap-5">
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex gap-3">
                          <input
                            type="radio"
                            name="answer"
                            value={select1}
                          />
                          <input
                            type="text"
                            className="flex-1 block text-sm h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-3"
                            placeholder="선택지1"
                            value={select1}
                            onChange={(e) => setSelect1(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-3">
                          <input
                            type="radio"
                            name="answer"
                            value={select2}
                          />
                          <input
                            type="text"
                            className="flex-1 block text-sm h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-3"
                            placeholder="선택지2"
                            value={select2}
                            onChange={(e) => setSelect2(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex gap-3">
                          <input
                            type="radio"
                            name="answer"
                            value={select3}
                            
                          />
                          <input
                            type="text"
                            className="flex-1 block text-sm h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-3"
                            placeholder="선택지3"
                            value={select3}
                            onChange={(e) => setSelect3(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-3">
                          <input
                            type="radio"
                            name="answer"
                            value={select4}
                          />
                          <input
                            type="text"
                            className="flex-1 block text-sm h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-3"
                            placeholder="선택지4"
                            value={select4}
                            onChange={(e) => setSelect4(e.target.value)}
                          />
                        </div>
                      </div>
                      <div
                        className="bg-gray-50 flex rounded"
                        style={{
                          backgroundImage: thumbnail ? `url(${thumbnail})` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <input
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          className="w-full h-full text-xs opacity-0"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>) : (
                      
                      <div className="flex gap-3 flex-1">
                                  <input
                                    type="text"
                                    className="flex-1 block text-sm h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-3"
                                    placeholder="정답"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                  />
                                  <div
                                    className="bg-gray-50 flex rounded"
                                    style={{
                                      backgroundImage: thumbnail ? `url(${thumbnail})` : "none",
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                    }}
                                  >
                                    <input
                                      type="file"
                                      accept=".jpg, .jpeg, .png"
                                      className="w-full h-full text-xs opacity-0"
                                      onChange={handleFileChange}
                                    />
                                  </div>
                        </div>
                    )}                  
                </div>
      
  
      );
    
}

export default InsertModal;