const { ipcMain, app, session } = require("electron");
const fs = require("fs-extra");
const path = require("path");
var request = require('superagent');

let fileName = 'collect_songs.txt';
let dir = path.resolve(__dirname, fileName);
function getCollectData() {
    fs.ensureFileSync(dir)
    let data = fs.readFileSync(dir, 'utf-8');
    if (data.length) {
        return JSON.parse(data);
    } else {
        return [];
    }
}

function handleIpc(win) {
    ipcMain.on("close", () => {
        app.quit();
    })

    ipcMain.on("minimize", () => {
        win.minimize();
    })

    ipcMain.on("maximize", () => {
        if (win.isMaximized()) {
            win.restore();
        } else {
            win.maximize()
        }
    })

    ipcMain.handle("search-kuwo", async (event, target_url) => {
        return new Promise((resolve) => {
            request.get(target_url)
                .set('Host', 'www.kuwo.cn')
                .set('origin', 'https://www.kuwo.cn/')
                .set('referer', 'https://www.kuwo.cn/')
                .set('csrf', '8V8MELR6ERd')
                .set('Cookie', 'kw_token=8V8MELR6ERd')
                .end(function (err, res) {
                    if (err) {
                        resolve({})
                    } else {
                        resolve(JSON.parse(res.text))
                    }
                })
        })
    })

    ipcMain.handle("add-collect", async (event, songItem) => {
        let data = await getCollectData();
        data.push(songItem);
        let dataStr = JSON.stringify(data)
        fs.writeFileSync(dir, '', 'utf-8');
        fs.writeFileSync(dir, dataStr, 'utf-8');
        return true
    })

    ipcMain.handle("get-collect", async (event) => {
        let data = await getCollectData()
        return data;
    })

}

module.exports = {
    handleIpc
}