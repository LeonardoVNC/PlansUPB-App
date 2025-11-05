export const palette = {
  light: {
    background: '#e5e8ed',        // gris azulado suave para fondo detrás de cards
    surface: '#f8fafc',           // superficie clara pero con un toque frío
    text: '#1e293b',              // azul gris oscuro, serio y elegante
    contrastText: '#ffffff',      // blanco para contraste en botones o headers
    subtitle: '#475569',          // gris azulado intermedio, limpio y profesional
    primary: '#1d4ed8',           // azul profundo corporativo (menos saturado)
    primaryLight: '#3b82f6',      // azul moderadamente brillante para hover
    primaryDark: '#1e3a8a',       // azul marino formal
    muted: '#64748b',             // gris azulado sobrio para texto secundario
    border: '#cbd5e1',            // gris azulado medio
    tabBarBackground: '#f1f5f9',  // gris claro ligeramente frío
    drawerBackground: '#f8fafc',  // limpio pero no blanco puro
    switchTrackOn: '#1d4ed8',     // azul corporativo sobrio
    switchTrackOff: '#94a3b8',    // gris azulado atenuado
    switchThumb: '#f8fafc',       // tono claro para contraste sutil
    danger: '#b91c1c',            // rojo oscuro más elegante
    success: '#15803d',           // verde oscuro, menos saturado
    warning: '#b45309'            // dorado oscuro, más formal
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