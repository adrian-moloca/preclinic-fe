export type ThemeMode = 'light' | 'dark' | 'high-contrast';
export type ThemeColor = 'blue' | 'green' | 'purple';

export interface ThemeSettings {
  mode: ThemeMode;
  colorScheme: ThemeColor;
}

export interface ThemeContextType {
  themeSettings: ThemeSettings;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeColor: (color: ThemeColor) => void;
  resetTheme: () => void;
}