import { 
  parseISO,
  isValid,
  isBefore,
  isAfter,
  format,
  startOfDay,
  addDays
} from 'date-fns';

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환합니다. (한국 시간 기준)
 * @returns {string} 한국 시간대 기준의 오늘 날짜 (예: '2025-04-26')
 */
export const getTodayDate = () => {
  const offset = 1000 * 60 * 60 * 9; // 한국 시간대 (UTC+9)
  return new Date(new Date().getTime() + offset).toISOString().split('T')[0];
};

/**
 * 주어진 날짜를 YYYY-MM-DD 형식으로 포맷합니다.
 * 날짜가 문자열일 경우 자동으로 파싱합니다.
 * 유효하지 않은 날짜일 경우 null을 반환합니다.
 *
 * @param {Date|string} date - 포맷할 날짜(Date 객체 또는 ISO 문자열)
 * @returns {string|null} 포맷된 날짜 문자열, 또는 유효하지 않은 경우 null
 */
export const formatDate = (date) => {
  const parsed = date instanceof Date ? date : parseISO(date);

  if (!isValid(parsed)) {
    console.error('Invalid date in formatDate:', date);
    return null;
  }

  return format(parsed, 'yyyy-MM-dd');
};

// 필요한 date-fns 함수들을 재노출
export {
  parseISO,
  isValid,
  isBefore,
  isAfter,
  format,
  startOfDay,
  addDays
};
