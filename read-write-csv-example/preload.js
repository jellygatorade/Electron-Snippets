const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("csvHandler", {
  save: (event, data) => ipcRenderer.invoke("saveDataCSV", data),
});
