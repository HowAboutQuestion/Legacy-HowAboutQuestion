const { BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js'),
    },
  });

  // 메뉴바 제거
  mainWindow.setMenu(null);

  // 빌드 환경, index.html 
  mainWindow.loadFile(path.join(__dirname, '../../build', 'index.html'));
  // 개발 환경
  // mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('console-message', (_, level, message) => {
    console.log('[Renderer]', message);
  });
  
  return mainWindow;
}

module.exports = {
  createWindow,
  getMainWindow: () => mainWindow
};