const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("analyticsHandler", {
  save: (data) => ipcRenderer.invoke("saveDataCSV", data),
  startTimer: (identity) => ipcRenderer.invoke("startAnalyticsTimer", identity),
  stopTimer: (identity) => ipcRenderer.invoke("stopAnalyticsTimer", identity),
});
