'use strict'

import { app, protocol, ipcMain, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import { createDownloadPath } from '@/helpers/pathHelper'
import fs from 'fs'
import ytdl from 'ytdl-core'
import { cpuUsage } from 'process'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
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
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Custom events with preload.js
ipcMain.on("do-a-thing", (event, args) => {
  console.log("i did it")
  console.log(event)
  console.log(args)
  console.log(createDownloadPath())
  if (win)
    win.webContents.send('it-is-good', 'YAHOOO')
  // ytdl('http://www.youtube.com/watch?v=A02s8omM_hI')
  //   .pipe(fs.createWriteStream('video.flv'));
});

ipcMain.on("download-videos", (event, args: any) => {
  // Loop over args to download each videos selected
  args.itemSelected.forEach(video => {
    if (!fs.existsSync(path.join(app.getPath("documents"), args.channelTitle))) {
      fs.mkdirSync(path.join(app.getPath("documents"), args.channelTitle), { recursive: true });
    }
    const output = path.join(app.getPath("documents"), args.channelTitle);
    ytdl(`http://www.youtube.com/watch?v=${video.id}`)
      .pipe(fs.createWriteStream(path.resolve(output, `${video.title}.flv`)));
  });
  console.log("i did it")
  console.log(args.channelTitle)
  console.log(args)
  if (win)
    win.webContents.send('it-is-good', 'YAHOOO')
  // ytdl('http://www.youtube.com/watch?v=A02s8omM_hI')
  //   .pipe(fs.createWriteStream('video.flv'));
});

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