import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Calendar CSS import
import Papa from 'papaparse'; // PapaParse import
import { parseISO, isValid, isSameDay } from 'date-fns'; // date-fns import

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
        text: '최근 7일 정답률',
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
  const [loading, setLoading] = useState(true);
  const [historyView, setHistoryView] = useState('list'); // 'list' 또는 'calendar'

  useEffect(() => {
    // CSV 파일 가져오기 및 파싱
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
        console.log('Parsed Data:', parsedData);

        setHistoryData(parsedData);
        setLoading(false);
      },
      error: (error) => {
        console.error('CSV 파싱 오류:', error);
        setLoading(false);
      },
    });
  }, []);

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

    // 최근 7일 데이터 준비
    const recentHistory = historyData
      .sort((a, b) => b.date - a.date) // 날짜 내림차순 정렬
      .slice(0, 7)
      .reverse(); // 차트는 오름차순으로 표시

    // 레이블과 데이터 추출
    const labels = recentHistory.map((entry) => formatDate(entry.date));
    const correctRates = recentHistory.map((entry) => entry.correctRate);

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

  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 오늘 날짜 가져오기
  const today = new Date();

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
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayEntry = sortedHistory.find(entry => isSameDay(entry.date, yesterday));

  // 어제와 오늘의 정답률 비교
  const rateChange = todayEntry && yesterdayEntry
    ? todayCorrectRate - (yesterdayEntry.solvedCount > 0 ? Math.round((yesterdayEntry.correctCount / yesterdayEntry.solvedCount) * 100) : 0)
    : 0;

  return (
    <div className="flex">
      {/* 사이드바 */}
      <aside className="fixed top-0 left-0 z-40 w-20 h-full bg-gray-800">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
                aria-label="홈"
              >
                {/* 홈 아이콘 */}
                <svg
                  className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
                aria-label="설정"
              >
                {/* 설정 아이콘 */}
                <svg
                  className="flex-shrink-0 w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="ml-20 p-5 flex flex-col gap-4 w-full">
        {/* 문제 추천 섹션 */}
        <section className="p-8 bg-white rounded">
          <h2 className="text-2xl font-bold mb-6">문제 추천</h2>
          <div className="flex flex-col items-center bg-neutral-50 p-6 rounded-lg">
            {/* 오늘의 추천 문제 */}
            <div className="w-full text-center mb-4">
              <p className="text-xl font-semibold">오늘의 추천 문제</p>
              <p className="text-3xl font-bold">50문제</p>
            </div>
            {/* 진행 상황 */}
            <div className="w-full text-center mb-4">
              <p className="text-xl font-semibold">25개 / 50문제</p>
            </div>
            {/* 문제풀기 버튼 */}
            <div>
              <button className="w-[300px] h-10 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition">
                문제풀기
              </button>
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
              <p className="text-2xl font-bold mt-2">45% 완료</p>
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
              <div className="w-full h-full mt-4">
                {/* 차트 영역 */}
                <Line data={chartData} options={options} />
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
    </div>
  );
};

export default Dashboard;
