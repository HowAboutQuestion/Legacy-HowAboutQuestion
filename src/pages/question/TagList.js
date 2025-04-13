import React from 'react';

/**
 * 태그 목록 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Array} props.allTag - 모든 태그 목록
 * @param {Array} props.selectedTag - 선택된 태그 목록
 * @param {Function} props.onTagClick - 태그 클릭 핸들러
 * @returns {JSX.Element} 태그 목록 컴포넌트
 */
function TagList({ allTag, selectedTag, onTagClick }) {
  return (
    <div className="flex gap-2 py-2 w-full flex-wrap">
      {allTag.map((tagName, index) => {
        const isSelected = selectedTag.includes(tagName);
        
        return (
          <div
            onClick={() => onTagClick(tagName)}
            key={index}
            className={`cursor-pointer transition-transform transform hover:scale-105 whitespace-nowrap py-1 px-2 rounded-xl text-xs font-semibold border-none ${
              isSelected ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
            }`}
          >
            {tagName}
          </div>
        );
      })}
    </div>
  );
}

export default TagList;