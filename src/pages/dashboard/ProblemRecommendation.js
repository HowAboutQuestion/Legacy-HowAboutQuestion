import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// SVG 아이콘을 직접 사용할 수도 있고, Heroicons와 같은 라이브러리를 사용할 수도 있습니다.
// 여기서는 SVG 경로를 직접 삽입하였습니다.

const ProblemRecommendation = ({
  totalRecommendToday,
  toSolveCount,
  solvedCount,
  selectedProblemCount,
  setSelectedProblemCount,
  problemsToSolveToday,
  goToQuestions,
}) => {
  const navigate = useNavigate();

  /**
   * 배열을 랜덤으로 섞는 헬퍼 함수
   * Fisher-Yates (Knuth) 셔플 알고리즘 사용
   */
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  /**
   * "문제풀기" 버튼 클릭 핸들러
   * 원하는 수만큼의 문제를 랜덤으로 선택하고 Solve로 이동
   */
  const handleSolveClick = () => {
    let count = Number(selectedProblemCount);

    // 입력 값이 비어 있거나 유효하지 않은 경우 최소값으로 설정
    if (isNaN(count) || count < 1) {
      alert('문제 수는 최소 1 이상이어야 합니다.');
      setSelectedProblemCount(1);
      count = 1;
    }

    // 입력 값이 최대값을 초과하는 경우 최대값으로 설정
    if (count > problemsToSolveToday.length) {
      alert(`문제 수는 최대 ${problemsToSolveToday.length} 이하이어야 합니다.`);
      setSelectedProblemCount(problemsToSolveToday.length);
      count = problemsToSolveToday.length;
    }

    const shuffledProblems = shuffleArray(problemsToSolveToday);
    const selectedProblems = shuffledProblems.slice(0, count);

    // Solve 컴포넌트로 선택된 문제 전달
    navigate('/solve', {
      state: {
        questions: selectedProblems,
        tags: Array.from(new Set(selectedProblems.map((q) => q.tag).flat())), // 선택된 문제들의 태그 수집 및 중복 제거
      },
    });
  };

  /**
   * 문제 수를 증가시키는 함수
   */
  const incrementProblemCount = () => {
    setSelectedProblemCount((prev) =>
      prev < problemsToSolveToday.length ? prev + 1 : prev
    );
  };

  /**
   * 문제 수를 감소시키는 함수
   */
  const decrementProblemCount = () => {
    setSelectedProblemCount((prev) => (prev > 1 ? prev - 1 : prev));
  };

  /**
   * 문제 수를 직접 입력할 때의 핸들러
   */
  const handleInputChange = (e) => {
    const value = e.target.value;

    // 빈 입력을 허용
    if (value === '') {
      setSelectedProblemCount('');
      return;
    }

    const num = Number(value);

    // 숫자가 아닌 경우 무시
    if (isNaN(num)) return;

    // 최소값과 최대값을 벗어나지 않도록 조정
    if (num < 1) {
      setSelectedProblemCount(1);
    } else if (num > problemsToSolveToday.length) {
      setSelectedProblemCount(problemsToSolveToday.length);
    } else {
      setSelectedProblemCount(num);
    }
  };

  // 타이머 ID를 저장할 refs 생성
  const incrementTimeoutRef = useRef(null);
  const incrementIntervalRef = useRef(null);
  const decrementTimeoutRef = useRef(null);
  const decrementIntervalRef = useRef(null);

  // 지속적인 증가를 처리하는 함수
  const handleIncrementMouseDown = () => {
    incrementProblemCount(); // 즉시 증가

    // 이미 타이머가 실행 중인 경우 중단
    if (incrementTimeoutRef.current || incrementIntervalRef.current) return;

    // 200ms 후에 50ms 간격으로 증가 시작
    incrementTimeoutRef.current = setTimeout(() => {
      incrementIntervalRef.current = setInterval(() => {
        incrementProblemCount();
      }, 50); // 50ms 간격
      incrementTimeoutRef.current = null; // 타임아웃 완료
    }, 200); // 초기 지연 시간 200ms
  };

  // 지속적인 감소를 처리하는 함수
  const handleDecrementMouseDown = () => {
    decrementProblemCount(); // 즉시 감소

    // 이미 타이머가 실행 중인 경우 중단
    if (decrementTimeoutRef.current || decrementIntervalRef.current) return;

    // 200ms 후에 50ms 간격으로 감소 시작
    decrementTimeoutRef.current = setTimeout(() => {
      decrementIntervalRef.current = setInterval(() => {
        decrementProblemCount();
      }, 50); // 50ms 간격
      decrementTimeoutRef.current = null; // 타임아웃 완료
    }, 200); // 초기 지연 시간 200ms
  };

  // 타이머를 정리하는 함수
  const handleMouseUp = () => {
    // 증가 관련 타이머 정리
    if (incrementTimeoutRef.current) {
      clearTimeout(incrementTimeoutRef.current);
      incrementTimeoutRef.current = null;
    }
    if (incrementIntervalRef.current) {
      clearInterval(incrementIntervalRef.current);
      incrementIntervalRef.current = null;
    }

    // 감소 관련 타이머 정리
    if (decrementTimeoutRef.current) {
      clearTimeout(decrementTimeoutRef.current);
      decrementTimeoutRef.current = null;
    }
    if (decrementIntervalRef.current) {
      clearInterval(decrementIntervalRef.current);
      decrementIntervalRef.current = null;
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      // 증가 관련 타이머 정리
      if (incrementTimeoutRef.current) {
        clearTimeout(incrementTimeoutRef.current);
      }
      if (incrementIntervalRef.current) {
        clearInterval(incrementIntervalRef.current);
      }

      // 감소 관련 타이머 정리
      if (decrementTimeoutRef.current) {
        clearTimeout(decrementTimeoutRef.current);
      }
      if (decrementIntervalRef.current) {
        clearInterval(decrementIntervalRef.current);
      }
    };
  }, []);

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
              <p className="text-2xl font-bold mt-2">
                문제가 없어요 문제를 생성하러 가볼까요?
              </p>
            </>
          ) : (
            <>
              {/* 추천 문제가 있는 경우 */}
              <p className="text-2xl font-bold">오늘의 추천 문제</p>

              {/* 문제 수 선택 UI 추가 */}
              <div className="mt-4 flex items-center justify-center space-x-2">
                <label htmlFor="problemCount" className="mr-2 text-lg font-bold">
                  풀어야 할 문제 수:
                </label>

                <div className="flex items-center bg-neutral-50">
                  {/* 감소 버튼 */}
                  <button
                    onMouseDown={handleDecrementMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleDecrementMouseDown}
                    onTouchEnd={handleMouseUp}
                    className="rounded-full p-2 text-white bg-blue-500 hover:scale-105 shadow cursor-pointer focus:outline-none transition"
                    aria-label="문제 수 감소"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* 숫자 입력 필드 */}
                  <input
                    type="number"
                    id="problemCount"
                    value={selectedProblemCount}
                    onChange={handleInputChange}
                    min="1"
                    max={problemsToSolveToday.length}
                    className="w-16 text-center border-none focus:outline-none bg-neutral-50 no-spin-button"
                  />

                  {/* 증가 버튼 */}
                  <button
                    onMouseDown={handleIncrementMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleIncrementMouseDown}
                    onTouchEnd={handleMouseUp}
                    className="rounded-full p-2 text-white bg-blue-500 hover:scale-105 shadow cursor-pointer focus:outline-none transition"
                    aria-label="문제 수 증가"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <p className="mr-2 text-lg font-bold">문제 </p>
                <p className="text-2xl font-bold">/ 총 {toSolveCount + solvedCount}문제</p>
              </div>
            </>
          )}
        </div>

        <div>
          {/* 추천 문제가 없는 경우: 문제 생성 버튼 표시 */}
          {totalRecommendToday === 0 ? (
            <button
              onClick={goToQuestions}
              className="w-[300px] h-10 bg-blue-500 rounded-lg text-white font-bold hover:scale-105 transition"
            >
              문제 생성
            </button>
          ) : (
            /* 추천 문제가 있고, 아직 풀어야 할 문제가 있는 경우에만 문제풀기 버튼 표시 */
            problemsToSolveToday.length !== 0 && (
              <button
                className="w-[300px] h-10 bg-blue-500 rounded-lg text-white font-bold hover:scale-105 transition"
                onClick={handleSolveClick} // 새로운 핸들러 사용
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
