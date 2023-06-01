"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win = null;
var args = process.argv.slice(1);
var serve = args.some(function (val) { return val === '--serve'; });
var isEnvSet = 'ELECTRON_IS_DEV' in process.env;
var getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
var electronIsDev = isEnvSet ? getFromEnv : !electron_1.app.isPackaged;
var createWindow = function () {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false
        },
        icon: path.join(__dirname, '/dist/assets/images/cyborgbackup-sidebar-white.png')
    });
    electron_1.app.setName('CyBorgBackup');
    if (process.platform === 'darwin') {
        electron_1.app.dock.setIcon(path.join(__dirname, '/dist/assets/images/cyborgbackup-sidebar-white.png'));
    }
    else {
        win.setRepresentedFilename(path.join(__dirname, '/dist/assets/images/cyborgbackup-sidebar-white.png'));
    }
    if (serve) {
        win.webContents.openDevTools();
        require('electron-reload')(__dirname, {
            electron: require("".concat(__dirname, "/node_modules/electron"))
        });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    return win;
};
try {
    //app.allowRendererProcessReuse = true;
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window.
    // More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', function () { return setTimeout(createWindow, 400); });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    if (electronIsDev) {
        console.log('Running Development mode');
        console.log(__dirname);
    }
    else {
        var server = 'https://download.cyborgbackup.dev';
        var urlUpdate = "".concat(server, "/update/").concat(process.platform, "/").concat(electron_1.app.getVersion());
        electron_1.autoUpdater.setFeedURL({ url: urlUpdate });
        electron_1.autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName) {
            var dialogOpts = {
                type: 'info',
                buttons: ['Restart', 'Later'],
                title: 'Application Update',
                message: process.platform === 'win32' ? releaseNotes : releaseName,
                detail: 'A new version has been downloaded. Restart the application to apply the updates.'
            };
            electron_1.dialog.showMessageBox(dialogOpts).then(function (returnValue) {
                if (returnValue.response === 0) {
                    electron_1.autoUpdater.quitAndInstall();
                }
            });
        });
        electron_1.autoUpdater.on('error', function (message) {
            console.error('There was a problem updating the application');
            console.error(message);
        });
        setInterval(function () {
            electron_1.autoUpdater.checkForUpdates();
        }, 60000);
    }
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
