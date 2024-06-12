const { ipcMain } = require("electron");

function initProcessor(window) {
  setInterval(() => {
    window.webContents.send("get-picture");
  }, 5000);

  ipcMain.handle("picture-blob", async (_event, pictureDataURL) => {
    console.log('at main', pictureDataURL);
  });
}

module.exports = { initProcessor };
