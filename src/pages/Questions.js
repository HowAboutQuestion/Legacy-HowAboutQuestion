import React, { Component } from 'react';


class Questions extends Component {
  
    render(){
      return (
        <main className="ml-20">
        <div className="sm:rounded-lg">
          <div className="p-4 flex justify-between">
            <div>
              <h1 className="text-2xl font-semibold">MVC Pattern</h1>
              <h1 className="text-md font-normal text-gray-400">총 21문제</h1>
            </div>
            <div className="py-4 bg-white text-right">
              <button
                type="button"
                className="text-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-xs p-2 text-center inline-flex items-center  me-2 mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                문제추가
              </button>
              <button
                type="button"
                className="text-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-xs p-2 text-center inline-flex items-center  me-2 mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                다운로드가필요?할?까?요?
              </button>
            </div>
          </div>
          <table className="text-left rtl:text-right text-gray-500">
            <thead className="text-sm font-bold text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  문제
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  유형
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-gray-50 ">
                <td className="w-4 p-4 ">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-table-search-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                >
                  <div className="">
                    <div className="text-base font-bold">문제제목</div>
                    <div className="font-normal text-gray-500 hidden">
                      문제설명문제설명문제설명
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex items-center font-medium text-sm whitespace-nowrap">
                    객관식
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a href="#" className="font-sm text-blue-600 whitespace-nowrap">
                    수정
                  </a>
                </td>
              </tr>
              <tr className="bg-white border-b hover:bg-gray-50 ">
                <td className="w-4 p-4 ">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-table-search-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                >
                  <div className="">
                    <div className="text-base font-bold">문제제목</div>
                    <div className="font-normal text-gray-500 hidden">
                      문제설명문제설명문제설명
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex items-center font-medium text-sm whitespace-nowrap">
                    객관식
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a href="#" className="font-sm text-blue-600 whitespace-nowrap">
                    수정
                  </a>
                </td>
              </tr>
              <tr className="bg-white border-b hover:bg-gray-50 ">
                <td className="w-4 p-4 ">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-table-search-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                >
                  <div className="">
                    <div className="text-base font-bold">문제제목</div>
                    <div className="font-normal text-gray-500 hidden">
                      문제설명문제설명문제설명
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex items-center font-medium text-sm whitespace-nowrap">
                    객관식
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a href="#" className="font-sm text-blue-600 whitespace-nowrap">
                    수정
                  </a>
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="w-4 p-4 ">
                  <div className="flex items-center align-top">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-table-search-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 "
                >
                  <div className="">
                    <div className="text-base font-bold">
                      문제제목문제제목문제제목문제제목문제제목문제제목문제제목문제제목문제제목문제제목
                      문제제목문제제목문제제목문제?
                    </div>
                    <div className="font-normal text-sm text-gray-500 p-3">정답</div>
                  </div>
                </th>
                <td className="px-6 py-4  align-top">
                  <div className="flex items-center font-medium text-sm whitespace-nowrap">
                    주관식
                  </div>
                </td>
                <td className="px-6 py-4 align-top">
                  <a href="#" className="font-sm text-blue-600 whitespace-nowrap">
                    수정
                  </a>
                </td>
              </tr>
              <tr className="bg-white border-b bg-gray-50">
                <td className="w-4 p-4 align-top">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-table-search-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th scope="row" className="flex items-center px-6 py-4 text-gray-900">
                  <div className="flex-1">
                    <div className="text-base font-bold">
                      문제제목문제제목문제제목문제제목문제제목문제제목문제제목문제제목문제제목문제제목
                      문제제목문제제목문제제목문제?
                    </div>
                    <div className="font-normal text-sm text-gray-500 flex flex-col mt-4 gap-2">
                      <div className="border rounded-lg p-3">
                        선택지1선택지1선택지1선택지1선택지1선택지1선택지1선택지1선택지1선택지1
                      </div>
                      <div className="border rounded-lg p-3">선택지2</div>
                      <div className="border rounded-lg p-3">선택지3</div>
                      <div className="border rounded-lg p-3 font-bold text-blue-500">
                        선택지4
                      </div>
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4 align-top">
                  <div className="font-medium text-sm whitespace-nowrap">객관식</div>
                </td>
                <td className="px-6 py-4 align-top">
                  <a href="#" className="font-sm text-blue-600 whitespace-nowrap">
                    수정
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      
  
      );
    }
}

export default Questions;