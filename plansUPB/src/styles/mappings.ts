import { palette } from './colors';

export const mappingLight = {
    color: {
        'color-primary-100': palette.light.primary + '20',
        'color-primary-200': palette.light.primary + '30',
        'color-primary-300': palette.light.primary + '40',
        'color-primary-400': palette.light.primary + '50',
        'color-primary-500': palette.light.primary,
        'color-primary-600': palette.light.primary + '80',
        'color-primary-700': palette.light.primary + '90',
        'color-primary-800': palette.light.primary + '95',
        'color-primary-900': palette.light.primary + '99',

        'color-secondary-500': palette.light.muted,
        'color-basic-100': palette.light.background,
        'color-basic-200': palette.light.surface,
        'color-basic-300': palette.light.contrastText,
        'color-text-100': palette.light.text,
        'color-text-500': palette.light.subtitle,
        'color-text-900': palette.light.text,

        'color-border-200': palette.light.border,
        'color-basic-transparent': 'transparent',

        'color-tab-bar-background': palette.light.tabBarBackground,
        'color-drawer-background': palette.light.drawerBackground,
    },
    border: {
        radius: 8,
    },
};

export const mappingDark = {
    color: {
        'color-primary-100': palette.dark.primary + '20',
        'color-primary-200': palette.dark.primary + '30',
        'color-primary-300': palette.dark.primary + '40',
        'color-primary-400': palette.dark.primary + '50',
        'color-primary-500': palette.dark.primary,
        'color-primary-600': palette.dark.primary + '80',
        'color-primary-700': palette.dark.primary + '90',
        'color-primary-800': palette.dark.primary + '95',
        'color-primary-900': palette.dark.primary + '99',

        'color-secondary-500': palette.dark.muted,
        'color-basic-100': palette.dark.background,
        'color-basic-200': palette.dark.surface,
        'color-basic-300': palette.dark.contrastText,
        'color-text-100': palette.dark.text,
        'color-text-500': palette.dark.subtitle,
        'color-text-900': palette.dark.text,

        'color-border-200': palette.dark.border,
        'color-basic-transparent': 'transparent',

        'color-tab-bar-background': palette.dark.tabBarBackground,
        'color-drawer-background': palette.dark.drawerBackground,
    },
    border: {
        radius: 8,
    },
};
