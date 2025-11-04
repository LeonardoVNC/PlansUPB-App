export const palette = {
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    contrastText: '#ffffff',
    subtitle: '#475569',
    primary: '#3b82f6',
    muted: '#94a3b8',
    border: '#e2e8f0',
    tabBarBackground: '#ffffff',
    drawerBackground: '#ffffff',
    switchTrackOn: '#3b82f6',
    switchTrackOff: '#94a3b8',
    switchThumb: '#ffffff',
    danger: '#dc2626',
    success: '#16a34a',
    warning: '#ca8a04'
  },
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    contrastText: '#0f1419',
    subtitle: '#94a3b8',
    primary: '#60a5fa',
    muted: '#64748b',
    border: '#374151',
    tabBarBackground: '#1c1f23',
    drawerBackground: '#0f1419',
    switchTrackOn: '#60a5fa',
    switchTrackOff: '#64748b',
    switchThumb: '#1c1f23',
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#eab308'
  },
} as const;

export type Theme = keyof typeof palette;
export type ThemeColors = (typeof palette)[Theme];