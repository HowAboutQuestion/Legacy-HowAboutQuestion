/**
 * @fileoverview
 * 이 모듈은 questions CSV 파일을 읽고, 업데이트하고, 추천 날짜를 계산하는 함수들을 제공합니다. 
 * 이 파일은 문제 목록을 처리하고, 각 문제에 대해 추천 날짜를 업데이트하며, 문제 목록을 새로 저장하는 기능을 제공합니다.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import Papa from 'papaparse';
import { questionsCsvPath } from '../config/paths.js';
import { getTodayDate, parseISO, isValid, isBefore, isAfter, startOfDay, format } from '../utils/dateUtils.js';
import { generateUniqueId } from '../utils/idUtils.js';


/**
 * questions CSV 파일을 읽어 문제 목록과 모든 태그를 반환하는 함수입니다.
 * 
 * @returns {Object} - 성공 여부, 모든 태그 목록, 문제 목록 및 메시지를 포함한 객체.
 */
export function readQuestionsCSV() {
  console.log("readQuestionsCSV called!");

  try {
    if (!existsSync(questionsCsvPath)) {
      console.error(`cannot find questions.csv file: ${questionsCsvPath}`);
      return { success: false, message: 'CSV 파일을 찾을 수 없습니다.' };
    }

    console.time("[readQuestionsCSV] total (Main)");

    console.time("[readQuestionsCSV] readFileSync");
    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    console.timeEnd("[readQuestionsCSV] readFileSync");

    let questions = [];
    const tagSet = new Set();

    console.time("[readQuestionsCSV] Papa.parse+map");
    let needsMigration = false;
    const existingIds = new Set();

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        questions = result.data.map((item) => {
          item.description = item.description || '';
          if (item.tag) item.tag = item.tag.split(',').map(t => t.trim());
          else item.tag = [];

          item.tag.forEach(t => tagSet.add(t));

          if (!item.id) {
            let newId;
            do { newId = `id-${Math.random().toString(36).slice(2, 11)}`; }
            while (existingIds.has(newId));
            item.id = newId;
            needsMigration = true;
          }
          existingIds.add(item.id);
          item.checked = false;
          return item;
        });
        console.timeEnd("[readQuestionsCSV] Papa.parse+map");
      },
    });

    if (needsMigration) {
      console.log("[readQuestionsCSV] id 컬럼 마이그레이션 실행");
      const migratedCsv = Papa.unparse(
        questions.map(({ checked, ...rest }) => ({
          ...rest,
          tag: Array.isArray(rest.tag) ? rest.tag.join(',') : rest.tag,
        }))
      );
      writeFileSync(questionsCsvPath, migratedCsv, 'utf-8');
    }

    console.timeEnd("[readQuestionsCSV] total (Main)");
    console.log("questions read success");

    return {
      success: true,
      allTag: [...tagSet],
      questions: questions,
      message: 'questions 읽기 성공'
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'questions read fail' };
  }
}

/**
 * 앱 초기화용: CSV 읽기 + id 마이그레이션 + 추천날짜 갱신 + 쓰기를 한 번에 처리합니다.
 */
export function initQuestions() {
  try {
    if (!existsSync(questionsCsvPath)) {
      return { success: false, message: 'CSV 파일을 찾을 수 없습니다.' };
    }

    console.time("[initQuestions] total (Main)");

    console.time("[initQuestions] readFileSync");
    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    console.timeEnd("[initQuestions] readFileSync");

    console.time("[initQuestions] Papa.parse");
    const { data } = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
    console.timeEnd("[initQuestions] Papa.parse");

    const today = getTodayDate();
    const todayDate = parseISO(today);
    let needsWrite = false;
    const existingIds = new Set();

    console.time("[initQuestions] map+updateDates");
    const updatedRows = data.map(row => {
      if (!row.id) {
        let newId;
        do { newId = `id-${Math.random().toString(36).slice(2, 11)}`; }
        while (existingIds.has(newId));
        row = { ...row, id: newId };
        needsWrite = true;
      }
      existingIds.add(row.id);

      const recommendDate = parseISO(row.recommenddate);
      const updateDate = parseISO(row.update);

      if (isValid(recommendDate) && isValid(updateDate) && isBefore(startOfDay(recommendDate), todayDate)) {
        needsWrite = true;
        return {
          ...row,
          recommenddate: isAfter(startOfDay(updateDate), todayDate)
            ? format(updateDate, 'yyyy-MM-dd')
            : today,
        };
      }

      return row;
    });
    console.timeEnd("[initQuestions] map+updateDates");

    if (needsWrite) {
      console.time("[initQuestions] Papa.unparse+writeFileSync");
      writeFileSync(questionsCsvPath, Papa.unparse(updatedRows), 'utf-8');
      console.timeEnd("[initQuestions] Papa.unparse+writeFileSync");
    }

    console.time("[initQuestions] toQuestions");
    const tagSet = new Set();
    const questions = updatedRows.map(row => {
      const tags = row.tag ? row.tag.split(',').map(t => t.trim()) : [];
      tags.forEach(t => tagSet.add(t));
      return { ...row, description: row.description || '', tag: tags, checked: false };
    });
    console.timeEnd("[initQuestions] toQuestions");

    console.timeEnd("[initQuestions] total (Main)");
    console.log("initQuestions success");

    return { success: true, allTag: [...tagSet], questions };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'initQuestions fail' };
  }
}

/**
 * questions CSV 파일에서 추천 날짜를 업데이트하는 함수입니다.
 * 오늘 날짜를 기준으로 문제의 추천 날짜를 계산하여 업데이트합니다.
 *
 * @returns {Object} - 성공 여부와 메시지를 포함한 객체.
 */
export function updateRecommendDates() {
  try {
    if (!existsSync(questionsCsvPath)) {
      console.error(`CSV 파일을 찾을 수 없습니다: ${questionsCsvPath}`);
      return { success: false, message: 'CSV 파일을 찾을 수 없습니다.' };
    }

    console.time("[updateRecommendDates] total (Main)");

    console.time("[updateRecommendDates] readFileSync");
    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    console.timeEnd("[updateRecommendDates] readFileSync");

    console.time("[updateRecommendDates] Papa.parse");
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
    console.timeEnd("[updateRecommendDates] Papa.parse");

    const today = getTodayDate();
    const todayDate = parseISO(today);

    console.time("[updateRecommendDates] map");
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
    console.timeEnd("[updateRecommendDates] map");

    console.time("[updateRecommendDates] Papa.unparse+writeFileSync");
    const newCsv = Papa.unparse(updatedData);
    writeFileSync(questionsCsvPath, newCsv, 'utf-8');
    console.timeEnd("[updateRecommendDates] Papa.unparse+writeFileSync");

    console.timeEnd("[updateRecommendDates] total (Main)");
    console.log('recommenddate update success');
    return { success: true, message: 'recommenddate가 성공적으로 업데이트되었습니다.' };
  } catch (error) {
    console.error('Error updating recommend dates:', error);
    return { success: false, message: 'recommenddate 업데이트에 실패했습니다.' };
  }
}

/**
 * 문제 목록을 기반으로 questions CSV 파일을 업데이트하는 함수입니다.
 * 
 * @param {Array} questions - 업데이트할 문제 목록.
 * @returns {Object} - 성공 여부를 포함한 객체.
 */
export function updateQuestionsFile(questions) {
  console.log("updateQuestionsFile called!");

  try {
    console.time("[updateQuestionsFile] Papa.unparse+writeFileSync");
    const csvString = Papa.unparse(
      questions.map(question => {
        const { id, checked, ...rest } = question;
        return rest;
      })
    );
    writeFileSync(questionsCsvPath, csvString, 'utf-8');
    console.timeEnd("[updateQuestionsFile] Papa.unparse+writeFileSync");
    return { success: true };
  } catch (error) {
    console.error('CSV update error:', error);
    return { success: false, message: error.message };
  }
}

export function writeQuestionsCSVFile(csv) {
  console.log("writeQuestionsCSVFile called!");
  try {
    console.time("[writeQuestionsCSVFile] writeFileSync");
    writeFileSync(questionsCsvPath, csv, 'utf-8');
    console.timeEnd("[writeQuestionsCSVFile] writeFileSync");
    return { success: true };
  } catch (error) {
    console.error('CSV write error:', error);
    return { success: false, message: error.message };
  }
}

function serializeRow(question) {
  const { checked, ...rest } = question;
  return {
    ...rest,
    ...(Array.isArray(rest.tag) ? { tag: rest.tag.join(',') } : {}),
  };
}

export function appendQuestionToCSV(question) {
  try {
    console.time("[appendQuestionToCSV] readFileSync");
    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    console.timeEnd("[appendQuestionToCSV] readFileSync");

    console.time("[appendQuestionToCSV] Papa.parse+unshift");
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
    parsed.data.unshift(serializeRow(question));
    console.timeEnd("[appendQuestionToCSV] Papa.parse+unshift");

    console.time("[appendQuestionToCSV] Papa.unparse+writeFileSync");
    writeFileSync(questionsCsvPath, Papa.unparse(parsed.data), 'utf-8');
    console.timeEnd("[appendQuestionToCSV] Papa.unparse+writeFileSync");

    return { success: true };
  } catch (error) {
    console.error('appendQuestionToCSV error:', error);
    return { success: false, message: error.message };
  }
}

export function updateQuestionInCSV(partialQuestion) {
  try {
    console.time("[updateQuestionInCSV] readFileSync");
    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    console.timeEnd("[updateQuestionInCSV] readFileSync");

    console.time("[updateQuestionInCSV] Papa.parse+map");
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
    const incoming = serializeRow(partialQuestion);
    parsed.data = parsed.data.map(row =>
      row.id === partialQuestion.id ? { ...row, ...incoming } : row
    );
    console.timeEnd("[updateQuestionInCSV] Papa.parse+map");

    console.time("[updateQuestionInCSV] Papa.unparse+writeFileSync");
    writeFileSync(questionsCsvPath, Papa.unparse(parsed.data), 'utf-8');
    console.timeEnd("[updateQuestionInCSV] Papa.unparse+writeFileSync");

    return { success: true };
  } catch (error) {
    console.error('updateQuestionInCSV error:', error);
    return { success: false, message: error.message };
  }
}

export function deleteQuestionsFromCSV(ids) {
  try {
    console.time("[deleteQuestionsFromCSV] readFileSync");
    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    console.timeEnd("[deleteQuestionsFromCSV] readFileSync");

    console.time("[deleteQuestionsFromCSV] Papa.parse+filter");
    const idSet = new Set(ids);
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
    parsed.data = parsed.data.filter(row => !idSet.has(row.id));
    console.timeEnd("[deleteQuestionsFromCSV] Papa.parse+filter");

    console.time("[deleteQuestionsFromCSV] Papa.unparse+writeFileSync");
    writeFileSync(questionsCsvPath, Papa.unparse(parsed.data), 'utf-8');
    console.timeEnd("[deleteQuestionsFromCSV] Papa.unparse+writeFileSync");

    console.log(`[deleteQuestionsFromCSV] ${ids.length}개 삭제 완료`);
    return { success: true };
  } catch (error) {
    console.error('deleteQuestionsFromCSV error:', error);
    return { success: false, message: error.message };
  }
}
