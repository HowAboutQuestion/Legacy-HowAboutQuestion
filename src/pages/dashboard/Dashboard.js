import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import { Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import Papa from "papaparse";
import { parseISO, isValid, isSameDay, addDays } from "date-fns";
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

const Dashboard = () => {
  const navigate = useNavigate(); 

  const goToQuestions = () => {
    navigate("/questions");
  };

  // 차트 데이터 상태 관리
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '정답률',
        data: [],
        fill: false,
        borderColor: '#34D399', // Tailwind의 녹색 계열 색상
        tension: 0.1,
      },
    ],
  });

  // 차트 옵션
  const options = {
    responsive: true,
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
  };

  // 히스토리 데이터 상태 관리
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyView, setHistoryView] = useState('list'); // 'list' 또는 'calendar'

  // 문제 추천 상태 관리
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  
  // 사용자가 선택한 풀 문제 수
  const [selectedProblemCount, setSelectedProblemCount] = useState(1);

  // 오늘 날짜 상수
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    // CSV 파일 가져오기 및 파싱 (히스토리 데이터)
    Papa.parse('/history.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true, // 빈 행 건너뛰기
      complete: (results) => {
        // 날짜 문자열을 Date 객체로 변환 및 유효한 데이터만 필터링
        const parsedData = results.data
          .map((row) => {
            const date = parseISO(row.date.trim());
            if (!isValid(date)) return null;
            const solvedCount = row.solvedCount;
            const correctCount = row.correctCount;
            // correctRate 계산 (solvedCount이 0인 경우 0으로 처리)
            const correctRate = solvedCount > 0 ? (correctCount / solvedCount) * 100 : 0;
            return {
              date,
              solvedCount,
              correctCount,
              correctRate: Math.round(correctRate), // 소수점 없이 정수로 반올림
            };
          })
          .filter((row) => row !== null); // 유효한 날짜만 필터링

        // 디버깅을 위해 파싱된 데이터 콘솔에 출력
        console.log('Parsed History Data:', parsedData);

        setHistoryData(parsedData);
        setLoadingHistory(false);
      },
      error: (error) => {
        console.error('CSV 파싱 오류:', error);
        setLoadingHistory(false);
      },
    });

    // 문제 추천 CSV 파일 가져오기 및 파싱
    const fetchAndProcessRecommendations = async () => {
      try {
        const response = await fetch('/dummy.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();

        // Parse CSV data
        const parsedData = Papa.parse(csvText, { header: true }).data;

        // Process recommendations
        const recommendations = parsedData
          .map((item) => {
            // level이 없거나 숫자로 변환이 안될 경우 기본값 0 사용
            let level = parseInt(item.level, 10);
            if (isNaN(level)) {
              level = 0;
            }

            // updateDate가 유효하지 않을 경우 today를 기본값으로 사용
            let updateDate = isValid(parseISO(item.update)) ? parseISO(item.update) : today;

            let recommendedDate;

            if (level === 0) {
              // updateDate가 today와 같은 날이라면 다음날 추천, 아니면 오늘 바로 추천
              recommendedDate = isSameDay(updateDate, today) ? addDays(today, 1) : today;
            } else {
              // level에 따라 updateDate로부터 level+1일 후 추천
              recommendedDate = addDays(updateDate, level + 1);
            }

            // recommendedDate가 오늘이거나 이미 지났다면 추천 목록에 포함
            if (isSameDay(recommendedDate, today) || recommendedDate < today) {
              return {
                ...item,
                recommendedDate,
              };
            }

            // 위 조건에 해당되지 않으면 null 반환
            return null;
          })
          .filter((q) => q !== null);

        setRecommendedQuestions(recommendations);
      } catch (error) {
        console.error('Error fetching or processing recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchAndProcessRecommendations();
  }, [today]); // 'today'를 의존성 배열에 추가하여 날짜 변경 시 업데이트

  // 날짜를 YYYY-MM-DD 형식으로 포맷
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2); // 월은 0부터 시작
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  // useEffect를 사용하여 historyData가 변경될 때마다 chartData 업데이트
  useEffect(() => {
    if (historyData.length === 0) return;

    // 모든 날짜 데이터 준비
    const allHistory = historyData
      .sort((a, b) => a.date - b.date); // 날짜 오름차순 정렬

    // 레이블과 데이터 추출
    const labels = allHistory.map((entry) => formatDate(entry.date));
    const correctRates = allHistory.map((entry) => entry.correctRate);

    setChartData({
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
    });
  }, [historyData]);

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

  if (loadingHistory || loadingRecommendations) {
    return <div>로딩 중...</div>;
  }

  // 전체 데이터를 날짜 기준으로 정렬 (내림차순)
  const sortedHistory = [...historyData].sort((a, b) => b.date - a.date);

  // 오늘 데이터 찾기
  const todayEntry = sortedHistory.find(entry => isSameDay(entry.date, today));

  // 오늘 푼 문제와 맞춘 문제 설정
  const todaySolved = todayEntry ? todayEntry.solvedCount : 0;
  const todayCorrect = todayEntry ? todayEntry.correctCount : 0;

  // 오늘의 정답률 계산
  const todayCorrectRate = todayEntry
    ? todayEntry.solvedCount > 0
      ? Math.round((todayEntry.correctCount / todayEntry.solvedCount) * 100)
      : 0
    : 0;

  // 어제의 데이터 찾기 (오늘 바로 이전 날짜)
  const yesterday = addDays(today, -1);
  const yesterdayEntry = sortedHistory.find(entry => isSameDay(entry.date, yesterday));

  // 어제와 오늘의 정답률 비교
  const rateChange = todayEntry && yesterdayEntry
    ? todayCorrectRate - (yesterdayEntry.solvedCount > 0 ? Math.round((yesterdayEntry.correctCount / yesterdayEntry.solvedCount) * 100) : 0)
    : 0;

  // 풀어야 할 문제 수 계산 (recommendedDate가 오늘인 문제의 개수)
  const problemsToSolveToday = recommendedQuestions.filter(q => {
    return isSameDay(q.recommendedDate, today) || q.recommendedDate < today;
  }).length;
  // 총 추천 문제 수
  const totalProblems = recommendedQuestions.length;

  // 이미 푼 문제 수 (완료된 문제 수)
  const completedProblems = totalProblems - problemsToSolveToday;

  // 완료 퍼센트 계산
  const completionRate = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;


  return (
  
      <main className="ml-20 p-5 flex flex-col gap-4 flex-1">
        {/* 문제 추천 섹션 */}
        <section className="p-8 bg-white rounded">
          <h2 className="text-2xl font-bold mb-6">문제 추천</h2>
          <div className="flex flex-col items-center bg-neutral-50 p-6 rounded-lg">
            {/* 오늘의 추천 문제 */}
            <div className="w-full text-center mb-4">
              {/* 추천 문제가 없는 경우 */}
              {recommendedQuestions.length === 0 ? (
                <>
                  {/* 문제 없음 이미지 표시 */}
                  <div className="w-full h-40 mx-auto mb-4 relative">
                    {/* 이미지가 부모 컨테이너 크기에 맞게 조정되도록 설정 */}
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
                  <p className="text-2xl font-bold mt-2">총 추천 문제: {recommendedQuestions.length}문제</p>
                  
                  {/* 문제 수 선택 UI 추가 */}
                  <div className="mt-4 flex items-center justify-center">
                    <label htmlFor="problemCount" className="mr-2 text-lg">풀 문제 수:</label>
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
              {recommendedQuestions.length === 0 ? (
                <button onClick={goToQuestions}
                className="w-[300px] h-10 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition">
                  문제 생성
                </button>
              ) : (
                /* 추천 문제가 있고, 아직 풀어야 할 문제가 있는 경우에만 문제풀기 버튼 표시 */
                problemsToSolveToday !== 0 && (
                  <button
                    className="w-[300px] h-10 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition"
                    onClick={() => {
                      // 선택된 문제 수에 따라 문제풀기 로직 추가
                      // 예: 라우팅 또는 문제풀이 페이지로 이동
                      console.log(`풀 문제 수: ${selectedProblemCount}`);
                      // 예시: window.location.href = `/solve?count=${selectedProblemCount}`;
                    }}
                  >
                    문제풀기
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* 나머지 대시보드 섹션들 ... */}
        
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
                    ...options,
                    maintainAspectRatio: false, // 부모 컨테이너에 맞춰 크기 조정
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
                    <th className="py-2 px-4 text-left">정답률</th> {/* 정답률 열 추가 */}
                  </tr>
                </thead>
                <tbody>
                  {historyData
                    .sort((a, b) => b.date - a.date)
                    .slice(0, 7)
                    .map((entry, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-2 px-4">{formatDate(entry.date)}</td>
                        <td className="py-2 px-4">{entry.solvedCount}</td>
                        <td className="py-2 px-4">{entry.correctCount}</td>
                        <td className="py-2 px-4">{entry.correctRate}%</td> {/* 정답률 표시 */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 flex justify-center items-center">
              <Calendar
                tileContent={tileContent}
              // 추가로 상세 정보를 표시하려면 onClickDay 등을 사용할 수 있습니다.
              />
            </div>
          )}
        </section>
      </main>
    
  );
};

export default Dashboard;
