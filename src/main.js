import dotenv from 'dotenv';
import { app } from 'electron';
import { updateRecommendDates } from './controllers/questionController.js';
import { createWindow, getMainWindow } from './services/windowService.js';
import { setupAutoUpdater } from './services/updateService.js';
import { setupIpcHandlers } from './handlers/ipcHandlers.js';

dotenv.config();

// IPC 핸들러 설정
setupIpcHandlers();

// 앱 시작 시 처리
app.on('ready', () => {
  updateRecommendDates();
  createWindow();
  setupAutoUpdater();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (getMainWindow() === null) {
    createWindow();
  }
});
