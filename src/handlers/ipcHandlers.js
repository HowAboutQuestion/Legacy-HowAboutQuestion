const { ipcMain, dialog } = require('electron');
const { getMainWindow } = require('../services/windowService');
const { readQuestionsCSV, updateRecommendDates, updateQuestionsFile } = require('../controllers/questionController');
const { updateHistory, readHistoryCSV } = require('../controllers/historyController');
const { saveImage, deleteImage, exportQuestions, extractZip } = require('../controllers/fileController');
const { userDataPath } = require('../config/paths');

function setupIpcHandlers() {
    console.log("setupIpcHandlers called!");

    // 질문 관련 핸들러
    ipcMain.handle('read-questions-csv', () => readQuestionsCSV());
    ipcMain.handle('update-recommend-dates', () => updateRecommendDates());
    ipcMain.handle('update-questions-file', (event, questions) => updateQuestionsFile(questions));

    // 기록 관련 핸들러
    ipcMain.handle('read-history-csv', () => readHistoryCSV());
    ipcMain.handle('update-history', (event, { isCorrect }) => updateHistory(isCorrect));

    // 파일 관련 핸들러
    ipcMain.handle('save-image', (event, { fileName, content }) => saveImage(fileName, content));
    ipcMain.handle('delete-image', (event, { imgPath }) => deleteImage(imgPath));

    // 내보내기/가져오기 핸들러
    ipcMain.handle('export-questions', (event, questions) => {
        const savePath = dialog.showSaveDialogSync(getMainWindow(), {
            title: 'Export Questions as ZIP',
            defaultPath: 'questions.zip',
            filters: [{ name: 'ZIP Files', extensions: ['zip'] }],
        });

        return exportQuestions(questions, savePath);
    });

    ipcMain.handle('extract-zip', (event, { fileName, content }) => extractZip(fileName, content));

    // 경로 정보 핸들러
    ipcMain.handle('read-app-path', () => ({ appPath: userDataPath }));

}

module.exports = {
    setupIpcHandlers
};