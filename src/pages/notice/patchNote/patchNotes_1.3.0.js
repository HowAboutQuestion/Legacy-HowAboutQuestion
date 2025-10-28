import React from "react";

function PatchNotes130() {
  return (
    <div className="leading-relaxed">
      <header className="relative h-64 text-center overflow-hidden">
        <img
          src="./images/help/1_3_0/header-bg.png"
          alt="1.3.0 패치노트 배경"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold mb-1 text-blue-400">1.3.0 패치노트</h1>
          <p className="text-basic italic">새로운 편의 기능들이 추가됐어요!</p>
        </div>
      </header>

      <div className="my-16 border-t border-gray-300 w-2/5 mx-auto"></div>


      <div className="px-8">
        <div className="border-b py-8">
          <p className="font-semibold italic text-3xl">"틀린 문제만 다시 풀기!"</p>
          <div className="mt-4">
            <img
              src="./images/help/1_3_0/retry.png"
              alt="틀린거 다시 풀기"
              className="w-1/2 mx-auto mb-4 rounded-lg"
            />
          </div>
          <p className="mb-2">
            이제 결과 화면에서 바로 <span className="cursor-pointer bg-blue-500 hover:scale-105 transition text-white font-semibold rounded-2xl text-xs h-6 w-20 inline-flex items-center justify-center mr-1 ml-1">오답 다시풀기</span> 버튼을 눌러 틀린 문제들만 재도전할 수 있습니다.<br />
            “전체 다시풀기”는 너무 길다 싶을 때, 이걸로 빠르게 약점만 잡아보세요.
          </p>
        </div>

        <div className="border-b py-8">
          <p className="font-semibold italic text-3xl">"긴 제목은 이제 생략 됩니다"</p>
          <div className="mt-4">
            <img
              src="./images/help/1_3_0/tooltip.gif"
              alt="제목 툴팁"
              className="w-full mb-4 rounded-lg"
            />
          </div>
          <p className="mb-2">
            제목이 너무 길면 문제 풀이 시 상단 제목이 일정 길이까지만 표시됩니다. <br />
            전체 제목을 확인하고 싶다면 마우스를 올려 툴팁으로 확인할 수 있습니다.
          </p>
        </div>

        <div className="border-b py-8">
          <p className="font-semibold italic text-3xl">"해설 한 방에 보기"</p>

          <div className="mt-4">
            <img
              src="./images/help/1_3_0/viewDes.gif"
              alt="해설 전부 보기"
              className="w-full mb-4 rounded-lg"
            />
          </div>
          <p className="mb-2">
            결과 페이지에서 개별 해설을 일일이 클릭할 필요가 없습니다.<br />
            <span className="cursor-pointer hover:scale-105 transition text-white font-semibold rounded-2xl text-xs h-6 w-6 inline-flex items-center justify-center mr-1 bg-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M12 2.25c-3.728 0-6.75 2.88-6.75 6.427 0 2.13 1.033 3.853 2.595 5.004.564.42.915 1.04.915 1.715v.104c0 .41.334.745.745.745h4.99c.411 0 .745-.334.745-.745v-.104c0-.676.351-1.295.915-1.715 1.562-1.151 2.595-2.874 2.595-5.004C18.75 5.13 15.728 2.25 12 2.25Z" />
                <path d="M9 18.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm.75 2.25h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5Z" />
              </svg>
            </span> 버튼을 눌러 모든 해설을 한 번에 열거나 닫을 수 있습니다.
          </p>
        </div>

        <div className="border-b py-8">
          <p className="font-semibold italic text-3xl">"선택한 문제만 풀기"</p>
          <div className="mt-4">
            <img
              src="./images/help/1_3_0/select-question.gif"
              alt="문제 골라 선택하기"
              className="w-full mb-4 rounded-lg"
            />
          </div>
          <p className="mb-2">
            문제 관리 페이지에서 원하는 문제만 선택해서 풀 수 있습니다. <br />
            체크박스를 이용해서 문제를 선택하고
            <span className="cursor-pointer bg-blue-500 hover:scale-105 transition text-white font-semibold rounded-2xl text-xs h-6 w-20 inline-flex items-center justify-center mr-1 ml-1">문제풀러가기</span>
            를 눌러 선택한 문제를 풀어보세요
          </p>
        </div>

        <div className="py-8">
          <p className="font-semibold italic text-3xl mt-4 mb-1">"페이지별 도움말 가이드"</p>
          <p>
            기존 도움말 페이지가 페이지별 가이드로 새롭게 개편되었습니다. <br />
            각 페이지 우측 상단의
            <span className="hover:scale-105 inline-flex items-center cursor-pointer text-gray-400 w-5 h-5 align-middle ml-1 mr-1  ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
            </span>
            버튼을 눌러 현재 페이지에 맞는 안내를 확인해보세요.<br />
            <div className="mt-4">
              <img
                src="./images/help/1_3_0/page-guide.png"
                alt="페이지별 가이드"
                className="w-full mb-4 rounded-lg"
              />
            </div>
          </p>
        </div>
      </div>

    </div>
  );
}

export default PatchNotes130;