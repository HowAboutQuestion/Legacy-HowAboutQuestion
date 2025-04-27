import path from 'path';
import { app } from 'electron';

/**
 * @fileoverview
 * 이 모듈은 Electron 애플리케이션의 경로와 관련된 설정을 다룹니다.
 * 애플리케이션의 실행 디렉토리, 사용자 데이터 경로, CSV 파일 경로, 이미지 디렉토리 등을 설정하여
 * 다양한 경로를 가져올 수 있도록 합니다.
 */

const exeDir = path.dirname(app.getPath('exe'));
const userDataPath = app.getPath('userData');
const questionsCsvPath = path.join(userDataPath, 'questions.csv');
const historyCsvPath = path.join(userDataPath, 'history.csv');
const imageDir = path.join(userDataPath, 'images');
const tempDir = path.join(app.getPath('temp'), 'questions_export');

console.log('questionsCsvPath:', questionsCsvPath);
console.log('historyCsvPath:', historyCsvPath);

export {
  exeDir,
  userDataPath,
  questionsCsvPath,
  historyCsvPath,
  imageDir,
  tempDir
};
