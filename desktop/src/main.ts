import {
    app,
    BrowserWindow,
    ipcMain
} from "electron";

import path from "node:path";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        frame: false,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadURL("http://localhost:4300");
}

ipcMain.on("window:minimize", () => {
    mainWindow?.minimize();
});

ipcMain.on("window:maximize", () => {
    if (!mainWindow) return;

    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on("window:close", () => {
    mainWindow?.close();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});