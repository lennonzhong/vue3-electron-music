const { BrowserWindow, app } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path")
const { handleIpc } = require("./ipc")

let win;

const theLock = app.requestSingleInstanceLock();

function createMainWindow() {
    let win = new BrowserWindow({
        icon: path.resolve(__dirname, "../../reources/64x64.png"),
        frame: false,
        width: 1022,
        show: false,
        height: 670,
        resizable: false,
        // transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    })
    isDev ? win.loadURL("http://localhost:8080") : win.loadFile(path.resolve(__dirname, "../renderer/dist/index.html"))
    handleIpc(win)
    win.once("ready-to-show", () => {
        win.show()
    })

    app.on("second-instance", () => {
        // 如果有直接展示，否则create
        if (win) {
            win.show();
        }
    })
}

if (!theLock) {
    app.quit();
}

app.whenReady().then(() => {
    createMainWindow();
})