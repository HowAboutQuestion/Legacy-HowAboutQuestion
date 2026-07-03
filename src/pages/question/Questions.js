import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "pages/question/Sidebar.js";
import UpdateModal from "pages/question/updateModal/UpdateModal.js";
import InsertModal from "pages/question/insertModal/InsertModal.js";
import QuestionsMain from "pages/question/QuestionsMain.js";
import { questionsAtom, allTagAtom } from "state/data.js";

function Questions() {
  const location = useLocation();
  //모든 문제 전역에서 불러오기
  const questions = useRecoilValue(questionsAtom);
  const setQuestions = useSetRecoilState(questionsAtom);

  const [filterQuestions, setFilterQuestions] = useState([]);

  //존재하는 중복 없는 모든 태그
  const allTag = useRecoilValue(allTagAtom);
  const [selectedTag, setSelectedTag] = useState([]);

  // 선택 시스템
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [excludedIds, setExcludedIds] = useState(new Set());

  // 무한 스크롤
  const [displayCount, setDisplayCount] = useState(50);

  useEffect(() => {
    if (location.state?.openModal) {
      setInsertModal(true);
    }
  }, [location.state]);

  useEffect(() => {
    const handleOpenSidebar = () => setIsCollapsed(false);

    const handleOpenInsertModal = () => {
      setInsertModal(true);
      setUpdateModal(false);
      setModalHeight(300);
    };

    window.addEventListener("open-sidebar", handleOpenSidebar);
    window.addEventListener("open-insert-modal", handleOpenInsertModal);

    return () => {
      window.removeEventListener("open-sidebar", handleOpenSidebar);
      window.removeEventListener("open-insert-modal", handleOpenInsertModal);
    };
  }, []);

  // selectedTag 변경 시 displayCount 리셋
  useEffect(() => {
    setDisplayCount(50);
  }, [selectedTag]);

  // 태그 선택/해제 핸들러
  const onTagClick = (tagName) => {
    setSelectedTag(
      (prev) =>
        prev.includes(tagName)
          ? prev.filter((tag) => tag !== tagName)
          : [...prev, tagName]
    );
  };

  const handleCheckboxChange = useCallback((id) => {
    if (isAllSelected) {
      setExcludedIds(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    } else {
      setCheckedIds(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  }, [isAllSelected]);

  const handleAllCheckboxChange = useCallback(() => {
    setCheckedIds(new Set());
    setExcludedIds(new Set());
    setIsAllSelected(prev => !prev);
  }, []);

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => prev + 50);
  }, []);

  const onQuestionAdded = useCallback((newId) => {
    if (isAllSelected) {
      setExcludedIds(prev => new Set([...prev, newId]));
    }
  }, [isAllSelected]);

  const onQuestionsAdded = useCallback((newIds) => {
    if (isAllSelected && newIds.length > 0) {
      setExcludedIds(prev => new Set([...prev, ...newIds]));
    }
  }, [isAllSelected]);

  //태그 필터링 이벤트트
  useEffect(() => {
    if (selectedTag.length === 0) {
      setFilterQuestions(
        questions.map((question, index) => ({ question, index }))
      );
      return;
    }

    const filtered = questions
      .map((question, index) => ({ question, index }))
      .filter(({ question }) =>
        question.tag.some((tag) => selectedTag.includes(tag))
      );
    setFilterQuestions(filtered);
  }, [questions, selectedTag]);

  useEffect(() => {
    const collapseHandler = () => {
      // 확장 모드를 일반 모드(300px 높이)로 되돌림
      setModalHeight(300);
    };
    window.addEventListener("collapse-insert-modal", collapseHandler);
    return () => window.removeEventListener("collapse-insert-modal", collapseHandler);
  }, []);

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

  const handleUpdateClick = useCallback((question, index) => {
    setInsertModal(false);
    setUpdateModal(true);
    setUpdateIndex(index);
    setUpdateQuestion({ ...question });
  }, []);

  const selectedCount = isAllSelected
    ? filterQuestions.filter(({ question }) => !excludedIds.has(question.id)).length
    : filterQuestions.filter(({ question }) => checkedIds.has(question.id)).length;

  const isAllChecked = selectedCount > 0 && selectedCount === filterQuestions.length;

  const handleDownloadToZip = async () => {
    const isSelected = (question) =>
      isAllSelected ? !excludedIds.has(question.id) : checkedIds.has(question.id);

    const downloadQuestions = selectedCount > 0
      ? filterQuestions
          .filter(({ question }) => isSelected(question))
          .map(({ question }) => { const { checked, id, ...rest } = question; return rest; })
      : filterQuestions
          .map(({ question }) => { const { checked, id, ...rest } = question; return rest; });

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

  const isDeletingRef = useRef(false);

  const deleteFilteredQuestions = async () => {
    if (isDeletingRef.current) return;

    const confirmed = await confirmDeletion();
    if (!confirmed) return;

    if (isDeletingRef.current) return;
    isDeletingRef.current = true;

    try {
      const isSelected = (question) =>
        isAllSelected ? !excludedIds.has(question.id) : checkedIds.has(question.id);

      const deleteImagesSet = new Set();
      const idsToDelete = filterQuestions
        .filter(({ question }) => {
          if (isSelected(question)) {
            if (question.img) deleteImagesSet.add(question.img);
            return true;
          }
          return false;
        })
        .map(({ question }) => question.id);

      if (idsToDelete.length === 0) return;

      const newQuestions = questions.filter((q) => !idsToDelete.includes(q.id));
      setQuestions(newQuestions);
      window.electronAPI.deleteQuestions(idsToDelete);

      setCheckedIds(new Set());
      setIsAllSelected(false);
      setExcludedIds(new Set());

      const handleDelete = async (imagePath) => {
        try {
          const result = await window.electronAPI.deleteImage(imagePath);
          if (!result.success) {
            console.error("삭제 실패:", result.message);
          }
        } catch (error) {
          console.error("삭제 중 오류 발생:", error);
        }
      };
      [...deleteImagesSet].forEach((img) => handleDelete(img));

      toast.success("선택된 문제가 삭제됐습니다.", {
        position: "top-center",
        autoClose: 1000,
      });
    } finally {
      isDeletingRef.current = false;
    }
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

  const navigate = useNavigate();
  const goSelectSolve = () => {
    const toSolveTags = new Set();
    const isSelected = (question) =>
      isAllSelected ? !excludedIds.has(question.id) : checkedIds.has(question.id);

    const toSolveQuestions = selectedCount > 0
      ? filterQuestions
          .filter(({ question }) => isSelected(question))
          .map(({ question }) => {
            const { checked, tag, ...rest } = question;
            if (tag) tag.forEach((t) => toSolveTags.add(t));
            return rest;
          })
      : filterQuestions.map(({ question }) => {
          const { checked, tag, ...rest } = question;
          if (tag) tag.forEach((t) => toSolveTags.add(t));
          return rest;
        });

    navigate("/select", {
      state: {
        selectedTags: [...toSolveTags],
        selectedQuestions: toSolveQuestions,
      },
    });
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
        deleteFilteredQuestions={deleteFilteredQuestions}
        insertButtonClick={insertButtonClick}
        handleUpdateClick={handleUpdateClick}
        handleDownloadToZip={handleDownloadToZip}
        goSelectSolve={goSelectSolve}
        checkedIds={checkedIds}
        isAllSelected={isAllSelected}
        excludedIds={excludedIds}
        selectedCount={selectedCount}
        handleCheckboxChange={handleCheckboxChange}
        handleAllCheckboxChange={handleAllCheckboxChange}
        isAllChecked={isAllChecked}
        displayCount={displayCount}
        onLoadMore={handleLoadMore}
        onQuestionsAdded={onQuestionsAdded}
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
        data-tour-id="insert-modal-root"
        className="width-fill-available shadow-[10px_0px_10px_10px_rgba(0,0,0,0.1)] rounded-t-2xl fixed bottom-0 bg-white ml-10 z-50"
        style={{ height: insertModal || updateModal ? modalHeight : 0 }}
      >
        {/* 드래그 핸들 (모달 상단 중앙에 위치) */}
        <div
          className="h-1.5 w-12 mx-auto mt-3 bg-[#ccc] rounded-xl cursor-pointer"
          onClick={toggleModalHeight}
          data-tour-id="insert-modal-expend"
        />
        {insertModal && (
          <InsertModal
            setInsertModal={setInsertModal}
            expanded={expanded}
            onQuestionAdded={onQuestionAdded}
          />
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
