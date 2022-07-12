'use strict'

import { app, protocol, BrowserWindow , ipcMain , Menu,Tray , session} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'

const remote = require("@electron/remote/main") 
remote.initialize()

const isDevelopment = process.env.NODE_ENV !== 'production'
var path = require('path')
var win = null
// 子窗口
var chromrChildren = null

var iconTray = null
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'http',
    privileges: { 
      secure: true, 
      standard: true,
      bypassCSP: true, 
      supportFetchAPI: true,
      corsEnabled: true
    } 
  },
  { scheme: 'app', 
    privileges: { 
      secure: true, 
      standard: true 
    } }
])

async function createWindow() {
  // Create the browser window
 

  if (process.env.WEBPACK_DEV_SERVER_URL) {
     // 添加vue2插件
    const veuTools = path.join(__dirname,  './chrome/vueTools')
    session.defaultSession.loadExtension(veuTools)
    // 添加react插件
    const reactDevtools = path.join(__dirname,  './chrome/react-devtools')
    session.defaultSession.loadExtension(reactDevtools)
    // 添加react插件
    const ReduxDevTools = path.join(__dirname,  './chrome/ReduxDevTools')
    session.defaultSession.loadExtension(ReduxDevTools)
  }else{
     // 添加vue2插件
    const veuTools = path.join(__dirname,  '../chrome/vueTools')
    session.defaultSession.loadExtension(veuTools)
    // 添加react插件
    const reactDevtools = path.join(__dirname,  '../chrome/react-devtools')
    session.defaultSession.loadExtension(reactDevtools)
    // 添加react插件
    const ReduxDevTools = path.join(__dirname,  '../chrome/ReduxDevTools')
    session.defaultSession.loadExtension(ReduxDevTools)
  }

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth:1080,
    minHeight: 768,
    titleBarStyle:{
      default: 'E-API'
    },
    title: 'E-API',
    frame:false,
    fullscreenable:false,
    fullscreen: true,
    simpleFullscreen: false,
    darkTheme: true,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      fullscreenable: true,  //是否允许全屏
      contextIsolation: false ,// 跨域
			webSecurity: false,
      plugins: true
    },
    icon: process.env.WEBPACK_DEV_SERVER_URL ?  path.join(__dirname, './chrome/favicon.ico') : path.join(__dirname,'../chrome/favicon.ico')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    // win.webContents.openDevTools()
  }
  remote.enable(win.webContents)
  	// 最小化
	ipcMain.on('window-min',()=>{
    win.minimize()
  })
    // 关闭
  ipcMain.on('window-close',()=>{
    win.hide()
  })
    // 退出
  ipcMain.on('window-quit',()=>{
    // console.log('退出')
    win.close()
  })
  
      //最大化或者还原
  ipcMain.on('window-tag',()=>{
  
      if(win.isMaximized()){
          win.restore()  //还原
          win.unmaximize() 

        }else{
          win.maximize()  //最大化
        }
      
  })

  // 最大化
  win.on('maximize',()=>{
    win.webContents.send('maxState',win.isMaximized())
  })
  // 还原
  win.on('unmaximize',()=>{
    win.webContents.send('maxState',win.isMaximized())
  })
      

  // 角标
  const icon = path.join(__dirname,  './favicon.ico')// __dirname为主进程执行的同级目录
  iconTray = new Tray(icon)



  // 绑定托盘的右键菜单
  var tpl=[
      {
          label: '退出',
          click:function(){
              win.close()
          }
      }
  ]

  let rightIcon=Menu.buildFromTemplate(tpl)

  iconTray.setContextMenu(rightIcon)

  // 托盘图标 提示文字
  iconTray.setToolTip('E-API')

  // 点击关闭按钮，让应该保存在托盘里，双击托盘，打开应用




  // 双击 托盘图标 打开窗口
  iconTray.on('double-click',function(){
      win.show()
  })

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.commandLine.appendSwitch("--disable-http-cache")
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

//限制只能开启一个应用(4.0以上版本)
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
 app.quit()
} else {
 app.on('second-instance', (event, commandLine, workingDirectory) => {
   // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
   if (win) {
     if (win.isMinimized()) win.restore()
     win.focus()
     win.show()
   }
 })
}


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}



// 创建chrome子页面
ipcMain.on('window-children-chrome',()=>{
  if(chromrChildren){
      chromrChildren.restore()  //还原
      chromrChildren.unmaximize()
  }else{
    chromrChildren = new BrowserWindow({
        width: 1200, 
        height: 800,
        frame:false,
        fullscreenable: false,
        fullscreen: true,
        simpleFullscreen: false,
        titleBarStyle:{
          default: 'E-浏览器'
        },
        title: 'E-浏览器',
        webPreferences: {
          webviewTag: true,
          nodeIntegration: true,
          fullscreenable: true,  //是否允许全屏
          contextIsolation: false ,// 跨域
          webSecurity: false,
          autoplayPolicy: 'document-user-activation-required',
          plugins: true
        },
        icon: process.env.WEBPACK_DEV_SERVER_URL ?  path.join(__dirname, './chrome/favicon.ico') : path.join(__dirname,'../chrome/favicon.ico')
    })
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      chromrChildren.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/#/chrome')
      if (!process.env.IS_TEST) chromrChildren.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      chromrChildren.loadURL('app://./index.html/#/chrome')
      // chromrChildren.webContents.openDevTools()
    }
    chromrChildren.on('closed',()=>{

      chromrChildren = null
    })

    // 最大化
    chromrChildren.on('maximize',()=>{
      chromrChildren.webContents.send('maxState-chrome',chromrChildren.isMaximized())
    })
    // 还原
    chromrChildren.on('unmaximize',()=>{
      chromrChildren.webContents.send('maxState-chrome',chromrChildren.isMaximized())
    })


  }
  
  
})

// chrome子页面最小化
ipcMain.on('window-children-min',(val)=>{
  chromrChildren.minimize()
})
// chrome子页面关闭
ipcMain.on('window-children-quit',(val)=>{
  chromrChildren.close()
})
// chrome子页面切换
ipcMain.on('window-children-tag',(val)=>{
    if(chromrChildren.isMaximized()){
      chromrChildren.restore()  //还原
      chromrChildren.unmaximize() 
    }else{
      chromrChildren.maximize()  //最大化
    }
})


