/* global __static */
declare const __static: string;

'use strict'
import "reflect-metadata"
import { ApplicationContainer } from './di';
import { LoggerService } from "./services/loggerService"
import { app, protocol, ipcMain, BrowserWindow, shell, Tray, Menu, dialog, autoUpdater, MenuItem } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
// import { appMainPath } from '@/helpers/pathHelper'
import {downloadItems, getVideoInfo} from '@/helpers/ytDownloaderHelper'
import { DownloadRequest, ItemStruct } from '@/config/litterals/index'
import fs from 'fs'
import { availableLocales } from "./config/litterals/i18n";
const isDevelopment = process.env.NODE_ENV !== 'production'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null
let youtubeWin: BrowserWindow | null
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
        loggerService.error('There was a problem updating the application')
        loggerService.error(message)
    });


    setInterval(() => {
        autoUpdater.checkForUpdates()
    }, 60000)

}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

// Minimize app correctly
function createTray() {
    const appIcon = new Tray(path.join(__static, 'icon.png'));
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

function createWindow() {
    // Create the browser window.
    let tray: Tray | null = null;

    win = new BrowserWindow({
        width: 855,
        height: 655,
        x: 0,
        y: 0,
        title: "Youtube Downloader",
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: (process.env
                .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true
        },
        show: false,
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

    win.once('ready-to-show', () => {
        if (win) win.show()
    })

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

    win.webContents.on('new-window', async (event, url, frameName, disposition, options, additionalFeatures) => {
        event.preventDefault()
        if (!youtubeWin) {
          Object.assign(options, {
            modal: false,
            title: "Youtube",
            frame: false,
            parent: win,
            width: 855,
            height: 655,
            webPreferences: {
                preload: path.join(__dirname, "preloadYoutube.js"),
            },
            x: 855,
            y: 0,
            show: false
          })
          event.newGuest = new BrowserWindow(options);
          youtubeWin = event.newGuest;
          await youtubeWin.loadURL(url, {})
          youtubeWin.show();
        } else {
            loggerService.error("Window already exists !")
        }
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
    await installExtension(VUEJS_DEVTOOLS)
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            loggerService.error(`Vue Devtools failed to install: , ${e.toString()}`)
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


ipcMain.on("open-shell", (event, args: string) => {
    shell.openPath(args);
});

ipcMain.handle("getVideoInfo", async (event, args: string) => {
    try {
        const returnValue = await getVideoInfo(args);
        return returnValue;
    } catch (err) {
        loggerService.error(err)
        return {
            type: "error",
            error: err
        }
    }
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
        for (let i = 0; i < WORKER_NUMBER; i++)
            downloadItems(args, output, win);
    } else {
        loggerService.info('There is no download folder set, wow..')
    }
});

// Create context menu for Youtube Browser window

const menu = new Menu()
menu.append(new MenuItem({ label: 'Add video', click(menuItem, browserWindow, event) { addVideo(menuItem, browserWindow, event) } }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'Open channel', click() { loggerService.info('item 2 clicked') } }))
menu.append(new MenuItem({ label: 'Open playlist', click() { loggerService.info('item 2 clicked') } }))

function addVideo (menuItem: MenuItem, browserWindow: BrowserWindow | undefined, event: Electron.KeyboardEvent) {
    loggerService.info(`${menuItem}`);
    loggerService.info(`${browserWindow}`);
    loggerService.info(`${event}`);
}

ipcMain.on("open-context-menu", (event, args: string) => {
    const currentBrowserWindow = BrowserWindow.getFocusedWindow()!;
    menu.popup({ window: currentBrowserWindow })
    return BrowserWindow.getFocusedWindow()!.id;
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
