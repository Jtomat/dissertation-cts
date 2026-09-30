import {
    app,
    BrowserWindow,
    ipcMain
} from "electron";

import path from "node:path";
import net from "node:net";
import {
    spawn,
    ChildProcess,
    execFileSync
} from "node:child_process";

import { CoreManager } from "./core-manager";

let mainWindow: BrowserWindow | null = null;
let angularProcess: ChildProcess | null = null;

let isStopping = false;
let isStarting = false;

const coreManager = new CoreManager();

interface InstanceInfo {
    id: string;

    ui: {
        host: string;
        port: number;
    };

    core: {
        host: string;
        port: number;
    };
}

let instanceInfo: InstanceInfo | null = null;

/**
 * ============================
 * Ports
 * ============================
 */

async function findFreePort(): Promise<number> {
    return new Promise((resolve, reject) => {
        const server = net.createServer();

        server.once("error", reject);

        server.listen(0, "127.0.0.1", () => {
            const address = server.address();

            if (!address || typeof address === "string") {
                server.close();
                reject(
                    new Error(
                        "Could not determine free port"
                    )
                );
                return;
            }

            const port = address.port;

            server.close(() => {
                resolve(port);
            });
        });
    });
}

/**
 * ============================
 * Angular
 * ============================
 */

async function startAngular(): Promise<number> {
    const uiPort = await findFreePort();

    const uiPath = path.resolve(
        __dirname,
        "../../ui"
    );

    console.log("Starting Angular...");
    console.log("Angular path:", uiPath);
    console.log("Angular port:", uiPort);

    angularProcess = spawn(
        "npm",
        [
            "--prefix",
            uiPath,
            "start",
            "--",
            "--host",
            "127.0.0.1",
            "--port",
            String(uiPort)
        ],
        {
            cwd: uiPath,
            shell: true,
            windowsHide: true,
            stdio: [
                "ignore",
                "pipe",
                "pipe"
            ]
        }
    );

    console.log(
        "Angular PID:",
        angularProcess.pid
    );

    angularProcess.stdout?.on(
        "data",
        (data: Buffer) => {
            console.log(
                "[ANGULAR]",
                data.toString().trim()
            );
        }
    );

    angularProcess.stderr?.on(
        "data",
        (data: Buffer) => {
            console.error(
                "[ANGULAR ERROR]",
                data.toString().trim()
            );
        }
    );

    angularProcess.on(
        "error",
        (error) => {
            console.error(
                "Angular process error:",
                error
            );
        }
    );

    angularProcess.on(
        "exit",
        (code, signal) => {
            console.log(
                `Angular exited. code=${code}, signal=${signal}`
            );

            angularProcess = null;
        }
    );

    await waitForAngular(uiPort);

    return uiPort;
}

async function waitForAngular(
    port: number,
    timeout = 30000
): Promise<void> {
    const startedAt = Date.now();

    console.log(
        `Waiting for Angular on 127.0.0.1:${port}...`
    );

    while (Date.now() - startedAt < timeout) {
        if (isStopping) {
            throw new Error(
                "Angular startup cancelled because application is stopping"
            );
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:${port}/`
            );

            console.log(
                `Angular probe: ${response.status}`
            );

            if (response.ok) {
                console.log(
                    `Angular is ready on port ${port}`
                );

                return;
            }
        } catch {
            // Angular ещё запускается.
        }

        await delay(200);
    }

    throw new Error(
        `Angular did not become ready on port ${port}`
    );
}

/**
 * Убивает всё дерево процесса на Windows.
 *
 * Важно:
 * здесь используется execFileSync специально.
 * Нам нужно гарантированно закончить taskkill
 * до завершения Electron.
 */
function killProcessTree(
    process: ChildProcess | null,
    name: string
): void {
    if (!process?.pid) {
        return;
    }

    const pid = process.pid;

    console.log(
        `Stopping ${name} process tree: ${pid}`
    );

    try {
        execFileSync(
            "taskkill",
            [
                "/PID",
                String(pid),
                "/T",
                "/F"
            ],
            {
                windowsHide: true,
                stdio: "ignore"
            }
        );

        console.log(
            `${name} process tree stopped`
        );
    } catch (error) {
        console.error(
            `Failed to stop ${name}:`,
            error
        );
    }
}

function stopAngular(): void {
    const process = angularProcess;

    angularProcess = null;

    killProcessTree(
        process,
        "Angular"
    );
}

/**
 * ============================
 * Window
 * ============================
 */

function createWindow(
    uiPort: number
): void {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        frame: false,

        webPreferences: {
            preload: path.join(
                __dirname,
                "preload.js"
            ),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    const uiUrl =
        `http://127.0.0.1:${uiPort}`;

    console.log(
        "Loading Angular:",
        uiUrl
    );

    /*
     * Не await.
     *
     * BrowserWindow не должен блокировать
     * lifecycle Electron.
     */
    void mainWindow
        .loadURL(uiUrl)
        .catch((error) => {
            if (!isStopping) {
                console.error(
                    "Failed to load Angular:",
                    error
                );
            }
        });

    mainWindow.on(
        "closed",
        () => {
            mainWindow = null;
        }
    );
}

/**
 * ============================
 * Instance
 * ============================
 */

async function startInstance(): Promise<void> {
    if (isStarting) {
        return;
    }

    isStarting = true;

    try {
        console.log(
            "=============================="
        );

        console.log(
            "Starting DIS instance..."
        );

        /*
         * 1. Angular
         */

        const uiPort =
            await startAngular();

        if (isStopping) {
            return;
        }

        /*
         * 2. Python Core
         */

        const core =
            await coreManager.start();

        if (isStopping) {
            return;
        }

        /*
         * 3. Instance info
         */

        instanceInfo = {
            id: core.id,

            ui: {
                host: "127.0.0.1",
                port: uiPort
            },

            core: {
                host: core.host,
                port: core.port
            }
        };

        console.log(
            "DIS instance started:"
        );

        console.log(
            JSON.stringify(
                instanceInfo,
                null,
                2
            )
        );

        /*
         * 4. Window
         */

        createWindow(uiPort);

        console.log(
            "DIS window created"
        );
    } finally {
        isStarting = false;
    }
}

/**
 * ============================
 * Shutdown
 * ============================
 */

function stopInstance(): void {
    if (isStopping) {
        return;
    }

    isStopping = true;

    console.log(
        "Stopping DIS instance..."
    );

    /*
     * Сначала окно.
     */

    if (mainWindow) {
        mainWindow.removeAllListeners(
            "closed"
        );

        mainWindow.destroy();

        mainWindow = null;
    }

    /*
     * Потом Angular.
     */

    stopAngular();

    /*
     * Потом Python.
     */

    coreManager.stop();

    instanceInfo = null;

    console.log(
        "DIS instance stopped"
    );
}

/**
 * ============================
 * Helpers
 * ============================
 */

function delay(
    ms: number
): Promise<void> {
    return new Promise(
        (resolve) => {
            setTimeout(
                resolve,
                ms
            );
        }
    );
}

/**
 * ============================
 * IPC
 * ============================
 */

ipcMain.on(
    "window:minimize",
    () => {
        mainWindow?.minimize();
    }
);

ipcMain.on(
    "window:maximize",
    () => {
        if (!mainWindow) {
            return;
        }

        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
);

ipcMain.on(
    "window:close",
    () => {
        console.log(
            "Window close requested"
        );

        app.quit();
    }
);

ipcMain.handle(
    "core:get-info",
    () => {
        return coreManager.getInfo();
    }
);

ipcMain.handle(
    "instance:get-info",
    () => {
        return instanceInfo;
    }
);

/**
 * ============================
 * Electron lifecycle
 * ============================
 */

app.whenReady().then(
    async () => {
        try {
            await startInstance();
        } catch (error) {
            console.error(
                "Failed to start DIS:",
                error
            );

            stopInstance();

            /*
             * Здесь уже можно завершить Electron
             * напрямую.
             */
            app.exit(1);
        }
    }
);

app.on(
    "before-quit",
    () => {
        stopInstance();
    }
);

app.on(
    "window-all-closed",
    () => {
        /*
         * На Windows нам не нужно держать
         * приложение после закрытия окна.
         */
        app.quit();
    }
);