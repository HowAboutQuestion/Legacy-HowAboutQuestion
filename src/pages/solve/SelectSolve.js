import React, { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  questionsAtom,
  allTagAtom,
  selectedTagsAtom,
  selectedQuestionsAtom,
} from "state/data";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SelectSolve() {
  // Recoil에서 모든 문제와 태그 가져오기
  const allQuestions = useRecoilValue(questionsAtom);
  const allTag = useRecoilValue(allTagAtom);
  const [tagGroups, setTagGroups] = useState({});

  useEffect(() => {
    setTagGroups(groupTagsByCategory(allTag));
  }, [allTag]);

  const location = useLocation();
  const {
    selectedTags: initialSelectedTags = [],
    selectedQuestions: initialSelectedQuestions = [],
  } = location.state || {};

  const [selectedTags, setSelectedTags] = useState(initialSelectedTags);
  const [selectedQuestions, setSelectedQuestions] = useState(
    initialSelectedQuestions
  );

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
    setSelectedTag(
      (prev) =>
        prev.includes(tagName)
          ? prev.filter((tag) => tag !== tagName) // 이미 선택된 경우 제거
          : [...prev, tagName] // 새로 선택된 경우 추가
    );
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
      const intersection = filtered.filter((q) =>
        selectedQuestions.includes(q)
      );
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
    let questionsToNavigate =
      selectedQuestions.length > 0 ? selectedQuestions : filterQuestions;
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
      toast.error("현재 풀이 가능한 문제가 없습니다! 문제를 생성해주세요", {
        toastId: "no-question-error",
      });
      goToQuestions();
      return;
    }
    const tagsToNavigate =
      selectedQuestions.length > 0 ? selectedTags : selectedTag;
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
    const tagsToNavigate =
      selectedQuestions.length > 0 ? selectedTags : selectedTag;
    const questionsToNavigate = prepareQuestions();
    if (questionsToNavigate.length < 0) {
      toast.error("현재 풀이 가능한 문제가 없습니다! 문제를 생성해주세요", {
        toastId: "no-question-error2",
      });
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

  /**
   * 태그를 사전순으로 그룹화하는 함수
   */
  const groupTagsByCategory = (tags) => {
    const categories = {};

    tags.forEach((tag) => {
      let firstChar = tag.charAt(0).toLowerCase();

      if (/[a-z]/.test(firstChar)) {
        // 영문 태그 그룹화
        categories[firstChar] = categories[firstChar] || [];
        categories[firstChar].push(tag);
      } else if (/[ㄱ-ㅎ가-힣]/.test(firstChar)) {
        // 한글 초성 추출
        const initialSound = getKoreanInitialSound(firstChar);
        categories[initialSound] = categories[initialSound] || [];
        categories[initialSound].push(tag);
      } else {
        // 숫자나 기타 특수문자는 etc 그룹
        categories["etc"] = categories["etc"] || [];
        categories["etc"].push(tag);
      }
    });

    // 각 그룹을 사전순 정렬
    Object.keys(categories).forEach((key) => {
      categories[key].sort();
    });

    return categories;
  };

  /**
   * 한글 초성을 반환하는 함수
   */
  const getKoreanInitialSound = (char) => {
    const initialConsonants = [
      "ㄱ",
      "ㄲ",
      "ㄴ",
      "ㄷ",
      "ㄸ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅃ",
      "ㅅ",
      "ㅆ",
      "ㅇ",
      "ㅈ",
      "ㅉ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ];

    const charCode = char.charCodeAt(0) - 44032;
    if (charCode >= 0 && charCode <= 11171) {
      return initialConsonants[Math.floor(charCode / 588)];
    }
    return char;
  };

  return (
    <main className="bg-gray-50 ml-20 items-center h-screen justify-center">
      {/* 헤더 */}
      <div className="p-4 flex justify-between border-b bg-white sticky top-0 z-10">
        {/* 좌측 */}
        <div>
          <div className="text-2xl font-semibold">문제집 선택</div>
          <h1 className="text-md font-normal text-gray-400">
            총 {filterQuestions.length}문제
          </h1>
        </div>

        {/* 우측 */}
        <div className="text-right items-center flex gap-2">
          {/* 옵션 버튼 */}
          <div className="flex items-center mr-3">
            {/* 타이머 토글 */}
            <span className="text-xs font-semibold mr-4">타이머</span>
            <div
              className={`relative w-12 h-6 flex items-center rounded-full transition-all cursor-pointer ${
                timerOn ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setTimerOn((prev) => !prev)}
            >
              <div
                className={`absolute w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                  timerOn ? "translate-x-7" : "translate-x-1"
                }`}
              ></div>
            </div>

            {/* 타이머 입력 필드 */}
            <div
              className={`ml-4 flex gap-1 overflow-hidden transition-all duration-500 ${
                timerOn ? "max-w-[100px] opacity-100 mr-4" : "max-w-0 opacity-0"
              }`}
            >
              <input
                type="number"
                min="0"
                className="w-10 text-center border rounded text-sm bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(e.target.value)}
                placeholder="분"
              />
              <span className="transition-opacity duration-300">:</span>
              <input
                type="number"
                min="0"
                max="59"
                className="w-10 text-center border rounded text-sm bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none"
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(e.target.value)}
                placeholder="초"
              />
            </div>

            {/* 선택지 셔플 토글 */}
            <span className="text-xs font-semibold mr-4 ">선택지 셔플</span>
            <div
              className={`relative w-12 h-6 flex items-center rounded-full transition-all cursor-pointer ${
                choiceShuffleOption ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setChoiceShuffleOption((prev) => !prev)}
            >
              <div
                className={`absolute w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                  choiceShuffleOption ? "translate-x-7" : "translate-x-1"
                }`}
              ></div>
            </div>

            {/* 문제 셔플 토글 */}
            <span className="text-xs font-semibold mx-4 ">문제 셔플</span>
            <div
              className={`relative w-12 h-6 flex items-center rounded-full transition-all cursor-pointer ${
                questionShuffleOption ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setQuestionShuffleOption((prev) => !prev)}
            >
              <div
                className={`absolute w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                  questionShuffleOption ? "translate-x-7" : "translate-x-1"
                }`}
              ></div>
            </div>
          </div>

          <div
            onClick={goCard}
            className={`cursor-pointer bg-blue-500 hover:scale-105 text-white font-semibold rounded-2xl text-xs h-8 w-20 inline-flex items-center justify-center me-2 mb-2 transition`}
          >
            카드
          </div>

          <div
            onClick={goSolve}
            className={`cursor-pointer bg-blue-500 hover:scale-105 text-white font-semibold rounded-2xl text-xs h-8 w-20 inline-flex items-center justify-center me-2 mb-2 transition`}
          >
            시험
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center  items-center bg-gray-50">
        {allQuestions.length > 0 ? (
          <div className="flex flex-col gap-3 p-10 items-center justify-center rounded-xl w-full max-w-[960px]">
            <div className="space-y-4 w-full">
              {Object.keys(tagGroups)
                .sort()
                .map((category) => (
                  <div
                    key={category}
                    className="rounded-xl bg-white shadow p-5"
                  >
                    <h3 className="text-md font-semibold mb-2">
                      {category.toUpperCase()}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tagGroups[category].map((tag, index) => (
                        <span
                          key={index}
                          onClick={() => handleTagClick(tag)}
                          className={`px-3 py-1 rounded-full font-semibold cursor-pointer whitespace-nowrap hover:scale-105 text-xs ${
                            selectedTag.includes(tag)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow m-10 p-10  items-center justify-center flex-col gap-5 rounded-xl min-w-[500px]">
            <div className="w-full h-40 mx-auto mb-4 relative">
              <img
                src="./images/no-problems.png"
                alt="No recommended problems"
                className="object-contain w-full h-full"
              />
            </div>
            <div className="text-center">현재 풀이 가능한 문제가 없습니다</div>
            <div className="flex justify-center mt-5">
              <div
                onClick={goToQuestions}
                className="bg-blue-500 whitespace-nowrap rounded-xl w-30 text-white font-semibold text- py-3 px-3 text-center hover:scale-105 transition cursor-pointer"
              >
                문제 생성
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default SelectSolve;
