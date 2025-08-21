
export const getThemeBackground = (theme: any, variant: 'default' | 'paper' = 'paper') => {
  return theme.palette.background[variant];
};

export const getThemeTextColor = (theme: any, variant: 'primary' | 'secondary' = 'primary') => {
  return theme.palette.text[variant];
};

export const getThemeShadow = (theme: any, elevation: number = 1) => {
  if (theme.palette.mode === 'dark') {
    return `0px 2px ${elevation * 2}px rgba(0, 0, 0, 0.${Math.min(8, elevation * 2)})`;
  }
  return theme.shadows[elevation];
};

export const getThemeGradient = (theme: any, colorStart: string, colorEnd?: string) => {
  const start = colorStart || theme.palette.primary.main;
  const end = colorEnd || theme.palette.primary.dark;
  return `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
};