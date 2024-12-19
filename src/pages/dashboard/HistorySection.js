import React from 'react';
import Calendar from 'react-calendar';
import { formatDate } from 'utils/formatDate';
import { isSameDay } from 'date-fns';

const HistorySection = ({
  historyView,
  setHistoryView,
  sortedHistory,
  today,
  tileContent,
}) => {
  return (
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
  );
};

export default HistorySection;
