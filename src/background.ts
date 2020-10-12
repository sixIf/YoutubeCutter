/* global __static */
declare const __static: string;

'use strict'

import { app, protocol, ipcMain, BrowserWindow, shell, Tray, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import { appMainPath } from '@/helpers/pathHelper'
import downloadItems from '@/helpers/ytDownloaderHelper'
import { DownloadRequest, ItemStruct } from '@/config/litterals/index'
import fs from 'fs'
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
  let tray: Tray | null = null;

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true
    },
    /* global __static */
    icon: path.join(__static, 'icon.png')
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

  win.on('minimize', function (event: any) {
    event.preventDefault();
    if (win) win.hide();
    tray = createTray();
  });

  win.on('restore', function (event: any) {
    if (win) win.show();
    if (tray) tray.destroy();
  });

  win.on('closed', () => {
    win = null
  })
}


function createTray() {
  let appIcon = new Tray(path.join(__static, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show', click: function () {
        if (win) win.show();
      }
    },
    {
      label: 'Exit', click: function () {
        app.quit();
      }
    }
  ]);

  appIcon.on('double-click', function (event) {
    if (win) win.show();
  });
  appIcon.setToolTip('Tray Tutorial');
  appIcon.setContextMenu(contextMenu);
  return appIcon;
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

ipcMain.on("open-external-url", (event, args: string) => {
  shell.openExternal(args);
});


ipcMain.on("download-videos", (event, args: DownloadRequest) => {
  // Loop over args to download each videos selected
  const subDirectory = args.audioOnly ? "Audios" : "Videos";
  if (!fs.existsSync(path.join(appMainPath, args.channelTitle, subDirectory, args.playlistTitle))) {
    fs.mkdirSync(path.join(appMainPath, args.channelTitle, subDirectory, args.playlistTitle), { recursive: true });
  }
  const output = path.join(appMainPath, args.channelTitle, subDirectory, args.playlistTitle);
  downloadItems(args.itemSelected, args.audioOnly, output, win);
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
