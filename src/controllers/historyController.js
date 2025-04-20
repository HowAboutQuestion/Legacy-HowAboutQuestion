const fs = require('fs');
const Papa = require('papaparse');
const { historyCsvPath } = require('../config/paths');
const { getTodayDate, parseISO, isValid } = require('../utils/dateUtils');

// history.csv를 업데이트하는 함수
function updateHistory(isCorrect) {
  try {
    const today = getTodayDate();

    if (!fs.existsSync(historyCsvPath)) {
      const initialData = [{
        date: today,
        solvedCount: 1,
        correctCount: isCorrect ? 1 : 0,
        correctRate: isCorrect ? 100.0 : 0.0
      }];
      const csv = Papa.unparse(initialData);
      fs.writeFileSync(historyCsvPath, csv, 'utf-8');
      console.log(`history.csv에 새로운 날짜(${today}) 기록이 추가되었습니다.`);
      return { success: true, message: '새로운 기록이 추가되었습니다.' };
    }

    const csvFile = fs.readFileSync(historyCsvPath, 'utf-8');
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });

    let rowFound = false;
    const updatedData = parsed.data.map(row => {
      if (row.date === today) {
        row.solvedCount = parseInt(row.solvedCount, 10) + 1;
        if (isCorrect) {
          row.correctCount = parseInt(row.correctCount, 10) + 1;
        }
        row.correctRate = ((row.correctCount / row.solvedCount) * 100).toFixed(2);
        rowFound = true;
      }
      return row;
    });

    if (!rowFound) {
      updatedData.push({
        date: today,
        solvedCount: 1,
        correctCount: isCorrect ? 1 : 0,
        correctRate: isCorrect ? '100.00' : '0.00'
      });
    }

    const newCsv = Papa.unparse(updatedData);
    fs.writeFileSync(historyCsvPath, newCsv, 'utf-8');

    console.log(`history.csv의 ${today} 날짜 기록이 업데이트되었습니다.`);
    return { success: true, message: 'history.csv가 성공적으로 업데이트되었습니다.' };
  } catch (error) {
    console.error('history.csv 업데이트 중 오류 발생:', error);
    return { success: false, message: error.message };
  }
}

function readHistoryCSV() {
  try {
    if (!fs.existsSync(historyCsvPath)) {
      console.error(`readHistoryCSV CSV 파일을 찾을 수 없습니다: ${historyCsvPath}`);
      return { success: false, message: 'CSV 파일을 찾을 수 없습니다.' };
    }

    const csvFile = fs.readFileSync(historyCsvPath, 'utf-8');
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
    const historyData = parsed.data
      .map(row => {
        const date = parseISO(row.date);
        if (!isValid(date)) return null;
        const solvedCount = Number(row.solvedCount);
        const correctCount = Number(row.correctCount);
        const correctRate = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;
        return { date, solvedCount, correctCount, correctRate };
      })
      .filter(row => row !== null);

    console.log("history.csv read success")
    console.log(historyData);
    return { success: true, historyData, message: 'history 읽기 성공' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'history 읽기 실패' };
  }
}

module.exports = {
  updateHistory,
  readHistoryCSV
};