export interface DesktopAPI {
    window: {
        minimize(): void;
        maximize(): void;
        close(): void;
    };
}

declare global {
    interface Window {
        desktop: DesktopAPI;
    }
}

export {};