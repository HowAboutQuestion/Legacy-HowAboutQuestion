const { autoUpdater } = require('electron-updater');
const ProgressBar = require('electron-progressbar');
const { dialog } = require('electron');

let progressBar;

function setupAutoUpdater(mainWindow) {
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

      if (response === 0) autoUpdater.downloadUpdate();
    });
  });

  autoUpdater.on('update-not-available', () => {
    console.log('업데이트 불가');
  });

  autoUpdater.once('download-progress', () => {
    console.log('설치 중');

    progressBar = new ProgressBar({
      text: 'Download 합니다.',
    });

    progressBar
      .on('completed', () => {
        console.log('설치 완료');
      })
      .on('aborted', () => {
        console.log('aborted');
      });
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('업데이트 완료');

    progressBar.setCompleted();

    dialog.showMessageBox({
      type: 'info',
      title: 'Update',
      message: '새로운 버전이 다운로드 되었습니다. 다시 시작하시겠습니까?',
      buttons: ['예', '아니오'],
    }).then((result) => {
      const { response } = result;

      if (response === 0) autoUpdater.quitAndInstall(false, true);
    });
  });

  // 업데이트 체크 시작
  autoUpdater.checkForUpdates();
}

module.exports = {
  setupAutoUpdater
};