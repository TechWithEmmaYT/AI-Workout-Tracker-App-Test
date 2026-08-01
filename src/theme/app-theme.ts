import { useColorScheme, vars } from "nativewind";

export const appThemeColors = {
  light: {
    background: "#FFFFFF",
    border: "#E2E8F0",
    foreground: "#0F172A",
    mutedForeground: "#64748B",
    primary: "#2563EB",
    primaryForeground: "#FFFFFF",
    warning: "#F59E0B",
  },
  dark: {
    background: "#020617",
    border: "#334155",
    foreground: "#F8FAFC",
    mutedForeground: "#94A3B8",
    primary: "#2563EB",
    primaryForeground: "#FFFFFF",
    warning: "#FBBF24",
  },
} as const;

export type AppThemeColor = keyof (typeof appThemeColors)["light"];

export function useAppThemeColor(color: AppThemeColor) {
  const { colorScheme } = useColorScheme();
  return appThemeColors[colorScheme === "dark" ? "dark" : "light"][color];
}

const sharedBrandColors = {
  "--color-primary": "37 99 235",
  "--color-primary-hover": "29 78 216",
  "--color-primary-foreground": "255 255 255",
  "--color-success": "34 197 94",
  "--color-success-foreground": "255 255 255",
  "--color-warning": "245 158 11",
  "--color-warning-foreground": "15 23 42",
  "--color-destructive": "239 68 68",
  "--color-destructive-foreground": "255 255 255",
};

export const appThemes = {
  light: vars({
    ...sharedBrandColors,
    "--color-background": "255 255 255",
    "--color-foreground": "15 23 42",
    "--color-card": "248 250 252",
    "--color-card-foreground": "15 23 42",
    "--color-popover": "255 255 255",
    "--color-popover-foreground": "15 23 42",
    "--color-surface": "248 250 252",
    "--color-surface-foreground": "15 23 42",
    "--color-muted": "241 245 249",
    "--color-muted-foreground": "100 116 139",
    "--color-border": "226 232 240",
    "--color-input": "255 255 255",
    "--color-input-border": "226 232 240",
    "--color-ring": "59 130 246",
    "--color-secondary": "241 245 249",
    "--color-secondary-foreground": "15 23 42",
    "--color-accent": "239 246 255",
    "--color-accent-foreground": "37 99 235",
    "--color-chart-1": "37 99 235",
    "--color-chart-2": "59 130 246",
    "--color-chart-3": "34 197 94",
    "--color-chart-4": "245 158 11",
    "--color-chart-5": "239 68 68",
    "--color-progress-track": "226 232 240",
    "--color-progress-indicator": "37 99 235",
    "--color-overlay": "15 23 42",
  }),

  dark: vars({
    ...sharedBrandColors,
    "--color-background": "2 6 23",
    "--color-foreground": "248 250 252",
    "--color-card": "15 23 42",
    "--color-card-foreground": "248 250 252",
    "--color-popover": "15 23 42",
    "--color-popover-foreground": "248 250 252",
    "--color-surface": "15 23 42",
    "--color-surface-foreground": "241 245 249",
    "--color-muted": "30 41 59",
    "--color-muted-foreground": "148 163 184",
    "--color-border": "51 65 85",
    "--color-input": "15 23 42",
    "--color-input-border": "71 85 105",
    "--color-ring": "59 130 246",
    "--color-secondary": "30 41 59",
    "--color-secondary-foreground": "241 245 249",
    "--color-accent": "30 58 138",
    "--color-accent-foreground": "191 219 254",
    "--color-chart-1": "59 130 246",
    "--color-chart-2": "56 189 248",
    "--color-chart-3": "45 212 191",
    "--color-chart-4": "251 191 36",
    "--color-chart-5": "248 113 113",
    "--color-progress-track": "51 65 85",
    "--color-progress-indicator": "59 130 246",
    "--color-overlay": "0 0 0",
  }),
};
