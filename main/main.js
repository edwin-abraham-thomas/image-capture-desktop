const { app, BrowserWindow } = require("electron/main");
const path = require("path");
const { initProcessor } = require("./payload-processor");

// const processor = require('./payload-processor.cjs');

// const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
// const __dirname = path.dirname(__filename); // get the name of the directory

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("./renderer/index.html");
  win.webContents.openDevTools();
  return win;
};

app.whenReady().then(() => {
  const win = createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      win = createWindow();
    }
  });
  initProcessor(win);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
