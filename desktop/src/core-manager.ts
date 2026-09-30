import {
    ChildProcess,
    spawn,
    execFileSync
} from "node:child_process";

import path from "node:path";
import net from "node:net";

export interface CoreInfo {
    id: string;
    host: string;
    port: number;
}

export class CoreManager {
    private process: ChildProcess | null = null;
    private info: CoreInfo | null = null;

    async start(): Promise<CoreInfo> {
        if (
            this.process &&
            this.info
        ) {
            return this.info;
        }

        const backendPath =
            path.resolve(
                __dirname,
                "../../backend"
            );

        const pythonPath =
            path.join(
                backendPath,
                ".venv",
                "Scripts",
                "python.exe"
            );

        const port =
            await this.findFreePort();

        const instanceId =
            crypto.randomUUID();

        console.log(
            "Starting Python Core"
        );

        console.log(
            "Python:",
            pythonPath
        );

        console.log(
            "Backend:",
            backendPath
        );

        console.log(
            "Port:",
            port
        );

        this.process = spawn(
            pythonPath,
            [
                "-m",
                "uvicorn",
                "app.main:app",
                "--host",
                "127.0.0.1",
                "--port",
                String(port)
            ],
            {
                cwd: backendPath,
                windowsHide: true
            }
        );

        console.log(
            "Python PID:",
            this.process.pid
        );

        this.process.stdout?.on(
            "data",
            (data: Buffer) => {
                console.log(
                    "[PYTHON]",
                    data.toString().trim()
                );
            }
        );

        this.process.stderr?.on(
            "data",
            (data: Buffer) => {
                console.error(
                    "[PYTHON ERROR]",
                    data.toString().trim()
                );
            }
        );

        this.process.on(
            "error",
            (error) => {
                console.error(
                    "Python Core error:",
                    error
                );
            }
        );

        this.process.on(
            "exit",
            (code, signal) => {
                console.log(
                    `Python Core exited: code=${code}, signal=${signal}`
                );

                this.process = null;
                this.info = null;
            }
        );

        await this.waitUntilReady(port);

        this.info = {
            id: instanceId,
            host: "127.0.0.1",
            port
        };

        console.log(
            "Python Core ready:",
            this.info
        );

        return this.info;
    }

    stop(): void {
        const process =
            this.process;

        this.process = null;
        this.info = null;

        if (!process?.pid) {
            return;
        }

        const pid = process.pid;

        console.log(
            `Stopping Python Core process tree: ${pid}`
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
                "Python Core process tree stopped"
            );
        } catch (error) {
            console.error(
                "Failed to stop Python Core:",
                error
            );
        }
    }

    getInfo(): CoreInfo | null {
        return this.info;
    }

    private async findFreePort(): Promise<number> {
        return new Promise(
            (resolve, reject) => {
                const server =
                    net.createServer();

                server.once(
                    "error",
                    reject
                );

                server.listen(
                    0,
                    "127.0.0.1",
                    () => {
                        const address =
                            server.address();

                        if (
                            !address ||
                            typeof address ===
                            "string"
                        ) {
                            server.close();

                            reject(
                                new Error(
                                    "Could not determine free port"
                                )
                            );

                            return;
                        }

                        const port =
                            address.port;

                        server.close(
                            () => {
                                resolve(port);
                            }
                        );
                    }
                );
            }
        );
    }

    private async waitUntilReady(
        port: number,
        timeout = 10000
    ): Promise<void> {
        const startedAt =
            Date.now();

        while (
            Date.now() - startedAt <
            timeout
            ) {
            try {
                const response =
                    await fetch(
                        `http://127.0.0.1:${port}/api/health`
                    );

                if (response.ok) {
                    return;
                }
            } catch {
                // Python ещё запускается.
            }

            await new Promise(
                (resolve) => {
                    setTimeout(
                        resolve,
                        100
                    );
                }
            );
        }

        const process =
            this.process;

        this.process = null;
        this.info = null;

        if (process?.pid) {
            try {
                execFileSync(
                    "taskkill",
                    [
                        "/PID",
                        String(process.pid),
                        "/T",
                        "/F"
                    ],
                    {
                        windowsHide: true,
                        stdio: "ignore"
                    }
                );
            } catch {
                // Уже завершился.
            }
        }

        throw new Error(
            `Python Core failed to become ready on port ${port}`
        );
    }
}