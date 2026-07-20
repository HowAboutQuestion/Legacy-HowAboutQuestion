import dotenv from 'dotenv';
import { app, shell, Menu } from 'electron';
import { createWindow, getMainWindow, applyNavigationPolicy } from './services/windowService.js';
import { setupAutoUpdater } from './services/updateService.js';
import { setupIpcHandlers } from './handlers/ipcHandlers.js';
import { getSettingFile } from './services/settingService.js';
import { trackEvent } from "./services/gaService.js";


dotenv.config();

// macOS 앱 메뉴 제거 (app ready 이전에 호출)
Menu.setApplicationMenu(null);

// IPC 핸들러 설정
setupIpcHandlers();

// 앱 시작 시 처리
app.on('ready', () => {
  createWindow();
  trackEvent("app_start");
  getSettingFile();
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

app.on("web-contents-created", (_event, contents) => {
  applyNavigationPolicy(contents);
});
