const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

  updateHistory: (data) => ipcRenderer.invoke('update-history', data),
  saveImage: async (id, file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const arrayBuffer = reader.result;

        // 파일 확장자
        const fileExtension = file.name.split('.').pop();
        const fileName = `${id}.${fileExtension}`; // id 기반 파일 이름 생성



        ipcRenderer
          .invoke('save-image', {fileName, content: Buffer.from(arrayBuffer) })
          .then(resolve)
          .catch(reject);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  },

  deleteImage: (imgPath) => ipcRenderer.invoke('delete-image', imgPath),


  updateQuestion: async ({ title, type, isCorrect }) => {
    return ipcRenderer.invoke('update-question', { title, type, isCorrect });
  },

  updateQuestions: (questions) => {
    return ipcRenderer.invoke('update-questions-file', questions)
  },

  //.zip 내보내기
  exportQuestions: (questions) => ipcRenderer.invoke("export-questions", questions),

  //.zip 
  extractZip: async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const arrayBuffer = reader.result;
        ipcRenderer
          .invoke("extract-zip", {
            fileName: file.name, // 파일 이름 전달
            content: Buffer.from(arrayBuffer), // ArrayBuffer를 Buffer로 변환
          })
          .then(resolve)
          .catch(reject);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file); // File 객체를 ArrayBuffer로 읽기
    });
  },

  readQuestionsCSV: () => ipcRenderer.invoke('read-questions-csv'),
  readHistoryCSV: () => ipcRenderer.invoke('read-history-csv'), 


});
