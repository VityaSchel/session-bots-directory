/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  // appDirectory: 'src/app',
  // assetsBuildDirectory: 'src/public/build',
  // publicPath: 'src/public',
  // serverBuildPath: "build/index.js",
  serverDependenciesToBundle: [
    'remix-i18next',
    'accept-language-parser',
  ],

}
