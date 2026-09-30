import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("desktopAPI", {
    minimize: () => ipcRenderer.send("window:minimize"),

    maximize: () => ipcRenderer.send("window:maximize"),

    close: () => ipcRenderer.send("window:close"),

    getCoreInfo: () =>
        ipcRenderer.invoke("core:get-info")
});
