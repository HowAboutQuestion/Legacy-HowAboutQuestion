import React, { useState, useEffect, useRef } from "react";
import { questionsAtom } from "state/data";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { generateUniqueId } from "utils/util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { appPathAtom } from "state/data";
import UpdateModalExpanded from "pages/question/updateModal/UpdateModalExpanded";
import UpdateModalCompact from "pages/question/updateModal/UpdateModalCompact";

function UpdateModal({
  setUpdateModal,
  question,
  setUpdateQuestion,
  isCollapsed,
  index,
  expanded,
}) {
  const appPath = useRecoilValue(appPathAtom);

  const placeholderImage = "./images/insertImg.png";

  const [title, setTitle] = useState(question.title || "");
  const [type, setType] = useState(question.type || "객관식");
  const [select1, setSelect1] = useState(question.select1 || "");
  const [select2, setSelect2] = useState(question.select2 || "");
  const [select3, setSelect3] = useState(question.select3 || "");
  const [select4, setSelect4] = useState(question.select4 || "");
  const [answer, setAnswer] = useState(question.answer || "");
  const [tag, setTag] = useState(question.tag.join(", ") || "");
  const [date, setDate] = useState(question.date || "");
  const [description, setDescription] = useState(question.description || "");
  const getInitialOptionIndex = () => {
    const options = [
      question.select1,
      question.select2,
      question.select3,
      question.select4,
    ];
    return options.findIndex((opt) => opt === question.answer);
  };
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(
    type === "객관식" ? getInitialOptionIndex() : -1
  );

  const [thumbnail, setThumbnail] = useState(question.img || "");
  const [imageFile, setImageFile] = useState(null);

  const setQuestions = useSetRecoilState(questionsAtom);
  const questions = useRecoilValue(questionsAtom);

  // 드래그 앤 드롭 관련 state 및 ref
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const uploadImage = "./images/uploadImg.png"; // 드롭시 배경 이미지

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
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleFileChange = (event) => {
    const image = event.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result);
        // 파일 입력 리셋: 같은 파일 재선택 시 이벤트 발생 보장
        event.target.value = null;
      };
      reader.readAsDataURL(image);
      setImageFile(image);
    }
  };

  const handleRemoveImage = () => {
    setThumbnail("");
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

  const updateEvent = async () => {
    if (!title) {
      if (!toast.isActive("update-title-error")) {
        toast.error("제목은 필수 입력 항목입니다", {
          toastId: "update-title-error",
        });
      }
      return;
    }

    if (type === "객관식") {
      // 선택된 옵션이 없을 경우
      if (selectedOptionIndex === -1) {
        if (!toast.isActive("update-multi")) {
          toast.error("객관식 답안을 설정해주세요", {
            toastId: "update-multi",
          });
        }
        return;
      }
      // 선택된 옵션의 텍스트가 비어있을 경우
      const options = [select1, select2, select3, select4];
      if (
        !options[selectedOptionIndex] ||
        options[selectedOptionIndex].trim() === ""
      ) {
        if (!toast.isActive("update-multi-empty")) {
          toast.error("선택된 객관식 답안이 비어있습니다", {
            toastId: "update-multi-empty",
          });
        }
        return;
      }
    }

    if (type === "주관식" && answer.trim() === "") {
      if (!toast.isActive("update-multi")) {
        toast.error("정답을 입력해주세요", { toastId: "update-multi" });
      }
      return;
    }
    const tags = tag
      ? [...new Set(tag.split(",").map((item) => item.trim()))]
      : [];

    const finalAnswer =
      type === "객관식"
        ? [select1, select2, select3, select4][selectedOptionIndex]
        : answer;

    const updatedQuestion = {
      ...question,
      title,
      type,
      select1,
      select2,
      select3,
      select4,
      answer: finalAnswer,
      description,
      img: thumbnail,
      date,
      tag: tags,
    };

    if (imageFile) {
      // 기존 이미지가 있으면 삭제 (삭제에 실패해도 진행할 수 있도록 try-catch)
      if (question.img) {
        try {
          const deleteResult = await window.electronAPI.deleteImage(
            question.img
          );
          if (!deleteResult.success) {
            console.error("기존 이미지 삭제 실패:", deleteResult.message);
            // 삭제 실패 시 추가 처리가 필요하면 여기서 처리
          }
        } catch (error) {
          console.error("기존 이미지 삭제 중 오류 발생:", error);
        }
      }

      // 새 파일 이름 생성 (questions 배열을 활용)
      const newFileName = generateUniqueId(questions);

      try {
        const result = await handleSave(newFileName, imageFile);
        if (result.success) {
          updatedQuestion.img = result.path;
          // 이미지 저장 후 파일 상태 초기화
          setImageFile(null);
        } else {
          console.error("이미지 저장 실패:", result.error);
          if (!toast.isActive("saving-image-false")) {
            toast.error("이미지 저장에 실패했습니다.", {
              toastId: "saving-image-false",
            });
          }
          return;
        }
      } catch (error) {
        console.error("이미지 저장 중 오류 발생:", error);
        if (!toast.isActive("saving-image-error")) {
          toast.error("이미지 저장 중 오류가 발생했습니다.", {
            toastId: "saving-image-error",
          });
        }
        return;
      }
    } else {
      updatedQuestion.img = thumbnail
    }

    // 질문 업데이트
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = updatedQuestion;
      return updatedQuestions;
    });

    setUpdateQuestion(null);
    setUpdateModal(false);
  };

  const updateCancleEvent = () => {
    setUpdateQuestion(null);
    setUpdateModal(false);
  };

  useEffect(() => {
    setTitle(question.title || "");
    setType(question.type || "객관식");
    setSelect1(question.select1 || "");
    setSelect2(question.select2 || "");
    setSelect3(question.select3 || "");
    setSelect4(question.select4 || "");
    if (question.type === "주관식") {
      setAnswer(question.answer || "");
    }
    setTag(question.tag.join(", ") || "");
    setDate(question.date || "");
    setDescription(question.description || "");
    setThumbnail(question.img || "");

    // 객관식일 경우, 기존 정답 문자열에서 인덱스를 재설정
    if (question.type === "객관식") {
      const options = [
        question.select1,
        question.select2,
        question.select3,
        question.select4,
      ];
      const idx = options.findIndex((opt) => opt === question.answer);
      setSelectedOptionIndex(idx);
    }
  }, [question, appPath]);

  const updateCancelEvent = () => {
    setUpdateQuestion(null);
    setUpdateModal(false);
  };

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
    selectedOptionIndex,
    setSelectedOptionIndex,
    renderImageUpload: () => (
      <div
        className="relative bg-gray-50 min-h-[150px] flex rounded h-full"
        style={{
          backgroundImage: thumbnail
            ? `url("${appPath + thumbnail}")`
            : `url(${placeholderImage})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        {thumbnail && thumbnail !== placeholderImage && (
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
    ),
    updateEvent,
    updateCancelEvent,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    isDragging,
    uploadImage,
  };

  //x 버튼 공통 이미지 업로드 컴포넌트
  const renderImageUpload = () => (
    <div
      className={`relative bg-gray-50 min-h-[150px] flex rounded h-full`}
      style={{
        backgroundImage: thumbnail
          ? `url("${appPath + thumbnail}")`
          : `url(${placeholderImage})`,
        backgroundSize: "100% 100%", // 여기서 100% 비율로 맞춤
        backgroundPosition: "center",
      }}
    >
      {thumbnail && thumbnail !== placeholderImage && (
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
        <UpdateModalExpanded {...commonProps} />
      ) : (
        <UpdateModalCompact {...commonProps} />
      )}
    </div>
  );
}

export default UpdateModal;