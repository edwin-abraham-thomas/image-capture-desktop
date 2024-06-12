const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("api", {
  onGetPicture: (callback) =>
    ipcRenderer.on("get-picture", (_event, value) => callback(value)),

  processPictureBlob: async (pictureDataURL) => {
    await ipcRenderer.invoke("picture-blob", pictureDataURL);
  },
});
