import React, { useState, useEffect } from 'react';
import { questionsAtom, allTagAtom } from 'state/data';
import { useRecoilValue } from "recoil";
import { useNavigate } from 'react-router-dom';

function SelectSolve() {
  // Recoil에서 모든 문제와 태그 가져오기
  const questions = useRecoilValue(questionsAtom);
  const allTag = useRecoilValue(allTagAtom);
  const [filterQuestions, setFilterQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]); // 선택된 태그 상태

  const navigate = useNavigate();

  // "시험" 버튼 클릭 시 Solve로 이동
  const goSolve = () => {
    navigate("/solve", { state: { "questions": filterQuestions, "tags": selectedTag } });
  };

  // "카드" 버튼 클릭 시 Card로 이동
  const goCard = () => {
    let tags = [...selectedTag];
    if (tags.length === 0) tags = [...allTag];

    navigate("/card", {
      state: {
        "questions": filterQuestions,
        "tags": tags
      }
    });
  };

  // 태그 선택/해제 핸들러
  const handleTagClick = (tagName) => {
    setSelectedTag((prev) =>
      prev.includes(tagName)
        ? prev.filter((tag) => tag !== tagName) // 이미 선택된 태그 제거
        : [...prev, tagName] // 새로운 태그 추가
    );
  };

  // 모든 태그 아이템 생성
  const allTagItems = allTag.map((tagName, index) => {
    const isSelected = selectedTag.includes(tagName); // 선택 여부 확인
    return (
      <span
        onClick={() => handleTagClick(tagName)}
        key={index}
        className={`cursor-pointer whitespace-nowrap py-1 px-2 rounded-xl text-xs font-semibold border-none ${
          isSelected ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {tagName}
      </span>
    );
  });

  // 태그 변경 시 필터링 실행
  useEffect(() => {
    if (selectedTag.length === 0) {
      setFilterQuestions([...questions]);
      return;
    }

    const filtered = questions.filter((question) =>
      question.tag.some((tag) => selectedTag.includes(tag))
    );
    setFilterQuestions(filtered);
  }, [questions, selectedTag]); // `selectedTag`와 `questions` 변경 시 실행

  return (
    <main className="bg-gray-50 ml-20 flex items-center h-screen justify-center">
      <div className='bg-white shadow flex m-10 p-10 items-center justify-center flex-col gap-5 rounded-xl'>
        <div className='text-lg font-bold'>문제집 선택</div>
        <div className='flex gap-3 flex-wrap'>{allTagItems}</div>
        <div className='text-sm font-bold text-gray-500'> 총 {filterQuestions.length} 문제</div>
        <div className='flex gap-5'>
          <div
            onClick={goSolve}
            className='bg-blue-500 rounded-xl text-white font-semibold text-xs w-20 py-3 text-center hover:scale-105 cursor-pointer'
          >
            시험
          </div>
          <div
            onClick={goCard}
            className='bg-blue-500 rounded-xl text-white font-semibold text-xs w-20 py-3 text-center hover:scale-105 cursor-pointer'
          >
            카드
          </div>
        </div>
      </div>
    </main>
  );
}

export default SelectSolve;
