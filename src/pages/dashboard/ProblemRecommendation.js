
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProblemRecommendation = ({
  totalRecommendToday,
  toSolveCount,
  solvedCount,
  selectedProblemCount,
  setSelectedProblemCount,
  problemsToSolveToday,
  handleSolveProblems,
  goToQuestions,
}) => {
  const navigate = useNavigate();

  return (
    <section className="p-8 bg-white rounded">
      <h2 className="text-2xl font-bold mb-6">문제 추천</h2>
      <div className="flex flex-col items-center bg-neutral-50 p-6 rounded-lg">
        {/* 오늘의 추천 문제 */}
        <div className="w-full text-center mb-4">
          {/* 추천 문제가 없는 경우 */}
          {totalRecommendToday === 0 ? (
            <>
              {/* 문제 없음 이미지 표시 */}
              <div className="w-full h-40 mx-auto mb-4 relative">
                <img
                  src="/images/no-problems.png"
                  alt="No recommended problems"
                  className="object-contain w-full h-full"
                />
              </div>
              <p className="text-2xl font-bold mt-2">문제가 없어요 문제를 생성하러 가볼까요?</p>
            </>
          ) : (
            <>
              {/* 추천 문제가 있는 경우 */}
              <p className="text-2xl font-bold">오늘의 추천 문제</p>
              
              {/* 문제 수 선택 UI 추가 */}
              <div className="mt-4 flex items-center justify-center">
                <label htmlFor="problemCount" className="mr-2 text-lg font-bold">풀어야 할 문제 수:</label>
                <select
                  id="problemCount"
                  value={selectedProblemCount}
                  onChange={(e) => setSelectedProblemCount(Number(e.target.value))}
                  className="border border-gray-300 rounded p-2"
                >
                  {Array.from({ length: problemsToSolveToday }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <p className="mr-2 text-lg font-bold">문제 </p>
                <p className="text-2xl font-bold">
                  / 총 {toSolveCount + solvedCount}문제
                </p>
              </div>
            </>
          )}
        </div>

        <div>
          {/* 추천 문제가 없는 경우: 문제 생성 버튼 표시 */}
          {totalRecommendToday === 0 ? (
            <button
              onClick={goToQuestions}
              className="w-[300px] h-10 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition"
            >
              문제 생성
            </button>
          ) : (
            /* 추천 문제가 있고, 아직 풀어야 할 문제가 있는 경우에만 문제풀기 버튼 표시 */
            problemsToSolveToday !== 0 && (
              <button
                className="w-[300px] h-10 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition"
                onClick={handleSolveProblems}
              >
                문제풀기
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ProblemRecommendation;
