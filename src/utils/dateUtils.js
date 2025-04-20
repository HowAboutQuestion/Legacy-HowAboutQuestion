const {
  parseISO,
  isValid,
  isBefore,
  isAfter,
  format,
  startOfDay,
  addDays,
} = require('date-fns');

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환 (한국 시간)
const getTodayDate = () => {
  const offset = 1000 * 60 * 60 * 9; // 한국 시간대 (UTC+9)
  return new Date(new Date().getTime() + offset).toISOString().split('T')[0];
};

const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

// 날짜 관련 유틸리티 함수 모음
module.exports = {
  getTodayDate,
  parseISO,
  isValid,
  isBefore,
  isAfter,
  format,
  startOfDay,
  addDays,
  formatDate
};