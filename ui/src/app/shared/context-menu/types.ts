import {ProjectApiService} from "@app/services/project-api.service";

export type MenuActionHandler<Ctx = any> = (ctx: Ctx, action: string, service: ProjectApiService) => void;

export interface MenuItemBase {
    action: string;
    text: string;
    group?: string;
    icon?: string;
}

export interface ActionMenuItem<Ctx = any> extends MenuItemBase {
    click: MenuActionHandler<Ctx>;
}

export interface GroupMenuItem<Ctx = any> extends MenuItemBase {
    children: MenuItem<Ctx>[];
}

export type MenuItem<Ctx = any> = ActionMenuItem<Ctx> | GroupMenuItem<Ctx>;

export type ContextMenuItems = MenuItem[];

export enum MenuAlignmentEdge {
    Start = 'start',
    End = 'end',
    Center = 'center',
}

/**
 * Направление открытия подменю по горизонтальной оси:
 * Start — справа от кнопки;
 * End — слева от кнопки;
 * Center — по центру кнопки.
 */
export enum MenuPlacement {
    Cursor = 'cursor',
    Submenu = 'submenu',
}

export interface MenuAlignment {
    x: MenuAlignmentEdge;
    y: MenuAlignmentEdge;
}

export interface MenuPoint {
    x: number;
    y: number;
}

export interface MenuPositionOptions {
    point?: MenuPoint | null;
    anchor?: HTMLElement | null;
    alignment?: MenuAlignment;
    placement?: MenuPlacement;
    boundary?: HTMLElement | null;
}

export const DEFAULT_MENU_ALIGNMENT: MenuAlignment = {
    x: MenuAlignmentEdge.Start,
    y: MenuAlignmentEdge.Start,
};

export interface MenuPosition {
    left: number;
    top: number;
}