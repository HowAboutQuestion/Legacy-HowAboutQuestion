import React, { useState } from "react";

function Single({ question, index, onAnswerChange }) {
  const [answer, setAnswer] = useState(question.selected);

  const handleAnswerChange = (e) => {
    const selectedAnswer = e.target.value;
    setAnswer(selectedAnswer); // 로컬 상태 업데이트
    onAnswerChange(index, selectedAnswer.trim()); // 부모 컴포넌트에 전달
  };

  return (
    <div className="flex flex-col gap-8 p-10 items-center">
      <div className="text-xl font-bold">
        <span>{index + 1}.</span>
        <span>{question.title}</span>
      </div>
      {question.img && (
        <div>
          <img
            className="bg-gray-50 max-w-max w-96 h-auto"
            src={question.img}
            alt=""
          />
        </div>
      )}

      <input
        value={answer} // 현재 로컬 상태 값을 입력란에 표시
        onChange={handleAnswerChange} // 값 변경 핸들러
        type="text"
        className="box border rounded-lg p-3 pr-10 w-3/4 min-w-96 max-w-98 w-400"
        placeholder="답변을 입력하세요"
      />
    </div>
  );
}

export default Single;
