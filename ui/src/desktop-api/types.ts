export interface DesktopAPI {

    minimize(): void;

    maximize(): void;

    close(): void;

    getCoreInfo(): Promise<{
        id: string;
        host: string;
        port: number;
    } | null>;
}

declare global {
    interface Window {
        desktopAPI: DesktopAPI;
    }
}

export {};

export {};