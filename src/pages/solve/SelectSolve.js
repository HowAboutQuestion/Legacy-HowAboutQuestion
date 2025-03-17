import React, { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { questionsAtom, allTagAtom, selectedTagsAtom, selectedQuestionsAtom } from "state/data";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  const [showSettings, setShowSettings] = useState(false);

  // =====================Timer=================================
  const [timerOn, setTimerOn] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState("");
  const [timerSeconds, setTimerSeconds] = useState("");
  // ===========================================================


  // =====================shuffle===============================
  const [choiceShuffleOption, setChoiceShuffleOption] = useState(false);
  const [questionShuffleOption, setQuestionShuffleOption] = useState(false);
  // ===========================================================

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
          className={`cursor-pointer whitespace-nowrap hover:scale-105 transition py-1 px-2 rounded-xl text-xs font-semibold border-none ${isSelected ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
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

  // =====================Fisher-Yates shuffle=============================
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  // ======================================================================


  // 시험/카드 클릭 시, 옵션에 따라 셔플 적용한 질문 배열 준비
  const prepareQuestions = () => {
    let questionsToNavigate = selectedQuestions.length > 0 ? selectedQuestions : filterQuestions;
    if (questionShuffleOption) {
      questionsToNavigate = shuffleArray(questionsToNavigate);
    }
    if (choiceShuffleOption) {
      questionsToNavigate = questionsToNavigate.map((question) => {
        if (question.type === "주관식") return question;
        const options = [];
        if (question.select1) options.push(question.select1);
        if (question.select2) options.push(question.select2);
        if (question.select3) options.push(question.select3);
        if (question.select4) options.push(question.select4);
        const shuffledOptions = shuffleArray(options);
        return {
          ...question,
          select1: shuffledOptions[0] || "",
          select2: shuffledOptions[1] || "",
          select3: shuffledOptions[2] || "",
          select4: shuffledOptions[3] || "",
        };
      });
    }
    return questionsToNavigate;
  };


  // "시험" 버튼 클릭 시 Solve로 이동 
  const goSolve = () => {
    const questionsToNavigate = prepareQuestions();
    if (questionsToNavigate.length < 0) {
      toast.error("현재 풀이 가능한 문제가 없습니다! 문제를 생성해주세요", { toastId: "no-question-error" });
      goToQuestions();
      return;
    }
    const tagsToNavigate = selectedQuestions.length > 0 ? selectedTags : selectedTag;
    navigate("/solve", {
      state: {
        questions: questionsToNavigate,
        tags: tagsToNavigate,
        timerMinutes: timerOn ? timerMinutes : "00",
        timerSeconds: timerOn ? timerSeconds : "00",
      },
    });
  };

  // "카드" 버튼 클릭 시 Card로 이동
  const goCard = () => {
    const tagsToNavigate = selectedQuestions.length > 0 ? selectedTags : selectedTag;
    const questionsToNavigate = prepareQuestions();
    if (questionsToNavigate.length < 0) {
      toast.error("현재 풀이 가능한 문제가 없습니다! 문제를 생성해주세요", { toastId: "no-question-error2" });
      goToQuestions();
      return;
    }
    navigate("/card", {
      state: {
        questions: questionsToNavigate,
        tags: tagsToNavigate,
        timerMinutes: timerOn ? timerMinutes : "00",
        timerSeconds: timerOn ? timerSeconds : "00",
      },
    });
  };

  const goToQuestions = () => {
    navigate("/questions", { state: { openModal: true } });
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

            <div className="flex items-center gap-2">

              <button
                className="relative w-[200px] h-[40px] rounded-[20px] cursor-default transition-colors focus:outline-none focus:ring-0 focus:border-blue-500 duration-300 ease bg-[#eceeef]"
                aria-pressed={timerOn}
              >
                {/* 타이머 텍스트: 항상 표시, 상태에 따라 스타일 변경 */}
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none z-20">
                  <span className={`text-sm ${timerOn ? "font-bold text-black" : "font-bold text-gray-500"}`}>
                    타이머
                  </span>
                </div>
                {/* 오른쪽 영역: timerOn일 때 시간 입력 필드 표시 */}
                {timerOn && (
                  <div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        className="w-12 border border-gray-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-0 focus:border-blue-500 pointer-events-auto"
                        value={timerMinutes}
                        onChange={(e) => setTimerMinutes(e.target.value)}
                        placeholder="분"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm font-medium text-gray-800">:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        className="w-12 border border-gray-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-0 focus:border-blue-500 pointer-events-auto"
                        value={timerSeconds}
                        onChange={(e) => setTimerSeconds(e.target.value)}
                        placeholder="초"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}
                {/* 토글 핸들: 이 영역만 클릭 시 on/off 상태 변경 */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setTimerOn((prev) => !prev);
                  }}
                  className={`absolute top-[0px] w-12  h-[40px] rounded-[20px] bg-white shadow transition-all duration-300 ease ${timerOn ? "left-[0px]" : "left-[154px]"
                    } z-10`}
                ></div>
              </button>

              {/* </div> */}

              {/* 타이머 On일 때만 숫자 설정 영역 보이기 */}

              <div
                onClick={() => setChoiceShuffleOption(prev => !prev)}
                className="cursor-pointer py-1 px-3 bg-transparent border-0"
              >
                <span className={choiceShuffleOption ? "text-sm font-bold text-black" : "text-sm font-bold text-gray-500"}>
                  선택지 셔플
                </span>
              </div>

              <div
                onClick={() => setQuestionShuffleOption(prev => !prev)}
                className="cursor-pointer py-1 px-3 bg-transparent border-0 "
              >
                <span className={questionShuffleOption ? "text-sm font-bold text-black" : "text-sm font-bold text-gray-500"}>
                  문제 셔플
                </span>
              </div>
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
            <div className="w-full h-40 mx-auto mb-4 relative">
              <img
                src="./images/no-problems.png"
                alt="No recommended problems"
                className="object-contain w-full h-full"
              />
            </div>
            <div className="">현재 풀이 가능한 문제가 없습니다</div>
            <div className="flex">
              <div
                onClick={goToQuestions}
                className="bg-blue-500 whitespace-nowrap rounded-xl w-30 text-white font-semibold text- py-3 px-3 text-center hover:scale-105 transition cursor-pointer"
              >
                문제 생성
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );

}

export default SelectSolve;
