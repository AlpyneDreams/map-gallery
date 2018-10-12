// Modules to control application life and create native browser window
const electron = require('electron')
const {ipcMain, app, BrowserWindow} = require('electron')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600, frame: false, transparent: true, maximizable: false})

    // and load the index.html of the app.
    mainWindow.loadFile('src/view/index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})
var commandPath = fs.existsSync('resources/command_template.txt') ? 'resources/command_template.txt' : 'build/command_template.txt'
var commandTemplate = fs.readFileSync(commandPath, {encoding: 'utf8'})

if (!commandTemplate)
    commandTemplate = "echo %map%"

ipcMain.on('launch-map', (e, mapName) => {
    electron.dialog.showMessageBox(mainWindow, {title: "Launching Map", message: commandTemplate.replace('%map%', mapName)})
    const { exec } = require('child_process')
    exec(commandTemplate.replace('%map%', mapName), (err, stdout, stderr) => {
    if (err) {
        // node couldn't execute the command
        return
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
    });

})

