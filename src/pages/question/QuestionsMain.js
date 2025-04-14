import React, { useState } from "react";
import QuestionItem from "pages/question/QuestionItem";
import { questionsAtom, allTagAtom } from "state/data";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "react-toastify";


function QuestionsMain({ isCollapsed, filterQuestions, setFilterQuestions, insertButtonClick, handleUpdateClick }) {
  const [isAllChecked, setIsAllChecked] = useState(false); // 전체 체크박스 상태 관리
  const questions = useRecoilValue(questionsAtom);
  const setQuestions = useSetRecoilState(questionsAtom);

  const confirmDeletion = () => {
    if (toast.isActive("confirm-deletion")) {
      toast.dismiss("confirm-deletion");
    }
    return new Promise((resolve) => {
      toast.info(
        <div>
          <p className="text-sm">삭제하시겠습니까?</p>
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={() => {
                resolve(true);
                toast.dismiss("confirm-deletion");
              }}
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
            >
              확인
            </button>
            <button
              onClick={() => {
                resolve(false);
                toast.dismiss("confirm-deletion");
              }}
              className="bg-gray-300 text-black px-2 py-1 rounded text-xs"
            >
              취소
            </button>
          </div>
        </div>,
        {
          toastId: "confirm-deletion",
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
        }
      );
    });
  };

  const handleCheckboxChange = (index) => {
    setFilterQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map(
        ({ question, index: idx }) => ({
          question: {
            ...question,
            checked: idx === index ? !question.checked : question.checked, // 해당 index만 변경
          },
          index: idx,
        })
      );

      // 전체 체크박스 상태 업데이트
      const allChecked = updatedQuestions.every(
        ({ question }) => question.checked
      );
      setIsAllChecked(allChecked);

      return updatedQuestions;
    });
  };

  // 전체 체크박스 상태 변경
  const handleAllCheckboxChange = () => {
    const newCheckedState = !isAllChecked;

    setFilterQuestions((prevQuestions) =>
      prevQuestions.map(({ question, index }) => ({
        question: {
          ...question,
          checked: newCheckedState, // 전체 체크박스 상태에 따라 변경
        },
        index,
      }))
    );

    setIsAllChecked(newCheckedState);
  };

  const handleZipUpload = async (event) => {
    const file = event.target.files[0]; // 사용자가 업로드한 파일
    if (file) {
      try {
        const result = await window.electronAPI.extractZip(file);
        if (result.success) {
          setQuestions([...result.questions, ...questions]); // questions 배열 업데이트
        }
      } catch (error) {
        console.error("Zip 파일 처리 중 오류:", error);
      }
    }
    event.target.files[0] = null;
  };

  const handleDownloadToZip = async () => {
    const downloadQuestions = filterQuestions.some(
      ({ index, question }) => question.checked
    )
      ? filterQuestions
        .filter(({ index, question }) => question.checked) // question.checked가 true인 것만 필터링
        .map(({ index, question }) => {
          const { checked, id, ...rest } = question;
          return rest;
        })
      : filterQuestions.map(({ index, question }) => {
        const { checked, id, ...rest } = question; // checked 제외한 데이터만 추출
        return rest;
      });

    const result = await window.electronAPI.exportQuestions(downloadQuestions);

    if (result.success) {
      if (!toast.isActive("export-success")) {
        toast.success(`문제 내보내기가 완료됐습니다. ${result.path}`, {
          toastId: "export-success",
        });
      }
    } else {
      if (!toast.isActive("export-error")) {
        toast.error(`문제 내보내기 중 문제가 발생했습니다. ${result.message}`, {
          toastId: "export-error",
        });
      }
    }
  };

  const deleteQuestionsAll = async () => {
    const confirmed = await confirmDeletion();
    if (!confirmed) return; // 취소한 경우 중단

    const deleteImages = [];

    const updatedQuestions = filterQuestions
      .filter(({ question }) => {
        if (question.checked === true) {
          if (question.img) deleteImages.push(question.img); // 삭제할 질문의 img 추가
          return false; // checked가 true면 삭제
        }
        return true;
      })
      .map(({ question }) => {
        const { checked, ...rest } = question;
        return rest;
      });

    setQuestions([...updatedQuestions]); // 질문 업데이트

    // CSV 파일 업데이트 (CSV 파일에도 반영)
    await window.electronAPI.updateQuestions(updatedQuestions);

    const handleDelete = async (imagePath) => {
      console.log("handleDelete function imagePath:", imagePath);
      try {
        const result = await window.electronAPI.deleteImage(imagePath);
        if (result.success) {
          console.log("이미지가 성공적으로 삭제되었습니다.");
        } else {
          console.error("삭제 실패:", result.message);
        }
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
      }
    };
    // 삭제할 이미지 처리
    deleteImages.forEach((img) => {
      handleDelete(img);
    });

    toast.success("선택된 문제가 삭제되었습니다.", {
      position: "top-center",
      autoClose: 1000,
    });
  };

  // 테이블 데이터 랜더링
  const questionsItems = filterQuestions.map(({ question, index }) => (
    <QuestionItem
      key={index}
      question={question}
      defaultChecked={false}
      onUpdateClick={() => handleUpdateClick(question, index)} // index 전달
      handleCheckboxChange={() => handleCheckboxChange(index)}
    />
  ));

  return (
    <div
      className={`mb-[300px] transition-all duration-500 flex-1 sm:rounded-lg ${isCollapsed ? "ml-10" : "ml-80"
        }`}
    >
      <div className="px-8 py-4 flex justify-between border-b">
        <div>
          <h1 className="text-2xl font-semibold">문제 관리</h1>
          <h1 className="text-md font-normal text-gray-400">
            총 {filterQuestions.length} 문제
          </h1>
        </div>
        <div className="bg-white items-center flex">
          <div
            onClick={() => insertButtonClick()}
            className="cursor-pointer bg-blue-500 hover:scale-105 transition text-white font-semibold rounded-2xl text-xs h-8 w-24 inline-flex items-center justify-center me-2 mb-2"
          >
            문제추가
          </div>
          <div className="bg-blue-500 hover:scale-105 text-white font-semibold rounded-full text-xs h-8 w-8 inline-flex items-center transition justify-center me-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4 absolute"
            >
              <path
                fillRule="evenodd"
                d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>

            <input
              onChange={handleZipUpload}
              type="file"
              accept=".zip"
              className="opacity-0 h-full w-full"
            ></input>
          </div>
          <div
            onClick={handleDownloadToZip}
            className="cursor-pointer bg-blue-500 hover:scale-105 transition text-white font-semibold rounded-full text-xs h-8 w-8 inline-flex items-center justify-center me-2 mb-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4 absolute"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <table className="text-left rtl:text-right text-gray-500 m-5 rounded-xl bg-gray-50 ">
        <thead className="text-sm font-bold text-gray-700 uppercase border-b">
          <tr className="px-10 bg-gray-100">
            <th scope="col" className="py-4 px-8 rounded-tl-xl">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  onChange={handleAllCheckboxChange} // 클릭 시 전체 선택/해제
                  checked={isAllChecked} // 모든 항목이 체크된 상태에 따라 체크박스 상태 변경
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </th>
            <th scope="col" className="px-6 py-3 w-full">
              문제
            </th>

            <th scope="col" className="px-6 py-3 whitespace-nowrap">
              유형
            </th>
            <th scope="col" className="px-3 py-3"></th>
            <th scope="col" className="px-5 py-3 rounded-tr-xl">
              <svg
                onClick={deleteQuestionsAll}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </th>
          </tr>
        </thead>
        <tbody>
          {questionsItems}
          <tr>
            <td className="rounded-b-xl h-10 bg-gray-50" colSpan={4}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default QuestionsMain;