export const palette = {
  light: {
    background: '#e5e8ed',        
    surface: '#f8fafc',           
    text: '#1e293b',              
    contrastText: '#ffffff',      
    subtitle: '#475569',         
    primary: '#1d4ed8',           
    primaryLight: '#3b82f6',      
    primaryDark: '#1e3a8a',       
    muted: '#64748b',             
    border: '#cbd5e1',            
    tabBarBackground: '#f1f5f9',  
    drawerBackground: '#f8fafc',  
    switchTrackOn: '#1d4ed8',     
    switchTrackOff: '#94a3b8',   
    switchThumb: '#f8fafc',       
    danger: '#b91c1c',            
    success: '#15803d',           
    warning: '#b45309'            
  },
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    contrastText: '#f8fafc',
    subtitle: '#94a3b8',
    primary: '#60a5fa',
    primaryLight: '#93c5fd',
    primaryDark: '#2563eb',
    muted: '#64748b',
    border: '#374151',
    tabBarBackground: '#0f172a',
    drawerBackground: '#1e293b',
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