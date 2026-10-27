export enum ProjectEventSide {
    UI = 'ui',
    Server = 'server',
}

export interface ProjectEvent<T = any> {
    target: ProjectEventSide;
    type: string;
    data: T;
}