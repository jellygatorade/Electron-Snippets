const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("analyticsHandler", {
  save: (data) => ipcRenderer.invoke("saveDataCSV", data),
  startTimer: (identity) => ipcRenderer.invoke("startAnalyticsTimer", identity),
  stopTimer: (identity) => ipcRenderer.invoke("stopAnalyticsTimer", identity),
  stopAllTimers: () => ipcRenderer.invoke("stopAllAnalyticsTimers"),
  clearAllTimers: () => ipcRenderer.invoke("clearAllAnalyticsTimers"),
  stopAllTimersOfType: (action) =>
    ipcRenderer.invoke("stopAllAnalyticsTimersOfType", action),
});
