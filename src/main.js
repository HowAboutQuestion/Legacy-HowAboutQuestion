const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');
const { parseISO, isValid, isBefore, isAfter, format } = require('date-fns');

let mainWindow;

function updateRecommendDates() {
  try {
    const csvPath = path.join(__dirname, 'public', 'question.csv'); // 절대 경로 사용 권장
    if (!fs.existsSync(csvPath)) {
      console.error(`CSV 파일을 찾을 수 없습니다: ${csvPath}`);
      return { success: false, message: 'CSV 파일을 찾을 수 없습니다.' };
    }

    const csvFile = fs.readFileSync(csvPath, 'utf-8');
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });

    const today = startOfDay(new Date()); // 오늘 날짜의 시작 (00:00:00)
    const formattedToday = format(today, 'yyyy-MM-dd'); // 오늘 날짜를 'yyyy-MM-dd' 형식으로 포맷

    const updatedData = parsed.data.map((row) => {
      const recommendDate = parseISO(row.recommenddate);
      const updateDate = parseISO(row.update);

      if (!isValid(recommendDate) || !isValid(updateDate)) {
        // 유효하지 않은 날짜는 건너뜁니다.
        return row;
      }

      const recommendDateStart = startOfDay(recommendDate);
      const updateDateStart = startOfDay(updateDate);

      if (isBefore(recommendDateStart, today)) { // recommenddate가 오늘보다 이전인 경우
        if (isAfter(updateDateStart, today)) { // updateDate가 오늘보다 이후인 경우
          return { ...row, recommenddate: format(updateDateStart, 'yyyy-MM-dd') };
        } else { // updateDate가 오늘보다 이전이거나 같은 경우
          return { ...row, recommenddate: formattedToday };
        }
      }

      // recommenddate가 오늘이거나 이후인 경우 변경하지 않음
      return row;
    });

    const newCsv = Papa.unparse(updatedData);
    fs.writeFileSync(csvPath, newCsv, 'utf-8');

    console.log('recommenddate가 성공적으로 업데이트되었습니다.');
    return { success: true, message: 'recommenddate가 성공적으로 업데이트되었습니다.' };
  } catch (error) {
    console.error('Error updating recommend dates:', error);
    return { success: false, message: 'recommenddate 업데이트에 실패했습니다.' };
  }
}


function createWindow() {
 // 먼저 recommenddate 업데이트 실행
 const updateResult = updateRecommendDates();
 if (!updateResult.success) {
   console.error(updateResult.message);
   // 필요에 따라 사용자에게 알림을 보내거나 애플리케이션을 종료할 수 있습니다.
 }

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


// IPC 핸들러 추가: 'update-recommend-dates' 이벤트 처리
ipcMain.handle('update-recommend-dates', async () => {
  return updateRecommendDates();
});

