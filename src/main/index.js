import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { pingWarp } from './ping'

// 创建默认窗口
function createWindow() {
  // 创建窗口
  const mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 300,
    width: 900,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: is.dev,
      devTools: true
    }
  })

  // 窗口准备好时，就显示它
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 生产环境不设置菜单，节约开销
if (!is.dev) {
  Menu.setApplicationMenu(null)
}

// 当 App 可用时，进行初始化
app.whenReady().then(() => {
  // 注册 IPC 指令
  ipcMain.handle('pingWarp', pingWarp)

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 注册 Vue 开发工具插件
  if (is.dev) {
    installExtension(VUEJS_DEVTOOLS).then(() => {})
  }

  // 创建默认窗口
  createWindow()
})

// 当所有窗口都被关闭时，退出程序(包括 Mac)
app.on('window-all-closed', () => {
  app.quit()
})
