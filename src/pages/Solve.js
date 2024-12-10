import React, { Component } from 'react';


class Solve extends Component {
  
    render(){
      return (
        <main className="ml-20">
        <div className="sm:rounded-lg">
          <div className="p-4 flex justify-between border-b">
            <div>
              <h1 className="text-2xl font-semibold">MVC Pattern</h1>
              <h1 className="text-md font-normal text-gray-400">총 21문제</h1>
            </div>
            <div className="bg-white text-right items-center flex">
              <div className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs py-2 px-4 text-center inline-flex items-center me-2 mb-2">
                목록
              </div>
              <div className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs py-2 px-4 text-center inline-flex items-center me-2 mb-2">
                제출하기
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 p-10 items-center">
            <div className="text-xl font-bold">
              <span>1.</span>
              <span>
                피부병, 당뇨병이나 온도감각 및 혈행장애가 있으신 분은 화상 위험이
                있으므로 의사나 약사와 상담 후 사용하세요?
              </span>
            </div>
            <div>
              <img
                className="bg-gray-50 max-w-max w-96 h-auto"
                src="https://cdn.mkhealth.co.kr/news/photo/202011/51201_51475_853.jpg"
                alt=""
              />
            </div>
            <form className="font-normal text-sm text-gray-500 flex flex-col gap-2 w-max">
              <label className="border rounded-lg p-3 pr-10 ">
                <input type="radio" name="choice" className="mx-1" />
                취침 시에는 화상의 위험이 있으니 특히 주의하세요
              </label>
              <label className="border rounded-lg p-3 pr-10 ">
                <input type="radio" name="choice" className="mx-1" />
                정해진 용도 이외로 사용하지 마세요
              </label>
              <label className="border rounded-lg p-3 pr-10 ">
                <input type="radio" name="choice" className="mx-1" />
                보관 시 직사광선을 피하고 서늘한 곳에 보관해주세요
              </label>
              <label className="border rounded-lg p-3 pr-10 font-bold text-blue-500 ">
                <input type="radio" name="choice" className="mx-1" />
                사용자의 부주의로 인한 피해 발생 시에는 책임지지 않습니다
              </label>
            </form>
          </div>
        </div>
        <div className="fixed z-40 bottom-5 right-5 flex gap-2">
          <div className="rounded-full p-2 text-white bg-blue-300 hover:bg-blue-500 shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </div>
          <div className="rounded-full p-2 text-white bg-blue-300 hover:bg-blue-500 shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
      </main>
         
  
      );
    }
}

export default Solve;