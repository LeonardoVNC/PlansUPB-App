import { useThemeStore } from '../store/useThemeStore';
import { palette } from '../styles/colors';

export const useThemeColors = () => {
  const theme = useThemeStore((state) => state.theme);
  return { theme, colors: palette[theme] };
};
