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

    mainWindow.webContents.on("did-finish-load", () => {
        console.log("finish load");
        ipcMain.on("version", (event, data) => {
            console.log(data);
            event.returnValue = app.getVersion();
        });
    });

    if (isProd) {
        await mainWindow.loadURL("app://./home.html");

        autoUpdater.on("checking-for-updates", () =>
            console.log(`Checking for updates...`)
        );
        autoUpdater.on("update-available", (info) =>
            console.log(`Update available`)
        );
        autoUpdater.on("update-not-available", (info) =>
            console.log("Update not available")
        );

        autoUpdater.on("error", (err) =>
            console.log(`Error in autoUpdater - ${err}`)
        );
        autoUpdater.on("download-progress", (obj) =>
            console.log(`Download in progress ${obj.percent}`)
        );
        autoUpdater.on("update-downloaded", (info) =>
            console.log("update downloaded...")
        );

        autoUpdater.checkForUpdatesAndNotify();
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
        mainWindow.webContents.openDevTools();
    }
})();

app.on("window-all-closed", () => {
    app.quit();
});
