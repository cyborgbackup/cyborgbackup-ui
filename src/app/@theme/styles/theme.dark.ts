import { NbJSThemeOptions, DARK_THEME as baseTheme } from '@nebular/theme';

const baseThemeVariables = baseTheme.variables;

export const DARK_THEME: NbJSThemeOptions = {
  name: 'dark',
  base: 'dark',
  variables: {
    echarts: {
      bg: baseThemeVariables.bg,
      textColor: '#ffffff',
      axisLineColor: baseThemeVariables.fgText,
      splitLineColor: baseThemeVariables.separator,
      itemHoverShadowColor: 'rgba(0, 0, 0, 0.5)',
      tooltipBackgroundColor: baseThemeVariables.primary,
      tooltipTextStyleColor: '#000000',
      areaOpacity: '0.7',
    },
  },
};
