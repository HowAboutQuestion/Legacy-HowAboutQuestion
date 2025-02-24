import React, { useState, useRef } from 'react';
import { questionsAtom, allTagAtom } from "state/data";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { generateUniqueId } from "utils/util"
import { getTodayDate } from "utils/formatDate";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function InsertModal({ setInsertModal }) {
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

  //드래그 상태 추적용 state(이미지 업로드 영역 전용)
  const [isDragging, setIsDragging] = useState(false);

  // 드래그 카운터(자식 요소 때문에 여러 이벤트가 발생하는 것을 보완)
  const dragCounter = useRef(0);

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
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0; // 리셋

    setIsDragging(false);

    //드롭된 파일이 존재하는지, 최소한 하나 이상의 파일이 있는지 확인
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]; // 첫 번째 파일 확인
      // 객체 생성 및 파일 읽기
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file); // set으로 파일 업데이트 
    }
  };

  const handleRemoveImage = () => {
    setThumbnail(null);
    setImageFile(null);
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
    if (!title) {
      if (!toast.isActive("insert-title-error")) {
        toast.error("제목은 필수 입력 항목입니다", { toastId: "insert-title-error" });
      }
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
      update: date,
      recommenddate: date,
      solveddate: null,
      id: generateUniqueId(questions),
      tag: tags,
      checked: false,
    };

    let selectedAnswer;
    if (type === "객관식") {
      selectedAnswer = document.querySelector('input[name="answer"]:checked');

      if (!selectedAnswer || selectedAnswer.value === "") {
        if (!toast.isActive("write-multi")) {
          toast.error("객관식 답안을 설정해주세요", { toastId: "write-multi" });
        }
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
            if (!toast.isActive("image-false")) {
              toast.error("이미지 저장에 실패했습니다..",{ toastId: "image-false"});
            }
        }
      } catch (error) {
        console.error("이미지 저장 중 오류 발생:", error);
         if (!toast.isActive("image-error")) {
                toast.error("이미지 저장 중 오류가 발생했습니다.",{ toastId: "image-error"});
          }
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


  const placeholderImage = "./images/insertImg.png"; // 경로를 어떻게 해야 되나 배포 시 고민 해야 될 부분
  const uploadImage = "./images/uploadImg.png";

  const renderImageUpload = () => (
    <div
      className="relative bg-gray-50 flex rounded w-full h-full"
      style={{
        backgroundImage: thumbnail
          ? `url("${thumbnail}")`
          : `url(${placeholderImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {thumbnail && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1 text-xs z-10 transform transition duration-300 hover:scale-105"
        >
          삭제
        </button>
      )}
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        className="w-full h-full text-xs opacity-0"
        onChange={handleFileChange}
      />
    </div>
  );

  return (
    <div
      className="h-full w-full p-7 flex flex-col gap-2"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-50 pointer-events-none rounded-xl"
          style={{
            backgroundImage: `url(${uploadImage})`,
            backgroundSize: "100% 100%", // 전체 영역에 맞게 늘림 (비율 유지하지 않음)
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <span className="text-white text-xl">파일을 놓으면 이미지가 업로드 됩니다</span>
        </div>
      )}


      <div className="h-full w-full p-7 flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="font-bold text-xl pl-1">문제 추가하기</div>
          <div className="items-center flex">
            <div
              onClick={insertEvent}
              className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2"
            >
              저장하기
            </div>
            <div
              onClick={() => setInsertModal(false)}
              className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-full text-xs h-8 w-8 inline-flex items-center justify-center me-2"
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
        <div className="flex gap-2">
          <div className="flex-[2]">
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
            </div>
            ) : (
              <div className="flex gap-3 flex-1">
                <input
                  type="text"
                  className="flex-1 block text-sm h-10 outline-none border-b-2 border-gray-200 focus:border-blue-500 px-3"
                  placeholder="정답"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="flex-1">
            {renderImageUpload()}
          </div>
        </div>
      </div>
    </div>
  );

}

export default InsertModal;