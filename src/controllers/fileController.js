const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const extract = require('extract-zip');
const os = require('os');
const Papa = require('papaparse');
const { imageDir, tempDir, userDataPath } = require('../config/paths');
const { generateUniqueId } = require('../utils/idUtils');
const { getTodayDate } = require('../utils/dateUtils');

// 이미지 저장
async function saveImage(fileName, content) {
  try {
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir); // 디렉토리가 없으면 생성
    }
    const filePath = path.join(imageDir, fileName);
    fs.writeFileSync(filePath, content); // 파일 저장

    return {
      success: true,
      path: '/images/' + fileName, // 경로
      filename: fileName, // 파일 이름
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// 이미지 삭제
async function deleteImage(imgPath) {
  try {
    const imageFullPath = path.join(userDataPath, imgPath);

    if (fs.existsSync(imageFullPath)) {
      fs.unlinkSync(imageFullPath); // 파일 삭제
      return { success: true, message: `Deleted: ${imageFullPath}` };
    } else {
      return { success: false, message: `File not found: ${imageFullPath}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// .zip 내보내기
async function exportQuestions(questions, savePath) {
  if (!savePath) return { success: false, message: 'No file selected' };

  try {
    // Create temp CSV file
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const csvPath = path.join(tempDir, 'questions.csv');
    
    const csvContent = Papa.unparse(
      questions.map(question => {
        const { id, checked, ...rest } = question;
        return rest;
      })
    );
    
    fs.writeFileSync(csvPath, csvContent, 'utf-8');

    // Create ZIP file
    const output = fs.createWriteStream(savePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => console.log(`ZIP file created: ${savePath}`));
    archive.on('error', (err) => { throw err; });

    archive.pipe(output);
    archive.file(csvPath, { name: 'questions.csv' });

    for (const question of questions) {
      if (question.img) {
        const imgPath = path.join(userDataPath, question.img);

        if (fs.existsSync(imgPath)) {
          archive.file(imgPath, { name: `images/${path.basename(imgPath)}` });
        } else {
          console.warn(`Image not found: ${imgPath}`);
        }
      }
    }

    await archive.finalize();
    fs.rmSync(tempDir, { recursive: true, force: true });

    return { success: true, path: savePath };
  } catch (error) {
    console.error('Error exporting questions:', error);
    return { success: false, message: error.message };
  }
}

// .zip 읽기
async function extractZip(fileName, content) {
  const tempDir = path.join(os.tmpdir(), 'uploadedZip');
  let result;
  
  try {
    // 임시 디렉토리 생성
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // zip 파일 생성
    const zipFilePath = path.join(tempDir, fileName);
    fs.writeFileSync(zipFilePath, content);

    // 압축 해제
    await extract(zipFilePath, { dir: tempDir });

    // 이미지 저장 디렉토리 생성
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    let csvFilePath = null;
    const questions = [];

    // 재귀적으로 디렉토리 탐색
    const traverseDirectory = (dir) => {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
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
      const today = getTodayDate();

      // PapaParse로 CSV 파싱
      const { data } = Papa.parse(csvData, {
        header: true, 
        skipEmptyLines: true,
      });

      // CSV 데이터를 questions 배열에 매핑
      data.forEach(item => {
        const tags = item.tag ? item.tag.split(',').map(tag => tag.trim()) : [];
        tags.forEach(tag => tagSet.add(tag));

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
          description: item.description || '',
          solveddate: null,
          tag: tags,
          id: generateUniqueId(),
        });
      });
    } else {
      throw new Error('CSV 파일을 찾을 수 없습니다.');
    }

    // 결과 반환
    result = { success: true, questions, csvFile: csvFilePath };
  } catch (error) {
    result = { success: false, error: error.message };
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
  
  return result;
}

module.exports = {
  saveImage,
  deleteImage,
  exportQuestions,
  extractZip
};