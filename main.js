const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

let serverProcess;
let splash;
let mainWindow;

function startServer() {

    serverProcess = spawn("node", ["server.js"], {

        shell: true,
        stdio: "inherit"

    });
// this is an edit
}
// this is an edit in final branch

function waitForServer(callback) {

    const timer = setInterval(() => {

        http.get("http://localhost:3000", () => {

            clearInterval(timer);

            callback();

        }).on("error", () => {

            // Server still starting...
        });

    }, 500);

}

function createSplash() {

    splash = new BrowserWindow({

        width: 500,
        height: 300,

        frame: false,

        resizable: false,

        alwaysOnTop: true,

        autoHideMenuBar: true,

        icon: path.join(
            __dirname,
            "public",
            "assets",
            "favicon.ico"
        )

    });

    splash.loadFile(path.join(__dirname, "electron", "splash.html"));

}

function createMainWindow() {

    mainWindow = new BrowserWindow({

        width: 1400,
        height: 900,

        autoHideMenuBar: true,

        title: "MEM Invoice System",
        icon: path.join(
            __dirname,
            "public",
            "assets",
            "favicon.ico"
        ),

        show: false

    });

    mainWindow.loadURL("http://localhost:3000");

    mainWindow.once("ready-to-show", () => {

        splash.close();

        mainWindow.show();

    });

}

app.whenReady().then(() => {

    startServer();

    createSplash();

    waitForServer(() => {

        createMainWindow();

    });

});

app.on("window-all-closed", () => {

    if (serverProcess) {

        serverProcess.kill();

    }

    app.quit();

});