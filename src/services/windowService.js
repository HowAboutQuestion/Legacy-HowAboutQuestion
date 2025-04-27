/**
 * 이 모듈은 Electron 애플리케이션의 브라우저 창을 생성하고 관리하는 기능을 제공합니다.
 * - 메인 창의 크기, 최소 크기, 메뉴바 제거 등을 설정합니다.
 * - 빌드 환경에서 `index.html`을 로드하고, 개발 환경에서는 URL을 로드할 수 있습니다.
 * 
 * @module windowService
 */

import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

let mainWindow;

// ES6 모듈에서 현재 파일 경로를 얻기 위한 처리
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 애플리케이션의 브라우저 창을 생성하고 설정합니다.
 * - 창의 크기와 최소 크기를 설정하고, 메뉴바를 제거합니다.
 * - `index.html`을 로드하여 애플리케이션을 시작합니다.
 * 
 * @returns {BrowserWindow} 생성된 BrowserWindow 인스턴스
 */
export function createWindow() {
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

  // 빌드 환경에서 index.html 로드
  mainWindow.loadFile(path.join(__dirname, '../../build', 'index.html'));
  // 개발 환경에서 URL을 로드하려면 아래 주석을 활성화
  // mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('console-message', (_, level, message) => {
    console.log('[Renderer]', message);
  });

  return mainWindow;
}

/**
 * 현재 메인 창을 반환합니다.
 * 
 * @returns {BrowserWindow} 현재 메인 창 인스턴스
 */
export function getMainWindow() {
  return mainWindow;
}
