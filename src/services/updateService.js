/**
 * @fileoverview 
 * 이 모듈은 Electron의 자동 업데이트 기능을 설정합니다.
 * - 자동 업데이트를 확인하고 다운로드 프로세스를 관리합니다.
 * - 다운로드 진행 상황을 표시하는 ProgressBar를 사용합니다.
 * - 업데이트가 완료되면 사용자에게 알림을 보내고 설치를 트리거합니다.
 * 
 */

import { autoUpdater } from 'electron-updater';
import ProgressBar from 'electron-progressbar';
import { dialog } from 'electron';

let progressBar;

/**
 * 애플리케이션의 자동 업데이트를 설정합니다.
 * 업데이트 확인, 다운로드 진행 상황, 완료 후 동작까지 핸들링합니다.
 * 
 * @param {import('electron').BrowserWindow} mainWindow - 메인 브라우저 창 인스턴스
 */
export function setupAutoUpdater(mainWindow) {
  autoUpdater.autoDownload = false;

  autoUpdater.on('checking-for-update', () => {
    console.log('업데이트 확인 중');
  });

  autoUpdater.on('update-available', () => {
    console.log('업데이트 버전 확인');

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

  autoUpdater.on('update-not-available', () => {
    console.log('업데이트 없음');
  });

  autoUpdater.once('download-progress', () => {
    console.log('설치 중');

    progressBar = new ProgressBar({
      text: '다운로드 중입니다...',
    });

    progressBar
      .on('completed', () => {
        console.log('설치 완료');
      })
      .on('aborted', () => {
        console.log('다운로드 중단');
      });
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('업데이트 완료');

    if (progressBar) {
      progressBar.setCompleted();
    }

    dialog.showMessageBox({
      type: 'info',
      title: 'Update',
      message: '새로운 버전이 다운로드 되었습니다. 다시 시작하시겠습니까?',
      buttons: ['예', '아니오'],
    }).then((result) => {
      const { response } = result;
      if (response === 0) {
        autoUpdater.quitAndInstall(false, true);
      }
    });
  });

  // 업데이트 체크 시작
  autoUpdater.checkForUpdates();
}
