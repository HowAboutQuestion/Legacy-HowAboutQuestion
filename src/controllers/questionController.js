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


export function readQuestionsCSV() {
  try {
    if (!existsSync(questionsCsvPath)) {
      console.error(`cannot find questions.csv file: ${questionsCsvPath}`);
      return { success: false, message: 'CSV 파일을 찾을 수 없습니다.' };
    }

    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    let questions = [];
    const tagSet = new Set();
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
      },
    });

    if (needsMigration) {
      const migratedCsv = Papa.unparse(
        questions.map(({ checked, ...rest }) => ({
          ...rest,
          tag: Array.isArray(rest.tag) ? rest.tag.join(',') : rest.tag,
        }))
      );
      writeFileSync(questionsCsvPath, migratedCsv, 'utf-8');
    }

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

export function initQuestions() {
  try {
    if (!existsSync(questionsCsvPath)) {
      return { success: false, message: 'CSV 파일을 찾을 수 없습니다.' };
    }

    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    const { data } = Papa.parse(csvFile, { header: true, skipEmptyLines: true });

    const today = getTodayDate();
    const todayDate = parseISO(today);
    let needsWrite = false;
    const existingIds = new Set();

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

    if (needsWrite) {
      writeFileSync(questionsCsvPath, Papa.unparse(updatedRows), 'utf-8');
    }

    const tagSet = new Set();
    const questions = updatedRows.map(row => {
      const tags = row.tag ? row.tag.split(',').map(t => t.trim()) : [];
      tags.forEach(t => tagSet.add(t));
      return { ...row, description: row.description || '', tag: tags, checked: false };
    });

    return { success: true, allTag: [...tagSet], questions };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'initQuestions fail' };
  }
}

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

      if (!isValid(recommendDate) || !isValid(updateDate)) return row;

      if (isBefore(startOfDay(recommendDate), todayDate)) {
        if (isAfter(startOfDay(updateDate), todayDate)) {
          return { ...row, recommenddate: format(updateDate, 'yyyy-MM-dd') };
        } else {
          return { ...row, recommenddate: today };
        }
      }

      return row;
    });

    writeFileSync(questionsCsvPath, Papa.unparse(updatedData), 'utf-8');
    return { success: true, message: 'recommenddate가 성공적으로 업데이트되었습니다.' };
  } catch (error) {
    console.error('Error updating recommend dates:', error);
    return { success: false, message: 'recommenddate 업데이트에 실패했습니다.' };
  }
}

export function updateQuestionsFile(questions) {
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

export function writeQuestionsCSVFile(csv) {
  try {
    writeFileSync(questionsCsvPath, csv, 'utf-8');
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
    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
    parsed.data.unshift(serializeRow(question));
    writeFileSync(questionsCsvPath, Papa.unparse(parsed.data), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('appendQuestionToCSV error:', error);
    return { success: false, message: error.message };
  }
}

export function updateQuestionInCSV(partialQuestion) {
  try {
    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
    const incoming = serializeRow(partialQuestion);
    parsed.data = parsed.data.map(row =>
      row.id === partialQuestion.id ? { ...row, ...incoming } : row
    );
    writeFileSync(questionsCsvPath, Papa.unparse(parsed.data), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('updateQuestionInCSV error:', error);
    return { success: false, message: error.message };
  }
}

export function deleteQuestionsFromCSV(ids) {
  try {
    const csvFile = readFileSync(questionsCsvPath, 'utf-8');
    const idSet = new Set(ids);
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
    parsed.data = parsed.data.filter(row => !idSet.has(row.id));
    writeFileSync(questionsCsvPath, Papa.unparse(parsed.data), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('deleteQuestionsFromCSV error:', error);
    return { success: false, message: error.message };
  }
}
