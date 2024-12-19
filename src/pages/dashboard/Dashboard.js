// src/components/Dashboard/Dashboard.js

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { parseISO, isValid, isSameDay, isBefore, addDays, format } from "date-fns";
import { useRecoilState } from "recoil";
import { historyDataAtom, recommendedQuestionsAtom } from "state/data";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loading from "./Loading";
import ProblemRecommendation from "./ProblemRecommendation";
import DashboardStats from "./DashboardStats";
import HistorySection from "./HistorySection";
import { formatDate } from "utils/formatDate";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * 대시보드 메인 컴포넌트
 * @returns {JSX.Element}
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // Recoil 상태 사용
  const [historyData, setHistoryData] = useRecoilState(historyDataAtom);
  const [recommendedQuestions, setRecommendedQuestions] = useRecoilState(recommendedQuestionsAtom);

  // 로딩 상태 관리
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  // UI 상태 관리
  const [historyView, setHistoryView] = useState('list'); // 'list' 또는 'calendar'
  const [selectedProblemCount, setSelectedProblemCount] = useState(1);

  // 오늘 날짜 상수
  const today = useMemo(() => new Date(), []);

  // 풀어야 할 문제 수와 푼 문제 수 상태 관리
  const [toSolveCount, setToSolveCount] = useState(0); // 풀어야 할 문제 수
  const [solvedCount, setSolvedCount] = useState(0); // 푼 문제 수

  /**
   * 문제 추천 데이터 로드 함수
   */
  const loadRecommendedQuestions = useCallback(async () => {
    try {
      // 캐시 방지를 위해 타임스탬프 추가
      const response = await fetch(`/question.csv?timestamp=${Date.now()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const csvText = await response.text();
      const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;

      let toSolve = 0;   // 풀어야 할 문제 수
      let solved = 0;    // 푼 문제 수

      const recommendations = parsedData
        .map((item) => {
          const updateDate = isValid(parseISO(item.update)) ? parseISO(item.update) : null;
          const recommendDate = isValid(parseISO(item.recommenddate)) ? parseISO(item.recommenddate) : null;
          const solvedDate = isValid(parseISO(item.solveddate)) ? parseISO(item.solveddate) : null;

          if (!recommendDate || !updateDate) {
            // 필수 날짜가 유효하지 않은 경우 건너뜀
            return null;
          }

          if (isSameDay(recommendDate, today)) {
            if (!solvedDate || !isSameDay(solvedDate, today)) {
              // recommenddate가 오늘이고, solveddate가 오늘이 아니면 풀어야 할 문제 수 카운트
              toSolve += 1;
            }

            if (solvedDate && isSameDay(solvedDate, today)) {
              // recommenddate가 오늘이고, solveddate도 오늘인 경우 푼 문제 수 카운트
              solved += 1;
            }

            return { ...item, recommendDate: format(recommendDate, 'yyyy-MM-dd') };
          } else if (isBefore(updateDate, today)) {
            // recommenddate가 오늘이 아니고, updateDate가 오늘보다 이전인 경우 풀어야 할 문제 수 카운트
            toSolve += 1;
            return { ...item, recommendDate: format(recommendDate, 'yyyy-MM-dd') };
          }

          // 위 조건에 해당하지 않는 경우 건너뜀
          return null;
        })
        .filter((q) => q !== null);

      setRecommendedQuestions(recommendations);
      setToSolveCount(toSolve);
      setSolvedCount(solved);
    } catch (error) {
      console.error('문제 추천 데이터를 불러오거나 처리하는 중 오류 발생:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [today, setRecommendedQuestions]);

  /**
   * 히스토리 데이터 및 추천 문제 데이터 로드
   */
  useEffect(() => {
    // 히스토리 데이터 로드
    const loadHistoryData = () => {
      Papa.parse('/history.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data
            .map((row) => {
              const date = isValid(parseISO(row.date.trim())) ? parseISO(row.date.trim()) : null;
              if (!date) return null;
              const solvedCount = row.solvedCount;
              const correctCount = row.correctCount;
              const correctRate = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;
              return { date, solvedCount, correctCount, correctRate };
            })
            .filter((row) => row !== null);

          console.log('Parsed History Data:', parsedData);
          setHistoryData(parsedData);
          setLoadingHistory(false);
        },
        error: (error) => {
          console.error('CSV 파싱 오류:', error);
          setLoadingHistory(false);
        },
      });
    };

    loadHistoryData();
    loadRecommendedQuestions();
  }, [loadRecommendedQuestions, setHistoryData]);

  /**
   * 풀어야 할 문제들 필터링
   */
  const problemsToSolve = useMemo(() => {
    return recommendedQuestions.filter((question) => {
      const recommendDate = parseISO(question.recommenddate);
      const solvedDate = question.solveddate ? parseISO(question.solveddate) : null;

      // recommenddate가 오늘이고, solveddate가 없거나 오늘이 아닌 경우
      const isRecommendToday = isSameDay(recommendDate, today);
      const isNotSolvedToday = !solvedDate || !isSameDay(solvedDate, today);

      // updateDate가 오늘보다 이전인 경우
      const updateDate = parseISO(question.update);
      const isUpdateBeforeToday = isBefore(updateDate, today);

      return (isRecommendToday && isNotSolvedToday) || isUpdateBeforeToday;
    });
  }, [recommendedQuestions, today]);

  /**
   * 오늘 풀어야 할 문제들 리스트 정의
   */
  const todayProblemsToSolve = useMemo(() => {
    return recommendedQuestions.filter((question) => {
      const recommendDate = parseISO(question.recommenddate);
      const solvedDate = question.solveddate ? parseISO(question.solveddate) : null;

      const isRecommendToday = isSameDay(recommendDate, today);
      const isNotSolvedToday = !solvedDate || !isSameDay(solvedDate, today);

      return isRecommendToday && isNotSolvedToday;
    });
  }, [recommendedQuestions, today]);

  /**
   * 오늘 풀어야 할 문제들 상태 업데이트
   */
  useEffect(() => {
    console.log("오늘 풀어야 할 문제들:", todayProblemsToSolve);
  }, [todayProblemsToSolve]);

  /**
   * 차트 데이터 상태 관리
   */
  const chartData = useMemo(() => {
    if (historyData.length === 0) return { labels: [], datasets: [] };

    const sortedHistory = [...historyData].sort((a, b) => a.date - b.date);
    const labels = sortedHistory.map((entry) => formatDate(entry.date));
    const correctRates = sortedHistory.map((entry) => entry.correctRate);

    return {
      labels,
      datasets: [
        {
          label: '정답률',
          data: correctRates,
          fill: false,
          borderColor: '#34D399', // Tailwind의 녹색 계열 색상
          tension: 0.1,
        },
      ],
    };
  }, [historyData]);

  /**
   * 오늘 데이터 계산
   */
  const sortedHistory = useMemo(() => [...historyData].sort((a, b) => b.date - a.date), [historyData]);
  const todayEntry = useMemo(() => sortedHistory.find(entry => isSameDay(entry.date, today)), [sortedHistory, today]);

  const todaySolved = todayEntry ? todayEntry.solvedCount : 0;
  const todayCorrect = todayEntry ? todayEntry.correctCount : 0;
  const todayCorrectRate = todayEntry
    ? todayEntry.solvedCount > 0
      ? Math.round((todayEntry.correctCount / todayEntry.solvedCount) * 100)
      : 0
    : 0;

  /**
   * 어제 데이터 계산
   */
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

  /**
   * 총 추천 문제 수를 풀어야 할 문제 수와 푼 문제 수의 합으로 설정
   */
  const totalRecommendToday = useMemo(() => toSolveCount + solvedCount, [toSolveCount, solvedCount]);

  /**
   * 풀어야 할 문제 수 계산
   */
  // const problemsToSolveToday = useMemo(() => toSolveCount, [toSolveCount]); // 기존 오류 발생 코드 제거

  /**
   * 풀어야 할 문제들 배열로 전달
   */
  // 새로 추가된 변수로 변경
  const problemsToSolveTodayArray = useMemo(() => todayProblemsToSolve, [todayProblemsToSolve]);

  /**
   * 총 추천 문제 수
   */
  const totalProblems = useMemo(() => totalRecommendToday, [totalRecommendToday]);

  /**
   * 이미 푼 문제 수 (완료된 문제 수)
   */
  const completedProblems = useMemo(() => solvedCount, [solvedCount]);

  /**
   * 완료 퍼센트 계산
   */
  const completionRate = useMemo(() => totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0, [totalProblems, completedProblems]);

  /**
   * 달력의 날짜 칸에 표시 추가
   */
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasData = historyData.some((entry) => isSameDay(entry.date, date));
      return hasData ? (
        <div className="mt-1">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
        </div>
      ) : null;
    }
    return null;
  };

  /**
   * 문제 생성 페이지로 이동
   */
  const goToQuestionsPage = () => {
    navigate("/questions", { state: { openModal: true } });
  };

  /**
   * 문제풀기 버튼 클릭 핸들러
   */
  const handleSolveProblems = () => {
    console.log(`풀 문제 수: ${selectedProblemCount}`);
    // 문제풀기 로직을 여기서 처리하거나, 필요한 경우 navigate 호출
  };

  // 로딩 상태 표시
  if (loadingHistory || loadingRecommendations) {
    return <Loading />;
  }

  return (
    <main className="ml-20 p-5 flex flex-col gap-4 flex-1">
      {/* 문제 추천 섹션 */}
     <ProblemRecommendation
  totalRecommendToday={totalRecommendToday}
  toSolveCount={toSolveCount}
  solvedCount={solvedCount}
  selectedProblemCount={selectedProblemCount}
  setSelectedProblemCount={setSelectedProblemCount}
  problemsToSolveToday={problemsToSolveTodayArray} // 배열로 전달
  goToQuestions={goToQuestionsPage}
/>

      {/* 대시보드 섹션 */}
      <DashboardStats
        todaySolved={todaySolved}
        todayCorrect={todayCorrect}
        completionRate={completionRate}
        todayCorrectRate={todayCorrectRate}
        rateChange={rateChange}
        chartData={chartData}
      />

      {/* 히스토리 섹션 */}
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
