import { app, BrowserWindow, screen, autoUpdater, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
import MessageBoxOptions = Electron.MessageBoxOptions;

let win: BrowserWindow = null;
const args = process.argv.slice(1);
const serve = args.some((val) => val === '--serve');
const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

const electronIsDev = isEnvSet ? getFromEnv : !app.isPackaged;

const createWindow = (): BrowserWindow => {

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
        },
        icon: path.join(__dirname, '/dist/assets/images/cyborgbackup-sidebar-white.png'),
    });
    app.setName('CyBorgBackup');

    if (process.platform === 'darwin') {
        app.dock.setIcon(path.join(__dirname, '/dist/assets/images/cyborgbackup-sidebar-white.png'));
    } else {
        win.setRepresentedFilename(path.join(__dirname, '/dist/assets/images/cyborgbackup-sidebar-white.png'));
    }

    if (serve) {

        win.webContents.openDevTools();

        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        win.loadURL('http://localhost:4200');

    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
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
    app.on('ready', () => setTimeout(createWindow, 400));

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    if (electronIsDev) {
        console.log('Running Development mode');
        console.log(__dirname);
    } else {
        const server = 'https://download.cyborgbackup.dev';
        const urlUpdate = `${server}/update/${process.platform}/${app.getVersion()}`;

        autoUpdater.setFeedURL({ url: urlUpdate });

        autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
            const dialogOpts: MessageBoxOptions = {
                type: 'info',
                buttons: ['Restart', 'Later'],
                title: 'Application Update',
                message: process.platform === 'win32' ? releaseNotes : releaseName,
                detail: 'A new version has been downloaded. Restart the application to apply the updates.'
            };

            dialog.showMessageBox(dialogOpts).then((returnValue) => {
                if (returnValue.response === 0) {
                    autoUpdater.quitAndInstall();
                }
            });
        });

        autoUpdater.on('error', (message) => {
            console.error('There was a problem updating the application');
            console.error(message);
        });

        setInterval(() => {
            autoUpdater.checkForUpdates();
        }, 60000);
    }

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });

} catch (e) {
    // Catch Error
    // throw e;
}
