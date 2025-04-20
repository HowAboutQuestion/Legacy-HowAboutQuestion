import React, { useState, useEffect } from "react";
import { questionsAtom, allTagAtom } from "state/data";
import { useRecoilValue, useSetRecoilState } from "recoil";
import UpdateModal from "pages/question/updateModal/UpdateModal";
import { useLocation } from "react-router-dom";
import InsertModal from "pages/question/insertModal/InsertModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "pages/question/Sidebar";
import QuestionsMain from "pages/question/QuestionsMain";

function Questions() {
  const location = useLocation();
  //모든 문제 전역에서 불러오기
  const questions = useRecoilValue(questionsAtom);
  const setQuestions = useSetRecoilState(questionsAtom);

  const [filterQuestions, setFilterQuestions] = useState([]);

  //존재하는 중복 없는 모든 태그
  const allTag = useRecoilValue(allTagAtom);
  const [selectedTag, setSelectedTag] = useState([]);

  useEffect(() => {
    if (location.state?.openModal) {
      setInsertModal(true);
    }
  }, [location.state]);

  // 태그 선택/해제 핸들러
  const onTagClick = (tagName) => {
    setSelectedTag(
      (prev) =>
        prev.includes(tagName)
          ? prev.filter((tag) => tag !== tagName) // 이미 선택된 경우 제거
          : [...prev, tagName] // 새로 선택된 경우 추가
    );
  };

  //태그 필터링 이벤트트
  useEffect(() => {
    if (selectedTag.length === 0) {
      setFilterQuestions(
        questions.map((question, index) => ({ question, index }))
      );
      return;
    }

    const filtered = questions
      .map((question, index) => ({ question, index })) // 각 질문과 인덱스를 묶음
      .filter(({ question }) =>
        question.tag.some((tag) => selectedTag.includes(tag))
      );
    setFilterQuestions(filtered);
  }, [questions, selectedTag]);

  //좌측 사이드바 토글
  const [isCollapsed, setIsCollapsed] = useState(true);

  //문제 추가 모달 토글
  const [insertModal, setInsertModal] = useState(false);
  const insertButtonClick = () => {
    setUpdateModal(false);
    setInsertModal(true);
  };

  //문제 업데이트 모달 토글
  const [updateModal, setUpdateModal] = useState(false);
  const [updateQuestion, setUpdateQuestion] = useState(null); // 수정할 질문 객체 (모달 제어 포함)
  const [updateIndex, setUpdateIndex] = useState(null);

  const handleUpdateClick = (question, index) => {
    setInsertModal(false);
    setUpdateModal(true);
    setUpdateIndex(index);
    setUpdateQuestion({ ...question });
  };

  /**
 * 질문 목록 중 checked == true인 항목이 있으면 → 체크된 질문만 추출해서 checked, id 제거 후 반환
 * checked == true인 항목이 없으면 → 전체 질문을 대상으로 checked, id 제거 후 반환
 */
  const handleDownloadToZip = async () => {
    console.log("filterQuestions :", filterQuestions);
    const downloadQuestions =
      filterQuestions
        .some(({ index, question }) => question.checked)
        ? filterQuestions
          .filter(({ index, question }) => question.checked) // question.checked가 true인 것만 필터링
          .map(({ index, question }) => {
            const { checked, id, ...rest } = question;
            return rest;
          })
        : filterQuestions
          .map(({ index, question }) => {
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

  const deleteFilteredQuestions = async () => {
    const confirmed = await confirmDeletion();
    if (!confirmed) return;
  
    const deleteImages = [];
  
    // 삭제할 문제 id 수집
    const idsToDelete = filterQuestions
      .filter(({ question }) => {
        if (question.checked === true) {
          if (question.img) deleteImages.push(question.img);
          return true;
        }
        return false;
      })
      .map(({ question }) => question.id); // 삭제 대상 id만 추출
  
    // 전체 questions 기준으로 삭제 대상 제외
    const newQuestions = questions
      .filter((q) => !idsToDelete.includes(q.id))
      .map((q) => {
        const { checked, ...rest } = q; // checked 제거
        return rest;
      });
  
    setQuestions(newQuestions); // Recoil 상태 업데이트
  
    // CSV 반영
    await window.electronAPI.updateQuestions(newQuestions);
  
    // 이미지 삭제
    const handleDelete = async (imagePath) => {
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
    deleteImages.forEach((img) => {
      handleDelete(img);
    });
  
    toast.success("선택된 문제가 삭제되었습니다.", {
      position: "top-center",
      autoClose: 1000,
    });
  };
  


  // 모달 기본 높이 300px
  const [modalHeight, setModalHeight] = useState(300);

  // 모달 높이 70%면 내용 바뀜
  const expanded = modalHeight >= window.innerHeight * 0.7;

  const toggleModalHeight = () => {
    if (modalHeight < window.innerHeight * 0.7) {
      setModalHeight(window.innerHeight);
    } else {
      setModalHeight(300);
    }
  };

  const handleDragMouseDown = (e) => {
    const startY = e.clientY;
    const startHeight = modalHeight;
    const MIN_HEIGHT = 300;
    const MAX_HEIGHT = window.innerHeight; // 현재 창의 최대 높이로 설정

    const onMouseMove = (e) => {
      const diff = startY - e.clientY; // 위로 드래그하면 양수가 됨
      const newHeight = startHeight + diff;
      setModalHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, newHeight)));
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <main className="ml-20 flex">
      <Sidebar
        isCollapsed={isCollapsed}
        allTag={allTag}
        selectedTag={selectedTag}
        onTagClick={onTagClick}
        setIsCollapsed={setIsCollapsed}
      />

      <QuestionsMain
        filterQuestions={filterQuestions}
        isCollapsed={isCollapsed}
        setFilterQuestions={setFilterQuestions}
        deleteFilteredQuestions={deleteFilteredQuestions}
        insertButtonClick={insertButtonClick}
        handleUpdateClick={handleUpdateClick}
        handleDownloadToZip={handleDownloadToZip}
      />

      {/* 오버레이는 모달이 열려있을 때만 렌더링 */}
      {(insertModal || updateModal) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setInsertModal(false);
            setUpdateModal(false);
          }}
        ></div>
      )}
      {/* 모달 컨테이너는 항상 렌더링, 높이는 상태에 따라 변경 */}
      <div
        className={`transition-all duration-500 width-fill-available shadow-[10px_0px_10px_10px_rgba(0,0,0,0.1)] rounded-t-2xl fixed bottom-0 bg-white ${isCollapsed ? "ml-10" : "ml-80"
          } z-50`}
        style={{ height: insertModal || updateModal ? modalHeight : 0 }}
      >
        {/* 드래그 핸들 (모달 상단 중앙에 위치) */}
        <div
          className="h-1.5 w-12 mx-auto mt-3 bg-[#ccc] rounded-xl cursor-pointer"
          onClick={toggleModalHeight}
        />
        {insertModal && (
          <InsertModal setInsertModal={setInsertModal} expanded={expanded} />
        )}
        {updateModal && (
          <UpdateModal
            setUpdateModal={setUpdateModal}
            question={updateQuestion}
            setUpdateQuestion={setUpdateQuestion}
            isCollapsed={isCollapsed}
            index={updateIndex}
            expanded={expanded}
          />
        )}
      </div>
    </main>
  );
}

export default Questions;
