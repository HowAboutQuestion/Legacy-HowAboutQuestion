/**
 * @fileoverview 
 * 이 모듈은 Electron의 자동 업데이트 기능을 설정합니다.
 * - 자동 업데이트를 확인하고 다운로드 프로세스를 관리합니다.
 * - 다운로드 진행 상황을 표시하는 ProgressBar를 사용합니다.
 * - 업데이트가 완료되면 사용자에게 알림을 보내고 설치를 트리거합니다.
 * 
 * @module updateService
 */

import ProgressBar from 'electron-progressbar';
import { app, dialog } from 'electron';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import log from 'electron-log';
import fs from 'fs';
import path from 'path';
import { userDataPath } from '../config/paths.js';

const pendingUpdateFilePath = path.join(userDataPath, 'pending-update.json');

log.transports.file.level = 'info';
autoUpdater.logger = log;

let progressBar;

function checkPreviousUpdateResult() {
  if (!fs.existsSync(pendingUpdateFilePath)) {
    return;
  }

  try {
    const { expectedVersion } = JSON.parse(fs.readFileSync(pendingUpdateFilePath, 'utf-8'));
    const currentVersion = app.getVersion();

    if (expectedVersion && expectedVersion !== currentVersion) {
      log.warn(`Update to ${expectedVersion} appears to have failed; running version is ${currentVersion}`);
      dialog.showMessageBox({
        type: 'warning',
        title: 'Update',
        message: `업데이트(${expectedVersion}) 설치에 실패한 것으로 보입니다. 현재 버전: ${currentVersion}.\n문제가 반복되면 다운로드된 설치 파일을 직접 실행해주세요.`,
        buttons: ['확인'],
      });
    } else {
      log.info(`Update to ${expectedVersion} succeeded.`);
    }
  } catch (error) {
    log.error('Failed to read pending update marker:', error);
  } finally {
    fs.unlinkSync(pendingUpdateFilePath);
  }
}

/**
 * 애플리케이션의 자동 업데이트를 설정합니다.
 * 업데이트 확인, 다운로드 진행 상황, 완료 후 동작까지 핸들링합니다.
 *
 * @param {import('electron').BrowserWindow} mainWindow - 메인 브라우저 창 인스턴스
 */
export function setupAutoUpdater(mainWindow) {
  autoUpdater.autoDownload = false;
  // 사용자 동의 없이 앱 종료 시 조용히(무-UI) 재설치가 시도되는 것을 막는다.
  autoUpdater.autoInstallOnAppQuit = false;

  checkPreviousUpdateResult();

  autoUpdater.on('checking-for-update', () => log.info('Checking for update'));

  autoUpdater.on('update-available', (info) => {
    log.info(`Update available: ${info.version}`);
    dialog.showMessageBox({
      type: 'info',
      title: 'Update',
      message: '새로운 버전이 확인되었습니다. 설치 파일을 다운로드 하시겠습니까?',
      buttons: ['지금 설치', '나중에 설치'],
    }).then((result) => {
      const { response } = result;
      if (response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  autoUpdater.on('update-not-available', () => log.info('No update available'));

  autoUpdater.once('download-progress', () => {
    progressBar = new ProgressBar({
      text: '다운로드 중입니다...',
    });

    progressBar
      .on('completed', () => {})
      .on('aborted', () => {});
  });

  autoUpdater.on('update-downloaded', (info) => {
    if (progressBar) {
      progressBar.setCompleted();
    }
    log.info(`Update downloaded: ${info.version}`);

    dialog.showMessageBox({
      type: 'info',
      title: 'Update',
      message: '새로운 버전이 다운로드 되었습니다. 다시 시작하시겠습니까?',
      buttons: ['예', '아니오'],
    }).then((result) => {
      const { response } = result;
      if (response === 0) {
        try {
          fs.writeFileSync(pendingUpdateFilePath, JSON.stringify({
            expectedVersion: info.version,
            updatedAt: Date.now(),
          }));
        } catch (error) {
          log.error('Failed to write pending update marker:', error);
        }
        autoUpdater.quitAndInstall(false, true);
      }
    });
  });

  autoUpdater.on('error', (error) => {
    log.error('AutoUpdater error:', error);
    dialog.showMessageBox({
      type: 'error',
      title: 'Update',
      message: `업데이트 중 오류가 발생했습니다: ${error?.message || error}`,
      buttons: ['확인'],
    });
  });

  // 업데이트 체크 시작
  autoUpdater.checkForUpdates();
}
