import React from 'react';
import { Line } from 'react-chartjs-2';
import { ko } from 'date-fns/locale';

const DashboardStats = ({
  todaySolved,
  todayCorrect,
  completionRate,
  todayCorrectRate,
  rateChange,
  chartData,
}) => {
  return (
    <section className="p-8 bg-white rounded">
      <h2 className="text-2xl font-bold mb-6">대시보드</h2>
      <section data-tour-id="dashboard-stats">
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
      </section>
      <section data-tour-id="dashboard-graph">
        <div className="h-auto mb-4 rounded bg-gray-50 p-6">
          <div className="flex flex-col items-start w-full">
            <p className="text-lg font-bold text-gray-800">정답률</p>
            <p className="text-4xl font-extrabold text-gray-900 mt-2">
              {todayCorrectRate}% 맞춤!
            </p>
            <div className="flex items-center mt-1">
              <p className="text-sm text-gray-500 mr-1">어제보다</p>
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
                  maintainAspectRatio: false,
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
                    x: {
                      type: 'time',
                      time: {
                        unit: 'month',
                        tooltipFormat: 'yyyy년 M월 d일',
                        displayFormats: {
                          month: 'yyyy년 M월',
                        },
                        locale: ko, // 한글 locale 사용
                      },
                      title: {
                        display: true,
                        text: '날짜',
                      },
                    },
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: '정답률 (%)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default DashboardStats;
