/**
 * @fileoverview
 * 이 모듈은 questions CSV 파일을 읽고, 업데이트하고, 추천 날짜를 계산하는 함수들을 제공합니다. 
 * 이 파일은 문제 목록을 처리하고, 각 문제에 대해 추천 날짜를 업데이트하며, 문제 목록을 새로 저장하는 기능을 제공합니다.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import Papa from 'papaparse';
import { questionsCsvPath } from 'config/paths.js';
import { generateUniqueId, getTodayDate, parseISO, isValid, isBefore, isAfter, startOfDay, format } from 'utils';


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

    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    let questions = [];
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

    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
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
    writeFileSync(questionsCsvPath, newCsv, 'utf-8');

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
    const csvString = Papa.unparse(
      questions.map(question => {
        const { id, checked, ...rest } = question;
        return rest;
      })
    );
    writeFileSync(questionsCsvPath, csvString, 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('CSV update error:', error);
    return { success: false, message: error.message };
  }
}
