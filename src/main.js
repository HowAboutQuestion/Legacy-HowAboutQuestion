require('dotenv').config();
const { app } = require('electron');
const { updateRecommendDates } = require('./controllers/questionController');
const { createWindow, getMainWindow } = require('./services/windowService');
const { setupAutoUpdater } = require('./services/updateService');
const { setupIpcHandlers } = require('./handlers/ipcHandlers');

// IPC 핸들러 설정
setupIpcHandlers();


// 앱 시작 시 처리
app.on('ready', () => {
  const updateResult = updateRecommendDates();
  if (!updateResult.success) {
    // console.error

  }
  createWindow();
  setupAutoUpdater();
}
);


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


