/**
 * @fileoverview
 * 이 모듈은 Electron의 `ipcMain`을 사용하여 애플리케이션의 다양한 요청을 처리하는 IPC 핸들러들을 설정합니다.
 * - 파일 관련 입출력(IO) 작업을 처리
 * - 애플리케이션의 경로 정보를 반환
 */

import { ipcMain, dialog } from 'electron';
import { getMainWindow } from '../services/windowService.js';
import { readQuestionsCSV, updateRecommendDates, updateQuestionsFile } from '../controllers/questionController.js';
import { updateHistory, readHistoryCSV } from '../controllers/historyController.js';
import { saveImage, deleteImage, exportQuestions, extractZip } from '../controllers/fileController.js';
import { userDataPath } from '../config/paths.js';


/**
 * IPC 핸들러를 설정하는 함수
 * 이 함수는 애플리케이션에서 사용자가 요청할 수 있는 여러 가지 작업을 처리하는 IPC 핸들러들을 설정합니다.
 */
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

export { setupIpcHandlers };
