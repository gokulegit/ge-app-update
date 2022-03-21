import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { autoUpdater } from "electron-updater";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
    serve({ directory: "app" });
} else {
    app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
    await app.whenReady();

    const mainWindow = createWindow("main", {
        width: 1000,
        height: 600,
    });

    ipcMain.on("version", (event) =>
        event.sender.send(`version`, `${app.getVersion()}`)
    );

    const dMessage = (msg) => mainWindow.webContents.send("message", msg);
    const dProgress = (prog) =>
        mainWindow.webContents.send("download-progress", prog);

    if (isProd) {
        await mainWindow.loadURL("app://./home.html");

        autoUpdater.on("checking-for-updates", () =>
            dMessage(`Checking for updates...`)
        );
        autoUpdater.on("update-available", (info) =>
            dMessage(`Update available`)
        );
        autoUpdater.on("update-not-available", (info) =>
            dMessage("Update not available")
        );

        autoUpdater.on("error", (err) =>
            dMessage(`Error in autoUpdater - ${err}`)
        );
        autoUpdater.on("download-progress", (obj) =>
            dProgress(`${obj.percent}`)
        );
        autoUpdater.on("update-downloaded", (info) => {
            dMessage("update downloaded. restart to get new experience...");
            autoUpdater.quitAndInstall(false, true);
        });

        autoUpdater.checkForUpdatesAndNotify();
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
        mainWindow.webContents.openDevTools();
    }

    dMessage("hello from main process...");
})();

app.on("window-all-closed", () => {
    app.quit();
});
