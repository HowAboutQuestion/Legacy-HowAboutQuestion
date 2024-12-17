const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // React 개발 서버가 실행 중이라면 localhost:3000에서 React 앱을 로드
  //mainWindow.loadURL('http://localhost:3000'); // 개발 중이라면 이 라인 주석 처리

  // 빌드 후 index.html 파일 경로
  mainWindow.setMenu(null);
  
  mainWindow.loadURL('http://localhost:3000'); // 개발 서버에서 실행 중인 React 앱 로드


  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
