const fs = require('fs');
const Papa = require('papaparse');
const { questionsCsvPath } = require('../config/paths');
const { generateUniqueId } = require('../utils/idUtils');
const { getTodayDate, parseISO, isValid, isBefore, isAfter, startOfDay, format, addDays } = require('../utils/dateUtils');

// CSV 파일을 읽어서 데이터 처리하는 함수
function readQuestionsCSV() {
  try {
    if (!fs.existsSync(questionsCsvPath)) {
      console.error(`readQuestionsCSV CSV 파일을 찾을 수 없습니다: ${questionsCsvPath}`);
      return { success: false, message: 'CSV 파일을 찾을 수 없습니다.' };
    }

    const csvFile = fs.readFileSync(questionsCsvPath, 'utf-8');
    var questions = [];
    const tagSet = new Set();

    Papa.parse(csvFile, {
      header: true, 
      skipEmptyLines: true,
      complete: (result) => {
        questions = result.data.map((item) => {
          item.description = item.description || '';
          if (item.tag) item.tag = item.tag.split(',').map(t => t.trim());
          else item.tag = [];

          item.tag.forEach(t => tagSet.add(t)); // 태그 집합에 추가

          item.id = generateUniqueId();
          item.checked = false;
          return item;
        });
      },
    });

    return {
      success: true,
      allTag: [...tagSet],
      questions: questions,
      message: 'questions 읽기 성공'
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'questions 읽기 실패' };
  }
}

function updateRecommendDates() {
  try {
    if (!fs.existsSync(questionsCsvPath)) {
      console.error(`CSV 파일을 찾을 수 없습니다: ${questionsCsvPath}`);
      return { success: false, message: 'CSV 파일을 찾을 수 없습니다.' };
    }

    const csvFile = fs.readFileSync(questionsCsvPath, 'utf-8');
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });

    const today = getTodayDate();
    const todayDate = parseISO(today);

    const updatedData = parsed.data.map(row => {
      const recommendDate = parseISO(row.recommenddate);
      const updateDate = parseISO(row.update);

      if (!isValid(recommendDate) || !isValid(updateDate)) {
        return row;
      }

      if (isBefore(startOfDay(recommendDate), todayDate)) {
        if (isAfter(startOfDay(updateDate), todayDate)) {
          return { ...row, recommenddate: format(updateDate, 'yyyy-MM-dd') };
        } else {
          return { ...row, recommenddate: today };
        }
      }

      return row;
    });

    const newCsv = Papa.unparse(updatedData);
    fs.writeFileSync(questionsCsvPath, newCsv, 'utf-8');

    console.log('recommenddate가 성공적으로 업데이트되었습니다.');
    return { success: true, message: 'recommenddate가 성공적으로 업데이트되었습니다.' };
  } catch (error) {
    console.error('Error updating recommend dates:', error);
    return { success: false, message: 'recommenddate 업데이트에 실패했습니다.' };
  }
}

// CSV 파일 업데이트
function updateQuestionsFile(questions) {
  try {
    const csvString = Papa.unparse(
      questions.map(question => {
        const { id, checked, ...rest } = question;
        return rest;
      })
    );
    fs.writeFileSync(questionsCsvPath, csvString, 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('CSV 파일 업데이트 중 오류 발생:', error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  readQuestionsCSV,
  updateRecommendDates,
  // updateQuestion,  // 주석 처리
  updateQuestionsFile
};