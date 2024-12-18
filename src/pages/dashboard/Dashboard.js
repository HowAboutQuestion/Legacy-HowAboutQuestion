// Dashboard.js

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import { Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import Papa from "papaparse";
import { parseISO, isValid, isSameDay, isBefore, addDays, format } from "date-fns"; // isBefore 추가
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

// 유틸리티 함수: 날짜를 YYYY-MM-DD 형식으로 포맷
const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

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

  // **풀어야 할 문제 수와 푼 문제 수 상태 관리**
  const [toSolveCount, setToSolveCount] = useState(0); // 풀어야 할 문제 수
  const [solvedCount, setSolvedCount] = useState(0); // 푼 문제 수

  // 문제 추천 데이터 로드 함수 (useCallback으로 메모이제이션)
  const loadRecommendedQuestions = useCallback(async () => {
    try {
      // 캐시 방지를 위해 타임스탬프 추가
      const response = await fetch(`/dummy.csv?timestamp=${Date.now()}`);
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
      console.error('Error fetching or processing recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [today, setRecommendedQuestions]);

  // 문제 추천 및 히스토리 데이터 로딩
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

  // 차트 데이터 상태 관리 (Recoil에서 관리)
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

  // **수정: 총 추천 문제 수를 풀어야 할 문제 수와 푼 문제 수의 합으로 설정**
  const totalRecommendToday = useMemo(() => toSolveCount + solvedCount, [toSolveCount, solvedCount]);

  // 풀어야 할 문제 수 계산 (recommendDate가 오늘이면서 solveddate가 오늘이 아닌 문제 + updateDate가 오늘보다 이전인 문제의 개수)
  const problemsToSolveToday = useMemo(() => toSolveCount, [toSolveCount]);

  // 총 추천 문제 수
  const totalProblems = useMemo(() => totalRecommendToday, [totalRecommendToday]);

  // 이미 푼 문제 수 (완료된 문제 수)
  const completedProblems = useMemo(() => solvedCount, [solvedCount]);

  // 완료 퍼센트 계산
  const completionRate = useMemo(() => totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0, [totalProblems, completedProblems]);

  // 달력의 날짜 칸에 표시 추가
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

  // 문제 생성 페이지로 이동
  const goToQuestions = () => {
    navigate("/questions");
  };

  // 문제풀기 버튼 클릭 핸들러
  const handleSolveProblems = () => {
    console.log(`풀 문제 수: ${selectedProblemCount}`);
    // 예시: 라우팅 또는 문제풀이 페이지로 이동
    // navigate(`/solve?count=${selectedProblemCount}`);
  };

  if (loadingHistory || loadingRecommendations) {
    return <div>로딩 중...</div>;
  }

  return (
    <main className="ml-20 p-5 flex flex-col gap-4 flex-1">
      {/* 문제 추천 섹션 */}
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
                <p className="text-xl font-semibold">오늘의 추천 문제</p>
                {/* **수정: 풀어야 할 문제 수 / 총 문제 수 표시** */}
                <p className="text-2xl font-bold mt-2">
                  풀어야할 문제 수: {problemsToSolveToday} / 총 문제 수: {totalProblems}문제
                </p>
                
                {/* 문제 수 선택 UI 추가 */}
                <div className="mt-4 flex items-center justify-center">
                  <label htmlFor="problemCount" className="mr-2 text-lg">풀어야 할 문제 수:</label> {/* **수정된 부분** */}
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
                  문제
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

      {/* 대시보드 섹션 */}
      <section className="p-8 bg-white rounded">
        <h2 className="text-2xl font-bold mb-6">대시보드</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-100 rounded">
            <h3 className="text-lg font-semibold">오늘 푼 문제</h3>
            <p className="text-2xl font-bold mt-2">{todaySolved} 📘</p>
          </div>
          <div className="p-4 bg-green-100 rounded">
            <h3 className="text-lg font-semibold">오늘 맞춘 문제</h3>
            <p className="text-2xl font-bold mt-2">{todayCorrect} ✅</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded">
            <h3 className="text-lg font-semibold">학습 진도</h3>
            <p className="text-2xl font-bold mt-2">{completionRate}% 완료</p>
          </div>
        </div>
        <div className="h-auto mb-4 rounded bg-gray-50 dark:bg-gray-800 p-6">
          {/* 정답률 표시 */}
          <div className="flex flex-col items-start w-full">
            <p className="text-lg font-bold text-gray-800 dark:text-white">정답률</p>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">{todayCorrectRate}% 맞춤!</p>

            <div className="flex items-center mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 mr-1">어제보다</p>
              <p className={`text-sm font-medium ${rateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {rateChange >= 0 ? `+${rateChange}%` : `${rateChange}%`}
              </p>
            </div>

            {/* 그래프 영역 */}
            <div className="w-full h-64 mt-4">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // 부모 컨테이너에 맞춰 크기 조정
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                    title: {
                      display: true,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 히스토리 섹션 */}
      <section className="p-8 bg-white rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">히스토리</h2>
          <div className="flex space-x-2">
            {historyView === 'list' ? (
              <button
                onClick={() => setHistoryView('calendar')}
                className="text-sm font-bold px-4 py-2 rounded transition bg-gray-100 hover:bg-gray-300"
              >
                달력 보기
              </button>
            ) : (
              <button
                onClick={() => setHistoryView('list')}
                className="text-sm font-bold px-4 py-2 rounded transition bg-gray-100 hover:bg-gray-300"
              >
                리스트 보기
              </button>
            )}
          </div>
        </div>
        {/* 뷰 전환 */}
        {historyView === 'list' ? (
          <div>
            <p className="text-sm text-gray-500">최근 7일</p>
            <table className="w-full bg-white rounded shadow text-gray-700 mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">날짜</th>
                  <th className="py-2 px-4 text-left">푼 문제</th>
                  <th className="py-2 px-4 text-left">맞춘 문제</th>
                  <th className="py-2 px-4 text-left">정답률</th>
                </tr>
              </thead>
              <tbody>
                {sortedHistory.slice(0, 7).map((entry, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 px-4">{formatDate(entry.date)}</td>
                    <td className="py-2 px-4">{entry.solvedCount}</td>
                    <td className="py-2 px-4">{entry.correctCount}</td>
                    <td className="py-2 px-4">{entry.correctRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 flex justify-center items-center">
            <Calendar tileContent={tileContent} />
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
