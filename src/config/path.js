const path = require('path');
const { app } = require('electron');

// 경로 설정
const exeDir = path.dirname(app.getPath('exe'));
const userDataPath = app.getPath('userData');
const questionsCsvPath = path.join(userDataPath, 'questions.csv');
const historyCsvPath = path.join(userDataPath, 'history.csv');
const imageDir = path.join(userDataPath, 'images');
const tempDir = path.join(app.getPath('temp'), 'questions_export');

console.log('questionsCsvPath:', questionsCsvPath);
console.log('historyCsvPath:', historyCsvPath);

module.exports = {
  exeDir,
  userDataPath,
  questionsCsvPath,
  historyCsvPath,
  imageDir,
  tempDir
};