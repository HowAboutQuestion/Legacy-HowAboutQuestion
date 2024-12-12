import React, { Component } from 'react';


class Dashboard extends Component {
  
    render(){
      return (
        <main className="ml-20">
          <div className="p-5 flex flex-col gap-4">
            {/* <div class="text-2xl font-bold mt-2">문제추천</div> */}
            <section className="p-8">
              <h2 className="text-2xl font-bold mb-6">문제 추천</h2>
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-4 ">
                  <img
                    src=""
                    alt="사진"
                    className="w-full h-36 object-cover rounded-lg "
                  />
                  <h3 className="text-lg font-semibold mt-4">DataBase</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    이 편지는 영국에서 최초로 시작되어 일본에 한 바퀴 돌면서...
                  </p>
                  <button className="mt-4 bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-gray-300">
                    문제 풀기
                  </button>
                </div>
                {/* 그림자 괜찮을듯 ㅇㅇ */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <img
                    src=""
                    alt="사진"
                    className="w-full h-36 object-cover rounded-lg"
                  />
                  <h3 className="text-lg font-semibold mt-4">FrontEnd</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    날이 좋아서 날이 좋지 않아서 날이 적당해서 모든 날이 좋았다...
                  </p>
                  <button className="mt-4 bg-blue-500 text-white text-sm px-4 py-2 rounded">
                    문제 풀기
                  </button>
                </div>
                <div className="bg-white rounded-lg p-4  hover:bg-gray-300">
                  <img
                    src=""
                    alt="사진"
                    className="w-full h-36 object-cover rounded-lg "
                  />
                  <h3 className="text-lg font-semibold mt-4">Spring MVC</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    MVC란 MVP를 적다가 P를 C로 오타내서 생겨난 이름이다.
                  </p>
                  <button className="mt-4 bg-blue-500 text-white text-sm px-4 py-2 rounded">
                    문제 풀기
                  </button>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md p-4  hover:bg-gray-300">
                  <img
                    src=""
                    alt="사진"
                    className="w-full h-36 object-cover rounded-lg "
                  />
                  <h3 className="text-lg font-semibold mt-4">게이에 대하여</h3>
                  <p className="text-sm text-gray-600 mt-2">저 게이에요</p>
                  <p className="text-sm text-gray-600 mt-2">-해림-</p>
                  <button className="mt-4 bg-blue-500 text-white text-sm px-4 py-2 rounded">
                    문제 풀기
                  </button>
                </div>
              </div>
            </section>
            <section className="p-8">
              <h2 className="text-2xl font-bold mb-6">대시보드</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-blue-100 rounded">
                  <h3 className="text-lg font-semibold">오늘 푼 문제</h3>
                  <p className="text-2xl font-bold mt-2">15 📘</p>
                </div>
                <div className="p-4 bg-green-100 rounded">
                  <h3 className="text-lg font-semibold">오늘 맞춘 문제</h3>
                  <p className="text-2xl font-bold mt-2">12 ✅</p>
                </div>
                <div className="p-4 bg-yellow-100 rounded">
                  <h3 className="text-lg font-semibold">학습 진도</h3>
                  <p className="text-2xl font-bold mt-2">45% 완료</p>
                </div>
              </div>
              <div className="flex justify-between items-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800 px-6 py-4 ">
                {/* 왼쪽 */}
                <div className="flex flex-col items-start">
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    오늘 푼 문제
                  </p>
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
                    오조오억 문제
                  </p>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mr-1">
                      어제보다
                    </p>
                    <p className="text-sm font-medium text-green-500">+5%</p>
                  </div>
                  <div>막대기 그래프 영역</div>
                </div>
                {/* 오른쪽 */}
                <div className="flex flex-col items-end">
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    정답률
                  </p>
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
                    80% 맞춤!
                  </p>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mr-1">
                      어제보다
                    </p>
                    <p className="text-sm font-medium text-red-500">-2%</p>
                  </div>
                  <div>곡선 그래프 영역</div>
                </div>
              </div>
              {/* 고정된 크기에 그래프 크기가 동적으로 바뀌게 할까? */}
              {/* 일단 이렇게 고 */}
            </section>
            <section className="p-8">
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold mb-2">히스토리</h2>
                  <button className="bg-gray-100 rounded font-bold px-4 py-2 text-sm hover:bg-gray-300">
                    달력 보기
                  </button>
                </div>
                <p className="text-sm text-gray-500">최근 7일</p>
              </div>
              <table className="w-full bg-white rounded shadow text-gray-700">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">날짜</th>
                    <th className="py-2 px-4 text-left">푼 문제</th>
                    <th className="py-2 px-4 text-left">맞춘 문제</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4">2024-12-07</td>
                    <td className="py-2 px-4">20</td>
                    <td className="py-2 px-4">16</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">2024-12-06</td>
                    <td className="py-2 px-4">18</td>
                    <td className="py-2 px-4">14</td>
                  </tr>
                </tbody>
              </table>
            </section>
            <section className="p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">히스토리</h2>
                <button className="text-sm font-bold bg-gray-100 px-4 py-2 rounded hover:bg-gray-300">
                  리스트 보기
                </button>
              </div>
              <div>
                달력
                {/* 달력 */}
              </div>
            </section>
          </div>
        </main>


         
  
      );
    }
}

export default Dashboard;