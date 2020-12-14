/* global __static */
declare const __static: string;

'use strict'
import "reflect-metadata"
import { ApplicationContainer } from './di';
import { LoggerService } from "./services/loggerService"
import { app, protocol, ipcMain, BrowserWindow, shell, Tray, Menu, dialog, autoUpdater } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
// import { appMainPath } from '@/helpers/pathHelper'
import {downloadItems, getVideoInfo} from '@/helpers/ytDownloaderHelper'
import { DownloadRequest, ItemStruct } from '@/config/litterals/index'
import fs from 'fs'
const isDevelopment = process.env.NODE_ENV !== 'production'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null
const loggerService = ApplicationContainer.resolve(LoggerService);


// Set auto updater
if (!isDevelopment){
    const server = 'https://youtube-downloader.sixif.vercel.app';
    const url = `${server}/update/${process.platform}/${app.getVersion()}`;
    
    autoUpdater.setFeedURL({ url });

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
          type: 'info',
          buttons: ['Restart', 'Later'],
          title: 'Application Update',
          message: process.platform === 'win32' ? releaseNotes : releaseName,
          detail: 'A new version has been downloaded. Restart the application to apply the updates.'
        }
      
        dialog.showMessageBox(dialogOpts).then((returnValue) => {
          if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    });
      
    autoUpdater.on('error', message => {
        loggerService.logError('There was a problem updating the application')
        loggerService.logError(message)
    });


    setInterval(() => {
        autoUpdater.checkForUpdates()
    }, 60000)

}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow() {
    // Create the browser window.
    let tray: Tray | null = null;

    win = new BrowserWindow({
        width: 855,
        height: 655,
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
    appIcon.setToolTip('Youtube downloader');
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
    await installExtension(VUEJS_DEVTOOLS)
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            loggerService.logError(`Vue Devtools failed to install: , ${e.toString()}`)
        }
    }
    
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
        app.quit()
    } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
            }
        })

        // Create win, load the rest of the app, etc...
        app.whenReady().then(() => {
            createWindow()
        })
    }
})

ipcMain.on("open-external-url", (event, args: string) => {
    shell.openExternal(args);
});

ipcMain.on("open-shell", (event, args: string) => {
    shell.openPath(args);
});

ipcMain.handle("getVideoInfo", async (event, args: string) => {
    try {
        const returnValue = await getVideoInfo(args);
        return returnValue;
    } catch (err) {
        loggerService.logError(err)
        return {
            type: "error",
            error: err
        }
    }
    // loggerService.logInfo(returnValue)
});

ipcMain.on("select-folder", (event, args: string) => {
    if (win)
        win.webContents.send('selected-folder', dialog.showOpenDialogSync({ properties: ['openDirectory'] }));
});


ipcMain.on("download-videos", (event, args: DownloadRequest) => {
    // Loop over args to download each videos selected
    const appMainPath = args.downloadFolder;
    const WORKER_NUMBER = 3;
    if (appMainPath) {
        const subDirectory = args.audioOnly ? "Audios" : "Videos";
        if (!fs.existsSync(path.join(appMainPath, args.channelTitle, subDirectory, args.playlistTitle))) {
            fs.mkdirSync(path.join(appMainPath, args.channelTitle, subDirectory, args.playlistTitle), { recursive: true });
        }
        const output = path.join(appMainPath, args.channelTitle, subDirectory, args.playlistTitle);
        for (var i = 0; i < WORKER_NUMBER; i++)
            downloadItems(args, output, win);
    } else {
        loggerService.logInfo('There is no download folder set, wow..')
    }
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
