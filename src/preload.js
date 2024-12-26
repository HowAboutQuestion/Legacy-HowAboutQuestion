const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveImage: async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const arrayBuffer = reader.result;
        ipcRenderer
          .invoke('save-image', { fileName: file.name, content: Buffer.from(arrayBuffer) })
          .then(resolve)
          .catch(reject);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  },

  updateQuestions: (questions) => {
    return ipcRenderer.invoke('update-questions', questions)
  }
});
