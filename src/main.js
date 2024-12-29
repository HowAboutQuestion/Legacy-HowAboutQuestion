require("dotenv").config();

const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');
const archiver = require("archiver");
const os = require('os');
const extract = require('extract-zip'); // 압축 해제 모듈
const questionsCsvPath = process.env.QUESTIONS_PATH; 


const { parseISO, isValid, isBefore, isAfter, format, startOfDay } = require('date-fns');

let mainWindow;

console.log("hihi", questionsCsvPath);

// CSV 파일을 읽어서 데이터 처리하는 함수
function readQuestionsCSV() {
  try {
//    const csvPath = "./data/question.csv";
    const csvPath = questionsCsvPath;

    if (!fs.existsSync(csvPath)) {
      console.error(`readQuestionsCSV CSV 파일을 찾을 수 없습니다: ${csvPath}`);
      return { success: false, message: 'CSV 파일을 찾을 수 없습니다.' };
    }

    const csvFile = fs.readFileSync(csvPath, 'utf-8');
    let questions = [];
    const tagSet = new Set();

    Papa.parse(csvFile, {
      header: true, // 첫 줄을 헤더로 사용
      skipEmptyLines: true, // 빈 줄 무시
      complete: (result) => {
        questions = result.data.map((item) => {
          if (item.__parsed_extra) {
            const extraTags = item.__parsed_extra.map((tag) => tag.trim());
            item.tag = [
              ...(item.tag ? item.tag.split(",").map((tag) => tag.trim()) : []),
              ...extraTags,
            ];
          }
          if (!item.tag) item.tag = [];
          else {
            item.tag = item.tag.split(",").map((tag) => tag.trim());
          }
          item.tag.forEach((tag) => tagSet.add(tag)); // 태그 집합에 추가
          delete item.__parsed_extra; // __parsed_extra 필드 제거

          return item;
        });
      },
    });

    return { success: true, allTag: [...tagSet], questions, message: 'questions 읽기 성공' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'questions 읽기 실패' };
  }
}


function updateRecommendDates() {
  try {
    const csvPath = questionsCsvPath;


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


function updateQuestions(questions) {
  try {  
    const csvPath = questionsCsvPath;
    // questions를 CSV 형식으로 변환
    const newCsv = Papa.unparse(questions, {
      header: true, // 첫 번째 줄에 헤더 포함
      columns: [
        "title", "type", "select1", "select2", "select3", "select4", "answer", 
        "img", "level", "date", "update", "recommenddate", "solveddate", "tag"
      ], // 헤더설정
    });


    fs.writeFileSync(csvPath, newCsv, 'utf-8');

    return { success: true, message: 'questions가 성공적으로 업데이트되었습니다.' };
  } catch (error) {
    console.error('Error updating questions:', error);
    return { success: false, message: 'questions 업데이트에 실패했습니다.' };
  }
}

// 메인 프로세스에서 CSV 파일만 수정
ipcMain.handle('update-questions-file', async (event, questions) => {
  const csvPath = questionsCsvPath;
  const csvString = Papa.unparse(questions); // questions를 CSV 형식으로 변환
  fs.writeFileSync(csvPath, csvString, 'utf-8'); // CSV 파일 덮어쓰기

  return { success: true };
});




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
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // 빌드 후 index.html 파일 경로
  //mainWindow.setMenu(null);
  
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


ipcMain.handle('save-image', async (event, { fileName, content }) => {
  try {
    const imageDir = path.join(__dirname, '../public/images'); // 이미지 저장 디렉토리
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir); // 디렉토리가 없으면 생성
    }
    const filePath = path.join(imageDir, fileName); // 파일 경로 생성
    fs.writeFileSync(filePath, content); // 파일 저장

    return { 
      success: true, 
      path: "/images/" + fileName, // 경로
      filename: fileName // 파일 이름
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
});

//.zip 내보내기
ipcMain.handle("export-questions", async (event, questions) => {
  const savePath = dialog.showSaveDialogSync(mainWindow, {
    title: "Export Questions as ZIP",
    defaultPath: "questions.zip",
    filters: [{ name: "ZIP Files", extensions: ["zip"] }],
  });

  if (!savePath) return { success: false, message: "No file selected" };

  try {
    // Create temp CSV file
    const tempDir = path.join(app.getPath("temp"), "questions_export");
    const csvPath = path.join(tempDir, "questions.csv");

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const csvContent = convertToCSV(questions);
    fs.writeFileSync(csvPath, csvContent, "utf-8");

    // Create ZIP file
    const output = fs.createWriteStream(savePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => console.log(`ZIP file created: ${savePath}`));
    archive.on("error", (err) => { throw err; });

    archive.pipe(output);
    archive.file(csvPath, { name: "questions.csv" });

    // Add images to ZIP
    const imagesDir = path.join(__dirname, "public", "images", "image");
    for (const question of questions) {
      if (question.img) {
        const imgPath = path.join(__dirname, question.img);
        if (fs.existsSync(imgPath)) {
          archive.file(imgPath, { name: `images/${path.basename(imgPath)}` });
        }
      }
    }

    await archive.finalize();
    fs.rmSync(tempDir, { recursive: true, force: true }); // Clean up temp files

    return { success: true, path: savePath };
  } catch (error) {
    console.error("Error exporting questions:", error);
    return { success: false, message: error.message };
  }
});

function convertToCSV(questions) {
  const headers = Object.keys(questions[0]);
  const rows = questions.map((q) => 
    headers.map((header) => `"${q[header] || ""}"`).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

//.zip 읽기
ipcMain.handle('extract-zip', async (event, { fileName, content }) => {
  try {
    // 임시 디렉토리 생성
    const tempDir = path.join(os.tmpdir(), 'uploadedZip');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // zip 파일 생성
    const zipFilePath = path.join(tempDir, fileName);
    fs.writeFileSync(zipFilePath, content);

    // 압축 해제
    await extract(zipFilePath, { dir: tempDir });

    // 이미지 저장 디렉토리 생성
    const imageDir = path.join(__dirname, '../public/images');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    let csvFilePath = null;
    const questions = [];

    // 재귀적으로 디렉토리 탐색
    const traverseDirectory = (dir) => {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
          // 서브 디렉토리 탐색
          traverseDirectory(filePath);
        } else if (file.endsWith('.csv')) {
          // CSV 파일 발견
          csvFilePath = filePath;
        } else if (/\.(png|jpg|jpeg|gif)$/i.test(file)) {
          // 이미지 파일 발견
          const destPath = path.join(imageDir, file);
          fs.copyFileSync(filePath, destPath);
        }
      });
    };

    // 디렉토리 탐색
    traverseDirectory(tempDir);

    // CSV 파일 파싱
    if (csvFilePath) {
      const csvData = fs.readFileSync(csvFilePath, 'utf-8');
      const tagSet = new Set();
      const today = new Date().toISOString().split('T')[0];

      // PapaParse로 CSV 파싱
      const { data } = Papa.parse(csvData, {
        header: true, // 첫 줄을 헤더로 사용
        skipEmptyLines: true, // 빈 줄 무시
      });

      // CSV 데이터를 questions 배열에 매핑
      data.forEach((item) => {
        const tags = item.tag
          ? item.tag.split(',').map((tag) => tag.trim())
          : [];
        tags.forEach((tag) => tagSet.add(tag));

        questions.push({
          title: item.title || '',
          type: item.type || '',
          select1: item.select1 || '',
          select2: item.select2 || '',
          select3: item.select3 || '',
          select4: item.select4 || '',
          answer: item.answer || '',
          img: item.img || '',
          level: 0,
          date: today,
          recommenddate: today,
          update: today,
          solveddate: null,
          tag: tags,
        });
      });
    } else {
      throw new Error('CSV 파일을 찾을 수 없습니다.');
    }

    // 결과 반환
    return { success: true, questions, csvFile: csvFilePath };

  } catch (error) {
    return { success: false, error: error.message };
  }
});


// `readQuestionsCSV` 함수 호출 시 결과를 React로 보내는 IPC 핸들러 설정
ipcMain.handle('read-questions-csv', () => readQuestionsCSV());

