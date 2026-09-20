const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('pkdDesktop',{
  about:()=>ipcRenderer.invoke('pkd:about'),
  onLock:(callback)=>{
    const listener=()=>callback();
    ipcRenderer.on('pkd:lock',listener);
    return ()=>ipcRenderer.removeListener('pkd:lock',listener);
  }
});
