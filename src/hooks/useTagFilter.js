import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { questionsAtom, allTagAtom } from 'state/data';

/**
 * 태그 필터링을 처리하는 커스텀 훅
 * @returns {Object} 태그 필터링 관련 상태와 함수들
 */
const useTagFilter = () => {
  const questions = useRecoilValue(questionsAtom);
  const allTag = useRecoilValue(allTagAtom);
  const [selectedTag, setSelectedTag] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  
  // 태그 선택/해제 핸들러
  const handleTagClick = (tagName) => {
    setSelectedTag(prev => 
      prev.includes(tagName)
        ? prev.filter(tag => tag !== tagName) // 이미 선택된 경우 제거
        : [...prev, tagName] // 새로 선택된 경우 추가
    );
  };
  
  // 태그 필터링 이벤트
  useEffect(() => {
    if (selectedTag.length === 0) {
      // 선택된 태그가 없으면 모든 질문 표시
      setFilteredQuestions(questions.map((question, index) => ({ question, index })));
      return;
    }
    
    // 선택된 태그가 포함된 질문만 필터링
    const filtered = questions
      .map((question, index) => ({ question, index }))
      .filter(({ question }) => 
        question.tag.some(tag => selectedTag.includes(tag))
      );
    
    setFilteredQuestions(filtered);
  }, [questions, selectedTag]);
  
  return {
    selectedTag,
    filteredQuestions,
    allTag,
    handleTagClick,
    setSelectedTag
  };
};

export default useTagFilter;