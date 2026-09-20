module.exports={
  appId:'org.pkdcompass.desktop',productName:'PKD Compass',copyright:'PKD Compass',
  artifactName:'PKD-Compass-${version}-${os}-${arch}.${ext}',
  directories:{output:'release'},
  files:['desktop/*.cjs','desktop-dist/**/*','package.json','!node_modules/**/*','!desktop/electron-builder.cjs','!desktop/after-pack.cjs'],
  extraMetadata:{main:'desktop/main.cjs',version:'1.0.0-preview.1'},
  asar:true,npmRebuild:false,afterPack:'desktop/after-pack.cjs',
  mac:{target:[{target:'dmg',arch:['arm64','x64']}],category:'public.app-category.healthcare-fitness',icon:'public/icon-512.png',hardenedRuntime:true,gatekeeperAssess:false,identity:process.env.CSC_NAME||'-',notarize:!!process.env.APPLE_API_KEY||!!process.env.APPLE_ID},
  dmg:{title:'PKD Compass',contents:[{x:150,y:160,type:'file'},{x:430,y:160,type:'link',path:'/Applications'}]},
  win:{target:[{target:'nsis',arch:['x64']}],icon:'public/icon-512.png',signAndEditExecutable:process.platform==='win32'},
  nsis:{oneClick:false,perMachine:false,allowToChangeInstallationDirectory:true,createDesktopShortcut:true,createStartMenuShortcut:true,deleteAppDataOnUninstall:false,shortcutName:'PKD Compass'},
  publish:null
};
