/**
 * @fileoverview
 * 이 모듈은 history CSV 파일을 읽고 업데이트하는 함수들을 제공합니다.
 * 이 파일은 퀴즈 시도에 대한 통계(문제 풀이 수, 정답 수, 정답률)를 매일 기록합니다.
 * CSV 파일은 존재하지 않으면 새로 생성하고, 존재하면 기존 데이터를 업데이트합니다.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import Papa from 'papaparse';
import { historyCsvPath } from '../config/paths.js';
import { parseISO, isValid, getTodayDate } from '../utils/dateUtils.js';


export function updateHistory(isCorrect) {
  try {
    const today = getTodayDate();

    if (!existsSync(historyCsvPath)) {
      const initialData = [{
        date: today,
        solvedCount: 1,
        correctCount: isCorrect ? 1 : 0,
        correctRate: isCorrect ? 100.0 : 0.0
      }];
      writeFileSync(historyCsvPath, Papa.unparse(initialData), 'utf-8');
      return { success: true, message: '새로운 기록이 추가되었습니다.' };
    }

    const csvFile = readFileSync(historyCsvPath, 'utf-8');
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

    writeFileSync(historyCsvPath, Papa.unparse(updatedData), 'utf-8');
    return { success: true, message: 'history.csv가 성공적으로 업데이트되었습니다.' };
  } catch (error) {
    console.error('history.csv 업데이트 중 오류 발생:', error);
    return { success: false, message: error.message };
  }
}

export function readHistoryCSV() {
  try {
    if (!existsSync(historyCsvPath)) {
      console.error(`readHistoryCSV CSV 파일을 찾을 수 없습니다: ${historyCsvPath}`);
      return { success: false, message: 'CSV 파일을 찾을 수 없습니다.' };
    }

    const csvFile = readFileSync(historyCsvPath, 'utf-8');
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

    return { success: true, historyData, message: 'history 읽기 성공' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'history 읽기 실패' };
  }
}
