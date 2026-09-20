const { app, BrowserWindow, Menu, protocol, net, session, shell, dialog, powerMonitor, ipcMain } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs/promises');

app.setName('PKD Compass');
const testing = !app.isPackaged && process.env.PKD_DESKTOP_TEST === '1';
app.setPath('userData', testing ? path.resolve(process.env.PKD_TEST_DATA_DIR) : path.join(app.getPath('appData'), 'PKD Compass'));
protocol.registerSchemesAsPrivileged([{scheme:'pkd',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true}}]);
app.enableSandbox();

const origin = 'pkd://compass';
const startURL = `${origin}/app/`;
const externalHosts = new Set(['pkdcure.org','www.kidney.org','www.niddk.nih.gov','pkdcompass.netlify.app']);
const csp = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self' blob:; frame-src blob:; object-src 'none'; base-uri 'none'; form-action 'none'";
let mainWindow;

function isAppURL(value){try{const u=new URL(value);return u.protocol==='pkd:'&&u.host==='compass'&&u.pathname.startsWith('/app/');}catch{return false;}}
function openExternal(value){
  try{const u=new URL(value);if(u.protocol==='https:'&&!u.username&&!u.password&&externalHosts.has(u.hostname))return shell.openExternal(u.href);}catch{}
}
function lock(){mainWindow?.webContents.send('pkd:lock');}
function createWindow(){
  mainWindow=new BrowserWindow({
    title:'PKD Compass',width:1140,height:850,minWidth:390,minHeight:600,show:false,backgroundColor:'#f7f9fa',
    icon:path.join(__dirname,'../desktop-dist/icon-512.png'),
    webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,allowRunningInsecureContent:false,webviewTag:false,spellcheck:false,devTools:!app.isPackaged}
  });
  mainWindow.once('ready-to-show',()=>mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(({url})=>{void openExternal(url);return {action:'deny'};});
  mainWindow.webContents.on('will-navigate',(event,url)=>{if(!isAppURL(url)){event.preventDefault();void openExternal(url);}});
  mainWindow.webContents.on('will-attach-webview',event=>event.preventDefault());
  mainWindow.webContents.on('render-process-gone',()=>{dialog.showErrorBox('PKD Compass needs to restart','The app closed unexpectedly. Your saved vault is still stored on this device. Reopen PKD Compass to unlock it.');});
  mainWindow.on('closed',()=>{mainWindow=null;});
  void mainWindow.loadURL(startURL);
}

if(!app.requestSingleInstanceLock()){app.quit();}else{
  app.on('second-instance',()=>{if(mainWindow){if(mainWindow.isMinimized())mainWindow.restore();mainWindow.show();mainWindow.focus();}});
  app.whenReady().then(async()=>{
    const root=path.resolve(__dirname,'../desktop-dist');
    protocol.handle('pkd',async request=>{
      if(!isAppURL(request.url)||request.method!=='GET')return new Response('Not found',{status:404});
      let pathname;try{pathname=decodeURIComponent(new URL(request.url).pathname);}catch{return new Response('Invalid URL',{status:400});}
      const relative=pathname.slice('/app/'.length)||'index.html';
      const file=path.resolve(root,relative);
      if(!file.startsWith(root+path.sep)||relative.includes('\\'))return new Response('Not found',{status:404});
      try{await fs.access(file);const response=await net.fetch(pathToFileURL(file).href);const headers=new Headers(response.headers);headers.set('Content-Security-Policy',csp);headers.set('X-Content-Type-Options','nosniff');headers.set('Cache-Control','no-store');return new Response(response.body,{status:response.status,headers});}catch{return new Response('Not found',{status:404});}
    });
    session.defaultSession.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
    session.defaultSession.setPermissionCheckHandler(()=>false);
    // All app code is bundled. External resources open only in the system browser.
    session.defaultSession.webRequest.onBeforeRequest({urls:['http://*/*','https://*/*','ws://*/*','wss://*/*']},(_details,callback)=>callback({cancel:true}));
    session.defaultSession.on('will-download',(_event,item)=>{
      const safeName=path.basename(item.getFilename()).replace(/[<>:"/\\|?*\x00-\x1f]/g,'_');
      item.setSaveDialogOptions({title:'Save PKD Compass export',defaultPath:path.join(app.getPath('downloads'),safeName)});
    });
    ipcMain.handle('pkd:about',(event)=>{
      if(event.sender!==mainWindow?.webContents||!isAppURL(event.senderFrame?.url))throw Error('Invalid sender');
      return {version:app.getVersion(),platform:process.platform,dataDirectory:app.getPath('userData')};
    });
    const mac=process.platform==='darwin';
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      ...(mac?[{label:'PKD Compass',submenu:[{role:'about'},{type:'separator'},{label:'Lock Vault',accelerator:'CmdOrCtrl+L',click:lock},{type:'separator'},{role:'hide'},{role:'hideOthers'},{role:'unhide'},{type:'separator'},{role:'quit'}]}]:[{label:'File',submenu:[{label:'Lock Vault',accelerator:'Ctrl+L',click:lock},{role:'quit'}]}]),
      {label:'Edit',submenu:[{role:'undo'},{role:'redo'},{type:'separator'},{role:'cut'},{role:'copy'},{role:'paste'},{role:'selectAll'}]},
      {label:'View',submenu:[{role:'resetZoom'},{role:'zoomIn'},{role:'zoomOut'},{type:'separator'},{role:'togglefullscreen'}]},
      {label:'Window',submenu:[{role:'minimize'},{role:'zoom'},...(mac?[{role:'front'}]:[{role:'close'}])]},
      {label:'Help',submenu:[{label:'Downloads and release information',click:()=>openExternal('https://pkdcompass.netlify.app/download')},{label:'About PKD Compass',click:()=>dialog.showMessageBox({type:'info',title:'PKD Compass',message:`PKD Compass ${app.getVersion()}`,detail:'Standalone local health journal. App files and encrypted records are stored on this computer. No health-data server or website connection is required. Keep encrypted backups and your passphrase safe.'})}]}
    ]));
    app.setAboutPanelOptions({applicationName:'PKD Compass',applicationVersion:app.getVersion(),copyright:'PKD Compass',credits:'Personal health organization. Not medical advice, diagnosis or treatment.'});
    powerMonitor.on('lock-screen',lock);powerMonitor.on('suspend',lock);
    createWindow();
    app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();else mainWindow?.show();});
  }).catch(error=>{dialog.showErrorBox('Unable to start PKD Compass',error.message);app.quit();});
}
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
