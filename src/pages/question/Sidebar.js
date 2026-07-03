import React, { useRef, useEffect } from 'react';

function Sidebar({ isCollapsed, allTag, selectedTag, onTagClick, setIsCollapsed }) {

  // 렌더 횟수 추적
  const renderCount = useRef(0);
  renderCount.current += 1;

  // 이전 props 추적 (어떤 prop이 바뀌어서 리렌더됐는지)
  const prevProps = useRef({ isCollapsed, allTag, selectedTag, onTagClick, setIsCollapsed });
  useEffect(() => {
    const prev = prevProps.current;
    const changed = [];
    if (prev.isCollapsed !== isCollapsed) changed.push(`isCollapsed: ${prev.isCollapsed} → ${isCollapsed}`);
    if (prev.allTag !== allTag) changed.push(`allTag (ref 변경, 길이: ${prev.allTag.length} → ${allTag.length})`);
    if (prev.selectedTag !== selectedTag) changed.push(`selectedTag (ref 변경, 길이: ${prev.selectedTag.length} → ${selectedTag.length})`);
    if (prev.onTagClick !== onTagClick) changed.push(`onTagClick (함수 ref 변경)`);
    if (prev.setIsCollapsed !== setIsCollapsed) changed.push(`setIsCollapsed (함수 ref 변경)`);

    if (changed.length > 0) {
      console.log(`[Sidebar] 리렌더 #${renderCount.current} — 변경된 props:`, changed);
    } else {
      console.log(`[Sidebar] 리렌더 #${renderCount.current} — props 변경 없음 (부모 리렌더 전파)`);
    }
    prevProps.current = { isCollapsed, allTag, selectedTag, onTagClick, setIsCollapsed };
  });

  // 사이드바 열기/닫기 시 메모리 스냅샷
  const prevCollapsed = useRef(isCollapsed);
  useEffect(() => {
    if (prevCollapsed.current === isCollapsed) return;
    prevCollapsed.current = isCollapsed;

    const mem = performance.memory;
    const action = isCollapsed ? "닫힘" : "열림";
    console.log(`[Sidebar] ${action} — allTag: ${allTag.length}개`);
    if (mem) {
      console.log(`[Sidebar] memory — used: ${(mem.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB / total: ${(mem.totalJSHeapSize / 1024 / 1024).toFixed(1)}MB`);
    }
  }, [isCollapsed, allTag.length]);

  // allTagItems 계산 시간
  console.time("[Sidebar] allTagItems 계산");
  const allTagItems = allTag.map((tagName, index) => {
    const isSelected = selectedTag.includes(tagName);

    return (
      <div
        onClick={() => onTagClick(tagName)}
        key={index}
        className={`cursor-pointer transition-transform transform hover:scale-105 whitespace-nowrap py-1 px-2 rounded-xl text-xs font-semibold border-none ${isSelected ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
          }`}
      >
        {tagName}
      </div>
    );
  });
  console.timeEnd("[Sidebar] allTagItems 계산");
  console.log(`[Sidebar] allTag: ${allTag.length}개, selectedTag: ${selectedTag.length}개`);

  // 애니메이션 종료 시점 측정
  const sidebarRef = useRef(null);
  const animStartTime = useRef(null);

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    const onTransitionStart = (e) => {
      if (e.propertyName !== "width") return;
      animStartTime.current = performance.now();
    };
    const onTransitionEnd = (e) => {
      if (e.propertyName !== "width") return;
      if (animStartTime.current !== null) {
        const elapsed = (performance.now() - animStartTime.current).toFixed(1);
        const state = isCollapsed ? "닫힘" : "열림";
        console.log(`[Sidebar] 애니메이션 완료 (${state}): ${elapsed}ms`);
        animStartTime.current = null;
      }
    };

    el.addEventListener("transitionstart", onTransitionStart);
    el.addEventListener("transitionend", onTransitionEnd);
    return () => {
      el.removeEventListener("transitionstart", onTransitionStart);
      el.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [isCollapsed]);

  return (
    <div
    ref={sidebarRef}
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