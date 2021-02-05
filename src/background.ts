/* global __static */
declare const __static: string;

'use strict'
import "reflect-metadata"
import { ApplicationContainer } from './di';
import { LoggerService } from "./services/loggerService"
import { app, protocol, ipcMain, BrowserWindow, shell, Tray, Menu, dialog, autoUpdater, MenuItem, globalShortcut } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import { DownloadRequest, ContextType } from '@/config/litterals/index'
import { DownloadService } from "./services/downloadService";
import ytdl from "ytdl-core";
import { YOUTUBE_VIDEO_URL } from "./config/litterals/youtube";
import ytpl from "ytpl";
import VueI18n from "vue-i18n";
const isDevelopment = process.env.NODE_ENV !== 'production'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null
const loggerService = ApplicationContainer.resolve(LoggerService);
let localesMessages: VueI18n.LocaleMessages;
import ElectronStore from 'electron-store';
import winston from "winston/lib/winston/config";
import { loggers } from "winston";

const schema = {
	locale: {
		type: "string",
		default: "en"
	},
} as const;

const store = new ElectronStore({schema});


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
        width: 1155,
        height: 955,
        minWidth: 1180,
        minHeight: 1000,
        x: 0,
        y: 0,
        title: "Youtube Downloader",
        frame: false,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: (process.env
                .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            devTools: isDevelopment
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

    // Disable opening a new window
    win.webContents.on('new-window', async (event, url, frameName, disposition, options, additionalFeatures) => {
        event.preventDefault()
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
            if(!isDevelopment){
                const ret = globalShortcut.register('CommandOrControl+R', () => {
                    loggerService.info('CommandOrControl+R is disabled')
                })    
                
                if (!ret) {
                    loggerService.error('globalShortcut.register(CommandOrControl+R) failed')
                }            
            }
            createWindow()
        })

        app.on('will-quit', () => {
            // Supprime tous les raccourcis.
            globalShortcut.unregisterAll()
        })        
    }
})

ipcMain.on("open-external-url", (event, args: string) => {
    shell.openExternal(args);
});

ipcMain.on("open-shell", (event, args: string) => {
    try {
        shell.openPath(args);
    } catch (err) {
        loggerService.error(err);
    }
});

ipcMain.on("set-locale-messages", (event, args: VueI18n.LocaleMessages) => {
    localesMessages = args;
})

ipcMain.on("minimize-window", (event, args: any) => {
    if (win) win.minimize();
})

ipcMain.on("maximize-window", (event, args: any) => {
    loggerService.info('called')
    if (win && !win.isMaximized()) win.maximize();
    else if (win) win.unmaximize();
})

ipcMain.on("close-window", (event, args: any) => {
    if (win) win.close();
})

ipcMain.handle("get-current-locale", (event, args) => {
    return new Promise( (resolve, reject) => {
        try {
            const locale = store.get("locale");
            resolve(locale);
        } catch (err) {
            reject(err);
        }
    })
})

ipcMain.on("set-current-locale", (event, locale: string) => {
    store.set("locale", locale);
})

ipcMain.handle("get-video-infos", async (event, videoId: string) => {
    return ytdl.getInfo(`${YOUTUBE_VIDEO_URL}${videoId}`);
});

ipcMain.handle("get-video-id-from-url", (event, url: string) => {
    return new Promise( (resolve, reject) => {
        try {
            const returnValue = ytdl.getURLVideoID(url);
            resolve(returnValue);
        } catch (err) {
            loggerService.error(err)
            reject(err);
        }
    })
});

ipcMain.handle("get-playlist-id-from-url", (event, url: string) => {
    return ytpl.getPlaylistID(url);
});

ipcMain.handle("get-playlist-videos", async (event, playlistId: string) => {
    return ytpl(playlistId, { limit: Infinity });
});

ipcMain.handle("get-default-download-folder", (event, args) => {
    return new Promise( (resolve, reject) => {
        try {
            const downloadPath = app.getPath('downloads');
            resolve(downloadPath);
        } catch (err) {
            reject(err);
        }
    })
})

ipcMain.on("select-folder", (event, args: string) => {
    if (win)
        win.webContents.send('selected-folder', dialog.showOpenDialogSync(win, { properties: ['openDirectory'] }));
});


ipcMain.on("download-videos", (event, args: DownloadRequest) => {
    new DownloadService(args, win);
});

ipcMain.on("open-context-menu", (event, type: ContextType) => {
    const locale = store.get("locale") as string;
    const contextMenu = localesMessages[locale]['contextMenu'] as VueI18n.LocaleMessageObject;
    const pasteLabel = contextMenu['paste'] as string;
    const menu = new Menu();
    switch (type) {
        case 'text-field':
            menu.append(new MenuItem({ id: 'right-click', label: pasteLabel, role: 'paste', accelerator: 'CommandOrControl+V'}));
            break;
    
            default:
                break;
    }
    if (win && menu.items.length > 0) menu.popup();
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
