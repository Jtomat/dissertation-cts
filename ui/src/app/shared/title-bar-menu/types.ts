export interface TitleBarMenuItem {
    label: string;
    icon?: string;
    command?: string;
    disabled?: boolean;
    separator?: boolean;
    children?: TitleBarMenuItem[];
}