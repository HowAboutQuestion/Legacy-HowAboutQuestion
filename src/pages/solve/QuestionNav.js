import React, { useState } from 'react';

function QuestionNav({ questions, setQuestionIndex }) {
  const itemsPerPage = 25; // 한 페이지당 25개의 문제
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호

  // 총 페이지 수 계산
  const totalPages = Math.ceil(questions.length / itemsPerPage);

  // 현재 페이지에 표시될 문제 계산
  const currentQuestions = questions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // 페이지 이동 핸들러
  const goToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
    }
  };

  return (
    <div 
    onClick={(e) => e.stopPropagation()}
    className="flex flex-col items-center cursor-pointer">
      {/* 문제 목록 그리드 */}
      <div className="grid grid-cols-5 grid-rows-5 gap-1 mb-3">
        {currentQuestions.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setQuestionIndex(currentPage * itemsPerPage + idx)} // 인덱스 계산
            className="cursor-pointer bg-blue-50 hover:bg-blue-100 rounded-full text-xs text-gray-500 cursor-pointer flex items-center justify-center h-5 w-5"
          >
            {currentPage * itemsPerPage + idx + 1}
          </div>
        ))}
      </div>

      {/* 페이지 이동 네비게이션 */}
      <div className="text-xs flex gap-3 items-center h-5">
        <div
          onClick={() => goToPage(currentPage - 1)}
          className={`cursor-pointer ${
            currentPage === 0 ? 'text-gray-300' : 'text-blue-500'
          }`}
        >
          이전
        </div>
        <div>
          {currentPage + 1} / {totalPages}
        </div>
        <div
          onClick={() => goToPage(currentPage + 1)}
          className={`cursor-pointer ${
            currentPage === totalPages - 1 ? 'text-gray-300' : 'text-blue-500'
          }`}
        >
          다음
        </div>
      </div>
    </div>
  );
}

export default QuestionNav;
