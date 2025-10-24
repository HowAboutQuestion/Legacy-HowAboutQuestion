import React from "react";

function PatchNotes130() {
  return (
    <div className="leading-relaxed text-sm">
      <h3 className="text-blue-600 font-bold mb-2">v1.2.5 (2025.10.24)</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>문제 관리 페이지의 검색 속도 개선</li>
        <li>태그 자동완성 중복 버그 수정</li>
        <li>대시보드 그래프 툴팁 표시 오류 해결</li>
      </ul>
      <p className="mt-3 text-gray-500">감사합니다.</p>
    </div>
  );
}

export default PatchNotes130;
