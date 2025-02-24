import React, { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { questionsAtom, allTagAtom, selectedTagsAtom, selectedQuestionsAtom } from "state/data";
import { useNavigate, useLocation } from "react-router-dom";


function SelectSolve() {
  // Recoil에서 모든 문제와 태그 가져오기
  const allQuestions = useRecoilValue(questionsAtom);
  const allTag = useRecoilValue(allTagAtom);
  const location = useLocation();
  const {
    selectedTags: initialSelectedTags = [],
    selectedQuestions: initialSelectedQuestions = [],
  } = location.state || {};
  
  const [selectedTags, setSelectedTags] = useState(initialSelectedTags);
  const [selectedQuestions, setSelectedQuestions] = useState(initialSelectedQuestions);

  
  const navigate = useNavigate();

  const [filterQuestions, setFilterQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]); // 선택된 태그 상태

  /**
   * 태그 선택/해제 핸들러
   */
  const handleTagClick = (tagName) => {
    setSelectedTag((prev) =>
      prev.includes(tagName)
        ? prev.filter((tag) => tag !== tagName) // 이미 선택된 경우 제거
        : [...prev, tagName] // 새로 선택된 경우 추가
    );
  };

  /**
   * 선택된 태그 또는 전체 태그 표시
   */
  const tagItemsToDisplay = () => {
    if (selectedTags.length > 0) {
      // 리코일에 선택된 태그가 있는 경우
      return selectedTags.map((tag, index) => (
        <span
          key={index}
          className="cursor-pointer whitespace-nowrap py-1 px-2 rounded-xl text-xs font-semibold bg-blue-500 text-white"
        >
          {tag}
        </span>
      ));
    }
    // 선택된 태그가 없는 경우 모든 태그 표시
    return allTag.map((tagName, index) => {
      const isSelected = selectedTag.includes(tagName); // 선택 여부 확인
      return (
        <span
          onClick={() => handleTagClick(tagName)}
          key={index}
          className={`cursor-pointer whitespace-nowrap hover:scale-105 transition py-1 px-2 rounded-xl text-xs font-semibold border-none ${
            isSelected ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
          }`}
        >
          {tagName}
        </span>
      );
    });
  };

  /**
   * 초기 선택된 태그를 Recoil 아톰에서 가져와 설정
   */
  useEffect(() => {
    if (selectedTags.length > 0) {
      setSelectedTag(selectedTags);
      // setSelectedTags([]); // 선택된 태그 아톰 초기화 (원하는 경우)
    }
  }, [selectedTags, setSelectedTag, setSelectedTags]);

  /**
   * 태그 변경 시 필터링 실행
   */
  useEffect(() => {
    if (selectedTag.length === 0) {
      // Recoil에 선택된 문제가 있다면 해당 문제들만 필터링
      if (selectedQuestions.length > 0) {
        setFilterQuestions([...selectedQuestions]);
      } else {
        setFilterQuestions([...allQuestions]);
      }
      return;
    }

    const filtered = allQuestions.filter((question) =>
      question.tag.some((tag) => selectedTag.includes(tag))
    );

    // Recoil에 선택된 문제가 있다면 해당 문제들만 필터링
    if (selectedQuestions.length > 0) {
      const intersection = filtered.filter(q => selectedQuestions.includes(q));
      setFilterQuestions(intersection);
    } else {
      setFilterQuestions(filtered);
    }
  }, [allQuestions, selectedTag, selectedQuestions]);

  /**
   * "시험" 버튼 클릭 시 Solve로 이동
   */
  const goSolve = () => {

    const questionsToNavigate =
      selectedQuestions.length > 0 ? selectedQuestions : filterQuestions;

    if(questionsToNavigate.length < 0){
      alert("현재 풀이 가능한 문제가 없습니다! 문제를 생성해주세요");
      goQuestion();
      return;
    }
    

    const tagsToNavigate = selectedQuestions.length > 0 ? selectedTags : selectedTag;

    navigate("/solve", {
      state: { questions: questionsToNavigate, tags: tagsToNavigate },
    });

    // 선택된 태그와 문제 초기화
    // setSelectedTags([]);
    // setSelectedQuestions([]);
  };

  /**
   * "카드" 버튼 클릭 시 Card로 이동
   */
  const goCard = () => {
    const tagsToNavigate = selectedQuestions.length > 0 ? selectedTags : selectedTag;
    const questionsToNavigate =
      selectedQuestions.length > 0 ? selectedQuestions : filterQuestions;

      if(questionsToNavigate.length < 0){
        alert("현재 풀이 가능한 문제가 없습니다! 문제를 생성해주세요");
        goQuestion();
        return;
      }
    
      
    navigate("/card", {
      state: {
        questions: questionsToNavigate,
        tags: tagsToNavigate,
      },
    });

    // 선택된 태그와 문제 초기화
    // setSelectedTags([]);
    // setSelectedQuestions([]);
  };

  
  const goQuestion = () => {
    navigate("/questions");
  };

  return (
    <main className="bg-gray-50 ml-20 flex items-center h-screen justify-center">
      <div className="bg-white shadow flex m-10 p-10 items-center justify-center flex-col gap-5 rounded-xl">
        <div className="text-lg font-bold">문제집 선택</div>
  
        {allQuestions.length > 0 ? (
          <>
            <div className="flex gap-3 flex-wrap">{tagItemsToDisplay()}</div>
            <div className="text-sm font-bold text-gray-500">
              총 {selectedQuestions.length > 0 ? selectedQuestions.length : filterQuestions.length} 문제
            </div>
            <div className="flex gap-5">
              <div
                onClick={goSolve}
                className="bg-blue-500 rounded-xl text-white font-semibold text-xs w-20 py-3 text-center hover:scale-105 transition cursor-pointer"
              >
                시험
              </div>
              <div
                onClick={goCard}
                className="bg-blue-500 rounded-xl text-white font-semibold text-xs w-20 py-3 text-center hover:scale-105 transition cursor-pointer"
              >
                카드
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="">현재 풀이 가능한 문제가 없습니다</div>
            <div className="flex">
              <div
                onClick={goQuestion}
                className="bg-blue-500 whitespace-nowrap rounded-xl w-30 text-white font-semibold text-xs py-3 px-3 text-center hover:scale-105 transition cursor-pointer"
              >
                문제 생성하러 가기
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
  
}

export default SelectSolve;
