import React from 'react';

function Sidebar({ isCollapsed, allTag, selectedTag, onTagClick, setIsCollapsed }) {
  const allTagItems = allTag.map((tagName, index) => {
    const isSelected = selectedTag.includes(tagName);
    return (
      <div
        onClick={() => onTagClick(tagName)}
        key={index}
        className={`cursor-pointer transition-transform transform hover:scale-105 whitespace-nowrap py-1 px-2 rounded-xl text-xs font-semibold border-none ${isSelected ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
      >
        {tagName}
      </div>
    );
  });

  return (
    <div
      data-tour-id="tag-name"
      className={`fixed h-full z-40 ${isCollapsed ? "border-r w-10" : "w-80"} rounded-r-xl flex flex-col items-center shadow bg-gray-100 transition-[width] duration-500`}
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

export default Sidebar;
