import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { generateUniqueId } from "utils/idUtils.js";
import { getTodayDate } from "utils/dateUtils.js";
import "react-toastify/dist/ReactToastify.css";
import InsertModalExpanded from "./InserModalExpanded.js";
import InsertModalCompact from "./InsertModalCompact.js";
import { questionsAtom, allTagAtom } from "state/data.js";

function InsertModal({ setInsertModal, expanded }) {
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
  const [description, setDescription] = useState("");
  const questions = useRecoilValue(questionsAtom);
  const setQuestions = useSetRecoilState(questionsAtom);
  const setAlltag = useSetRecoilState(allTagAtom);
  //console.log(questions)

  const [thumbnail, setThumbnail] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragCounter = useRef(0);
  const titleInputRef = useRef(null);

  const placeholderImage = "./images/insertImg.png";
  const uploadImage = "./images/uploadImg.png";

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

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
        toast.error("제목은 필수 입력 항목입니다", {
          toastId: "insert-title-error",
        });
      }
      return;
    }

    const tags = tag
      ? [...new Set(tag.split(",").map((item) => item.trim()))]
      : [];

    const question = {
      title,
      type,
      select1,
      select2,
      select3,
      select4,
      answer,
      description,
      img: null,
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

      if (selectedOptionIndex === null) {
        if (!toast.isActive("write-multi")) {
          toast.error("객관식 답안을 설정해주세요", { toastId: "write-multi" });
        }
        return;
      }
      const options = [select1, select2, select3, select4];
      question.answer = options[selectedOptionIndex];
    }

    // 이미지가 있는 경우 처리
    if (imageFile) {
      try {
        const result = await handleSave(
          question.id, // 질문의 id를 파일명으로 사용
          imageFile // 파일 내용
        );

        if (result.success) {
          question.img = result.path; // 저장된 경로를 할당
        } else {
          console.error("이미지 저장 실패:", result.error);
          if (!toast.isActive("image-false")) {
            toast.error("이미지 저장에 실패했습니다..", {
              toastId: "image-false",
            });
          }
        }
      } catch (error) {
        console.error("이미지 저장 중 오류 발생:", error);
        if (!toast.isActive("image-error")) {
          toast.error("이미지 저장 중 오류가 발생했습니다.", {
            toastId: "image-error",
          });
        }
      }
    }

    // 상태 초기화
    setTitle("");
    setSelect1("");
    setSelect2("");
    setSelect3("");
    setSelect4("");
    setAnswer("");
    setDescription("");
    setThumbnail(null);
    setSelectedOptionIndex(null);
    setImageFile(null);
    setQuestions((prevQuestions) => [question, ...prevQuestions]);

    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const renderImageUpload = () => (
    <div
      className="relative bg-gray-50 min-h-[150px] flex rounded h-full"
      style={{
        backgroundImage: thumbnail
          ? `url("${thumbnail}")`
          : `url(${placeholderImage})`,
        backgroundSize: "100% 100%",
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
        className="w-full min-h-[150px] text-xs opacity-0 bg-blue-500"
        onChange={handleFileChange}
      />
    </div>
  );

  // 공통으로 사용할 props 객체 생성
  const commonProps = {
    title,
    setTitle,
    type,
    setType,
    select1,
    setSelect1,
    select2,
    setSelect2,
    select3,
    setSelect3,
    select4,
    setSelect4,
    answer,
    setAnswer,
    tag,
    setTag,
    description,
    setDescription,
    date,
    renderImageUpload,
    insertEvent,
    titleInputRef,
    setInsertModal,
    selectedOptionIndex,
    setSelectedOptionIndex,
  };

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
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <span className="text-white text-xl">
            파일을 놓으면 이미지가 업로드 됩니다
          </span>
        </div>
      )}

      {expanded ? (
        <InsertModalExpanded {...commonProps} />
      ) : (
        <InsertModalCompact {...commonProps} />
      )}
    </div>
  );
}

export default InsertModal;
