import React, { useState, useEffect, useRef } from 'react';
import { questionsAtom } from "state/data";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { generateUniqueId }  from "utils/util"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appPathAtom } from "state/data";

function UpdateModal({ setUpdateModal, question, setUpdateQuestion, isCollapsed, index }) {
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
  
// thumbnail 상태를 설정할 때, 경로를 보정하는 헬퍼 함수 추가
const getProperImageUrl = (path) => {
  if (!path) return placeholderImage;
  // Windows의 역슬래시를 슬래시로 변경
  let normalizedPath = path.replace(/\\/g, '/');
  // 이미 "file://"로 시작하지 않는다면 file:/// 접두어 추가
  if (!normalizedPath.startsWith('file://')) {
    normalizedPath = `file:///${normalizedPath}`;
  }
  return normalizedPath;
};

  const [thumbnail, setThumbnail] = useState(question.img || placeholderImage);
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
    setThumbnail(placeholderImage);
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
              toast.error("제목은 필수 입력 항목입니다", { toastId: "update-title-error" });
            }
      return;
    }

    const tags = tag ? [...new Set(tag.split(",").map((item) => item.trim()))] : [];
    const updatedQuestion = {
      ...question,
      title,
      type,
      select1,
      select2,
      select3,
      select4,
      answer,
      img: question.img,
      date,
      tag: tags,
    };

    if (imageFile) {
      // 기존 이미지가 있으면 삭제 (삭제에 실패해도 진행할 수 있도록 try-catch)
      if (question.img) {
        try {
          const deleteResult = await window.electronAPI.deleteImage(question.img);
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
            toast.error("이미지 저장에 실패했습니다.", { toastId: "saving-image-false" });
        }
          return;
        }
      } catch (error) {
        console.error("이미지 저장 중 오류 발생:", error);
        if (!toast.isActive("saving-image-error")) {
              toast.error("이미지 저장 중 오류가 발생했습니다.", { toastId: "saving-image-error" });
        }
        return;
      }
    } else {
      // 새 이미지 파일이 없는 경우, 현재 썸네일 상태 반영 (플레이스홀더면 null)
      updatedQuestion.img = thumbnail === placeholderImage ? null : thumbnail;
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
    setAnswer(question.answer || "");
    setTag(question.tag.join(", ") || "");
    setDate(question.date || "");
    setThumbnail(getProperImageUrl((question.img ? appPath + question.img : null)));
  }, [question]);


  //x 버튼 공통 이미지 업로드 컴포넌트
  const renderImageUpload = () => (
    <div
      className="relative bg-gray-50 flex rounded w-full h-full"
      style={{
        backgroundImage: thumbnail ? `url("${thumbnail}")` : "none",
        backgroundSize: "cover",
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
      className="h-full w-full p-7 flex flex-col gap-2 relative"
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
          <span className="text-white text-xl">파일을 놓으면 이미지가 업로드 됩니다</span>
        </div>
      )}
      <div className="h-full w-full p-7 flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="font-bold text-xl pl-1">문제 수정하기</div>
          <div className="items-center flex">
            <div
              onClick={updateEvent}
              className="cursor-pointer bg-blue-500 transition hover:scale-105 text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2"
            >
              저장하기
            </div>
            <div
              onClick={() => updateCancleEvent()}
              className="cursor-pointer bg-blue-500 transition hover:scale-105 text-white font-semibold rounded-full text-xs h-8 w-8 inline-flex items-center justify-center me-2"
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
              placeholder="문제집 또는 태그를 입력해주세요"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />

            {type === "객관식" ? (<div className="flex gap-5">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex gap-3">
                  <input
                    type="radio"
                    name="answer"
                    onChange={() => setAnswer(select1)}
                    checked={answer === select1}
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
                    checked={answer === select2}
                    onChange={() => setAnswer(select2)}
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
                    checked={answer === select3}
                    onChange={() => setAnswer(select3)}
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
                    checked={answer === select4}
                    onChange={() => setAnswer(select4)}
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
          <div className="flex-1 transform transition duration-300 hover:scale-105">
            {renderImageUpload()}
          </div>
        </div>
      </div>
    </div>
  );

}

export default UpdateModal;