import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { isSameDay, isBefore, addDays } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import "chartjs-adapter-date-fns"; 
import { historyDataAtom, questionsAtom } from "state/data.js";
import Loading from "./Loading.js";
import ProblemRecommendation from "./ProblemRecommendation.js";
import DashboardStats from "./DashboardStats.js";
import HistorySection from "./HistorySection.js";
import { getTodayDate, formatDate } from "utils/dateUtils.js";
import LargeModal from "./LargeModal.js";
import Helper from "./Helper.js";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 오늘 날짜 상수
  const today = useMemo(() => new Date(getTodayDate()), []);

  // Recoil 상태 사용
  const [historyData, setHistoryData] = useRecoilState(historyDataAtom);
  const questions = useRecoilValue(questionsAtom);
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);

  // 풀어야 할 문제 수와 푼 문제 수 상태 관리
  const [toSolveCount, setToSolveCount] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);

  // 로딩 상태 관리
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // UI 상태 관리
  const [historyView, setHistoryView] = useState("list");
  const [selectedProblemCount, setSelectedProblemCount] = useState(1);

  // 히스토리 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const historyResult = await window.electronAPI.readHistoryCSV();
        if (historyResult.success) {
          setHistoryData(historyResult.historyData);
        } else {
          console.error("히스토리 데이터를 불러오는 중 오류 발생:", historyResult.message);
        }
      } catch (error) {
        console.error("히스토리 데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadData();
  }, []);

  // 추천 문제 필터링 및 오늘 푼 문제 수 계산
  useEffect(() => {
    let solved = 0; // 오늘 푼 문제 카운트
    const filtered = questions.map((question) => {
        const recommendDate = question.recommenddate;
        const solvedDate = question.solveddate ? question.solveddate : null;
        const isRecommendToday = isSameDay(recommendDate, today);
        const isNotSolvedToday = !solvedDate || !isSameDay(solvedDate, today);
        const updateDate = question.update;
        const isUpdateBeforeToday = isBefore(updateDate, today);

        if (solvedDate && isSameDay(solvedDate, today)) {
          solved += 1;
        }
        if ((isRecommendToday && isNotSolvedToday) || isUpdateBeforeToday) {
          return question;
        }
      })
      .filter((item) => item);

    setRecommendedQuestions(filtered);
    setSolvedCount(solved);
    console.log("Filtered Questions:", filtered);
    console.log("Solved Count:", solved);
  }, [questions, today]);

  // 오늘 풀어야 할 문제들 리스트 정의
  const [todayProblemsToSolve, setTodayProblemsToSolve] = useState([]);
  useEffect(() => {
    const filtered = recommendedQuestions
      .map((question) => {
        const recommendDate = question.recommenddate;
        const solvedDate = question.solveddate ? question.solveddate : null;
        const isRecommendToday = isSameDay(recommendDate, today);
        const isNotSolvedToday = !solvedDate || !isSameDay(solvedDate, today);

        if (isRecommendToday && isNotSolvedToday) return question;
      })
      .filter((item) => item);

    setTodayProblemsToSolve(filtered);
    setToSolveCount(filtered.length);
    console.log("todayProblemsToSolve:", filtered);
  }, [recommendedQuestions, today, questions]);

  // 차트 데이터 상태 관리: 최근 30개의 기록만 표시
  const chartData = useMemo(() => {
    if (historyData.length === 0) return { labels: [], datasets: [] };

    // 날짜 오름차순 정렬
    const sortedHistory = [...historyData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // 최근 30개의 기록만 선택 (배열의 마지막 30개)
    const recentHistory = sortedHistory.slice(-30);
    const labels = recentHistory.map((entry) => formatDate(entry.date));
    const correctRates = recentHistory.map((entry) => entry.correctRate);

    return {
      labels,
      datasets: [
        {
          label: "정답률",
          data: correctRates,
          fill: false,
          borderColor: "#34D399", // Tailwind의 녹색 계열 색상
          tension: 0.1,
        },
      ],
    };
  }, [historyData]);

  // 오늘 데이터 계산
  const sortedHistory = useMemo(() => [...historyData].sort((a, b) => b.date - a.date), [historyData]);
  const todayEntry = useMemo(() => sortedHistory.find(entry => isSameDay(entry.date, today)), [sortedHistory, today]);

  const todaySolved = todayEntry ? todayEntry.solvedCount : 0;
  const todayCorrect = todayEntry ? todayEntry.correctCount : 0;
  const todayCorrectRate = todayEntry
    ? todayEntry.solvedCount > 0
      ? Math.round((todayEntry.correctCount / todayEntry.solvedCount) * 100)
      : 0
    : 0;

  // 어제 데이터 계산 
  const yesterday = useMemo(() => addDays(today, -1), [today]);
  const yesterdayEntry = useMemo(() => sortedHistory.find(entry => isSameDay(entry.date, yesterday)), [sortedHistory, yesterday]);

  const rateChange = useMemo(() => {
    if (todayEntry && yesterdayEntry) {
      const yesterdayRate = yesterdayEntry.solvedCount > 0
        ? Math.round((yesterdayEntry.correctCount / yesterdayEntry.solvedCount) * 100)
        : 0;
      return todayCorrectRate - yesterdayRate;
    }
    return 0;
  }, [todayEntry, yesterdayEntry, todayCorrectRate]);

  // 총 추천 문제 수, 총 문제 수, 완료 퍼센트 계산
  const totalRecommendToday = useMemo(() => toSolveCount + solvedCount, [toSolveCount, solvedCount]);
  console.log("toSolveCount:", toSolveCount, "solvedCount:", solvedCount);

  const totalProblems = useMemo(() => totalRecommendToday, [totalRecommendToday]);
  const completedProblems = useMemo(() => solvedCount, [solvedCount]);
  const completionRate = useMemo(() => totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0, [totalProblems, completedProblems]);

  // 달력의 날짜 칸에 표시 추가
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const hasData = historyData.some((entry) => isSameDay(entry.date, date));
      return (
        <div className="dot-container mt-1 flex justify-center">
          <span
            className={`inline-block w-2 h-2 rounded-full ${hasData ? "bg-green-500" : "bg-transparent"}`}
          ></span>
        </div>
      );
    }
    return null;
  };

  // 문제 생성 페이지로 이동
  const goToQuestionsPage = () => {
    navigate("/questions", { state: { openModal: true } });
  };

  // 문제풀기 버튼 클릭 핸들러
  const handleSolveProblems = () => {
    console.log(`풀 문제 수: ${selectedProblemCount}`);
    // 문제풀기 로직 또는 navigate 호출
  };

  if (loadingHistory || loadingRecommendations) {
    return <Loading />;
  }

  const hasQuestions = questions.length > 0;

  return (
    <main className="ml-20 p-5 flex flex-col gap-4 flex-1">
      <div>
        <div
          className="cursor-pointer absolute right-10 top-5 w-10 h-10 flex items-center justify-center text-gray-400"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>
        </div>
        {isModalOpen && (
          <LargeModal>
            <Helper closeHelper={() => setIsModalOpen(false)} />
          </LargeModal>
        )}
      </div>

      <ProblemRecommendation
        hasQuestions={hasQuestions}
        totalRecommendToday={todayProblemsToSolve.length}
        toSolveCount={todayProblemsToSolve.length}
        solvedCount={solvedCount}
        selectedProblemCount={selectedProblemCount}
        setSelectedProblemCount={setSelectedProblemCount}
        problemsToSolveToday={todayProblemsToSolve}
        goToQuestions={goToQuestionsPage}
      />

      <DashboardStats
        todaySolved={todaySolved}
        todayCorrect={todayCorrect}
        completionRate={completionRate}
        todayCorrectRate={todayCorrectRate}
        rateChange={rateChange}
        chartData={chartData}
      />

      <HistorySection
        historyView={historyView}
        setHistoryView={setHistoryView}
        sortedHistory={sortedHistory}
        today={today}
        tileContent={tileContent}
      />
    </main>
  );
};

export default Dashboard;
