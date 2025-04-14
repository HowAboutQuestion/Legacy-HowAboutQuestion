import React, { useState } from "react";


function Header({ isCollapsed, setIsCollapsed, allTagItems}) {
  return (
    <div
    className={`fixed h-full ${
      isCollapsed ? "border-r" : "w-80"
    } rounded-r-xl  flex flex-col items-center shadow bg-gray-100 transition-all duration-500`}
  >
    <div
      className="cursor-pointer text-gray-400 w-full text-right p-2"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="size-5 inline"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </div>

    <div className="hidden w-full p-5 ">
      {!isCollapsed && <div className="font-bold">문제검색</div>}
      {!isCollapsed && (
        <input
          type="text"
          className="border-gray-300 border-1 rounded py-1 w-full mt-3 text-sm"
        />
      )}
    </div>

    {!isCollapsed && (
      <div className="w-full p-5 h-max overflow-auto css-tag-scroll">
        <div className="font-bold">문제집 선택</div>
        <div className="flex gap-2 py-2 w-full flex-wrap">
          {allTagItems}
        </div>
      </div>
    )}
  </div>
  );
}

export default Header;