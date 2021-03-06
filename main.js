const {app, BrowserWindow, Tray, Menu} = require('electron');
const url = require('url');
const path = require('path');

const gbs = require('./config/globals');
const config = require('./app/core/config');

//Actual backend
const backend = require('./app/backend');

function createWindow () {
  // Create the browser window.
  gbs.win = new BrowserWindow({
    width: 600,
    height: 250,
    icon: "public/logo.png",
    webPreferences: {
      //nodeIntegration: false
    },
    'use-content-size': true
  });


  // and load the index.html of the app.
  gbs.win.loadURL(url.format({
    pathname: "odrive.io/",
    protocol: 'http:',
    slashes: true
  }));

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  gbs.win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    gbs.win = null;
  });
}

function generateTray() {
  gbs.tray = new Tray('/home/coyotte508/logo.png');
  //gbs.tray = new Tray('public/logo.png');
  gbs.trayMenu = Menu.buildFromTemplate([
    {
      label: 'Preferences...',
      click () {
        if (gbs.win === null) {
          createWindow();
        }
      }
    },
    {type: 'separator'},
    {
      label: 'Quit ODrive',
      click () {process.exit(0)}
    }
  ]);
  //gbs.tray.setToolTip('This is my application.')
  gbs.tray.setContextMenu(gbs.trayMenu);
}

async function launch() {
  generateTray();

  /* Only display settings on launch if no account already set up */
  let accounts = await config.accounts();
  if (accounts.length == 0) {
    createWindow();
  }
}

app.commandLine.appendSwitch('host-rules', `MAP odrive.io 127.0.0.1:${backend.port}`);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', launch);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  // app.quit();
  // }
  /* To quit, need to quit on the tray icon */
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (gbs.win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
