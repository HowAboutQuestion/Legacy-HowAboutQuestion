import React, { Component } from 'react';


class Category extends Component {
  
    render(){
      return (
        <main>
  <div classname="ml-20 relative shadow-md sm:rounded-lg ">
    <div classname="p-4 flex justify-between">
      <div>
        <h1 classname="text-2xl font-semibold">문제집 목록</h1>
        <h1 classname="text-md font-normal text-gray-400">뭔가허전한데</h1>
      </div>
      <div classname="py-4 bg-white text-right">
        <button
          type="button"
          classname="text-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-xs p-2 text-center inline-flex items-center  me-2 mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokewidth="1.5"
            stroke="currentColor"
            classname="size-5"
          >
            <path
              strokelinecap="round"
              strokelinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          문제추가
        </button>
        <button
          type="button"
          classname="text-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-xs p-2 text-center inline-flex items-center  me-2 mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokewidth="1.5"
            stroke="currentColor"
            classname="size-5"
          >
            <path
              strokelinecap="round"
              strokelinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          문제집추가
        </button>
      </div>
    </div>
    <table classname="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead classname="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" classname="p-4">
            <div classname="flex items-center">
              <input
                id="checkbox-all-search"
                type="checkbox"
                classname="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="checkbox-all-search" classname="sr-only">
                checkbox
              </label>
            </div>
          </th>
          <th scope="col" classname="px-6 py-3">
            문제집이름
          </th>
          <th scope="col" classname="px-6 py-3">
            난이도
          </th>
          <th scope="col" classname="px-6 py-3"></th>
        </tr>
      </thead>
      <tbody>
        <tr classname="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td classname="w-4 p-4">
            <div classname="flex items-center">
              <input
                id="checkbox-table-search-1"
                type="checkbox"
                classname="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="checkbox-table-search-1" classname="sr-only">
                checkbox
              </label>
            </div>
          </td>
          <th
            scope="row"
            classname="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
          >
            <div classname="ps-3">
              <div classname="text-base font-semibold">Database</div>
              <div classname="text-sm font-normal text-gray-500">
                문제집설명이필요할까요?
              </div>
            </div>
          </th>
          <td classname="px-6 py-4">
            <div classname="flex items-center">
              <div classname="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />{" "}
              Online
            </div>
          </td>
          <td classname="px-6 py-4">
            <a
              href="#"
              classname="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              편집
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

export default Category;