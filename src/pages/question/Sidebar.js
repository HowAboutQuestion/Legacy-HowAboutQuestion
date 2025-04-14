import React from 'react';
import TagList from './TagList';

/**
 * 사이드바 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {boolean} props.isCollapsed - 사이드바 접힘 상태
 * @param {Function} props.onToggle - 사이드바 토글 핸들러
 * @param {Array} props.allTag - 모든 태그 목록
 * @param {Array} props.selectedTag - 선택된 태그 목록
 * @param {Function} props.onTagClick - 태그 클릭 핸들러
 * @returns {JSX.Element} 사이드바 컴포넌트
 */
function Sidebar({ isCollapsed, onToggle, allTag, selectedTag, onTagClick }) {
  return (

    <>
      <div
        className="cursor-pointer text-gray-400 w-full text-right p-2"
        onClick={onToggle}
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

      <div className="hidden w-full p-5">
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
          <TagList
            allTag={allTag}
            selectedTag={selectedTag}
            onTagClick={onTagClick}
          />
        </div>
      )}
    </>
  );
}

export default Sidebar;