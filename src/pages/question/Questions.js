import React, { useState, useEffect } from "react";
import { questionsAtom, allTagAtom } from "state/data";
import { useRecoilValue, useSetRecoilState } from "recoil";
import QuestionItem from "pages/question/QuestionItem";
import UpdateModal from "pages/question/updateModal/UpdateModal";
import { useLocation } from "react-router-dom";
import InsertModal from "pages/question/insertModal/InsertModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "pages/question/Sidebar";
import QuestionsMain from "pages/question/QuestionsMain";

function Questions() {
  const location = useLocation();
  //모든 문제 전역에서 불러오기
  const questions = useRecoilValue(questionsAtom);
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
        insertButtonClick={insertButtonClick}
        handleUpdateClick={handleUpdateClick}
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
        className={`transition-all duration-500 width-fill-available shadow-[10px_0px_10px_10px_rgba(0,0,0,0.1)] rounded-t-2xl fixed bottom-0 bg-white ${
          isCollapsed ? "ml-10" : "ml-80"
        } z-50`}
        style={{ height: insertModal || updateModal ? modalHeight : 0 }}
      >
        {/* 드래그 핸들 (모달 상단 중앙에 위치) */}
        <div
          onClick={toggleModalHeight}
          style={{
            height: "8px",
            width: "50px",
            margin: "0 auto",
            backgroundColor: "#ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
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
