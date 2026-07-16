/** @type {import('tailwindcss').Config} */
const colorVariable = (name) =>
  `rgb(var(--color-${name}) / <alpha-value>)`;

const rootTheme = {
  "--color-primary": "37 99 235",
  "--color-primary-hover": "29 78 216",
  "--color-primary-foreground": "255 255 255",
  "--color-success": "34 197 94",
  "--color-success-foreground": "255 255 255",
  "--color-warning": "245 158 11",
  "--color-warning-foreground": "15 23 42",
  "--color-destructive": "239 68 68",
  "--color-destructive-foreground": "255 255 255",
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
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: colorVariable("background"),
        foreground: colorVariable("foreground"),
        card: {
          DEFAULT: colorVariable("card"),
          foreground: colorVariable("card-foreground"),
        },
        popover: {
          DEFAULT: colorVariable("popover"),
          foreground: colorVariable("popover-foreground"),
        },
        surface: {
          DEFAULT: colorVariable("surface"),
          foreground: colorVariable("surface-foreground"),
        },
        primary: {
          DEFAULT: colorVariable("primary"),
          hover: colorVariable("primary-hover"),
          foreground: colorVariable("primary-foreground"),
        },
        secondary: {
          DEFAULT: colorVariable("secondary"),
          foreground: colorVariable("secondary-foreground"),
        },
        muted: {
          DEFAULT: colorVariable("muted"),
          foreground: colorVariable("muted-foreground"),
        },
        accent: {
          DEFAULT: colorVariable("accent"),
          foreground: colorVariable("accent-foreground"),
        },
        success: {
          DEFAULT: colorVariable("success"),
          foreground: colorVariable("success-foreground"),
        },
        warning: {
          DEFAULT: colorVariable("warning"),
          foreground: colorVariable("warning-foreground"),
        },
        destructive: {
          DEFAULT: colorVariable("destructive"),
          foreground: colorVariable("destructive-foreground"),
        },
        border: colorVariable("border"),
        input: colorVariable("input"),
        "input-border": colorVariable("input-border"),
        ring: colorVariable("ring"),
        overlay: colorVariable("overlay"),
        chart: {
          1: colorVariable("chart-1"),
          2: colorVariable("chart-2"),
          3: colorVariable("chart-3"),
          4: colorVariable("chart-4"),
          5: colorVariable("chart-5"),
        },
        progress: {
          track: colorVariable("progress-track"),
          indicator: colorVariable("progress-indicator"),
        },
      },
      fontFamily: {
        inter: ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
      },
    },
  },
  plugins: [
    ({ addBase }) =>
      addBase({
        ":root": rootTheme,
      }),
  ],
};
