// main.js

// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  safeStorage,
  globalShortcut,
  Menu,
} = require("electron");
const path = require("path");

let window1;
//let window2;

const createWindows = () => {
  // Create the first browser window.
  window1 = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  window1.loadFile("./read-write-csv-example/index.html");

  // // Create a second window
  // window2 = new BrowserWindow({
  //   x: 50,
  //   y: 50,
  //   width: 800,
  //   height: 600,
  //   webPreferences: {
  //     preload: path.join(__dirname, "preload.js"),
  //   },
  // });

  // // and load the index.html of the app.
  // window2.loadFile(
  //   "./turn.js Example/Responsive Example - KK Edits/index.html"
  // );

  // Shortcuts
  globalShortcut.register("Control+Shift+I", () => {
    window1.webContents.toggleDevTools();
  });

  globalShortcut.register("Control+R", () => {
    window1.webContents.reload();
  });

  globalShortcut.register("Esc", () => {
    app.quit();
  });

  // No application (top bar) menu
  Menu.setApplicationMenu(null);

  // Open the DevTools.
  window1.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindows();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindows();
  });

  // Test safeStorage
  // console.log(safeStorage.isEncryptionAvailable());
  // console.log(safeStorage.encryptString("hello"));
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Testing reloading one window but not the other
//setInterval(() => window2.reload(), 1000);
