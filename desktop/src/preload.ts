import {
    contextBridge,
    ipcRenderer
} from 'electron';

contextBridge.exposeInMainWorld('desktop', {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),

    getCoreState: () => ipcRenderer.invoke('core:state')
});