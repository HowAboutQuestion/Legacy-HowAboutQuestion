/**
 * @fileoverview 질문 목록에서 중복되지 않는 고유 ID를 생성하는 유틸리티 함수
 */

/**
 * 주어진 questions 배열을 기준으로, 기존에 존재하지 않는 고유한 ID를 생성합니다.
 * ID는 'id-'로 시작하며 랜덤한 문자열을 붙입니다.
 *
 * @param {Array<Object>} questions - 기존 질문 객체 배열 (각 객체는 id 속성을 가질 수 있음)
 * @returns {string} 새롭게 생성된 고유 ID
 */
export const generateUniqueId = (questions) => {
  const generateRandomId = () => {
    return `id-${Math.random().toString(36).slice(2, 11)}`;
  };

  let newId;
  do {
    newId = generateRandomId();
  } while (
    Array.isArray(questions) &&
    questions.some((question) => question?.id === newId)
  );

  return newId;
};
