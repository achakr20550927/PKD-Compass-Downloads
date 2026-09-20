const path = require('node:path');
module.exports = async context => {
  const {flipFuses,FuseVersion,FuseV1Options}=await import('@electron/fuses');
  const binary=context.electronPlatformName==='darwin'
    ?path.join(context.appOutDir,`${context.packager.appInfo.productFilename}.app`)
    :path.join(context.appOutDir,`${context.packager.appInfo.productFilename}.exe`);
  await flipFuses(binary,{
    version:FuseVersion.V1,
    [FuseV1Options.RunAsNode]:false,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]:false,
    [FuseV1Options.EnableNodeCliInspectArguments]:false,
    [FuseV1Options.OnlyLoadAppFromAsar]:true,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]:true
  });
};
