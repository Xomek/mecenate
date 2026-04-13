export const tokens = {
  colors: {
    primary: "#6115CD",
    secondary: "#FF6B6B",

    background: "#FFFFFF",
    surface: "#F8F9FA",
    card: "#FFFFFF",

    textPrimary: "#1A1A1A",
    textSecondary: "#6C757D",
    textTertiary: "#ADB5BD",

    border: "#E9ECEF",
    separator: "#DEE2E6",

    error: "#DC3545",
    success: "#28A745",
    warning: "#FFC107",

    paidOverlay: "rgba(0, 0, 0, 0.5)",
    shadow: "rgba(0, 0, 0, 0.1)",

    icon: "#8E8E93",
    like: "#FF3B30",
    buttonBackground: "#F2F2F7",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  typography: {
    fontFamily: {
      regular: "System",
      medium: "System",
      semiBold: "System",
      bold: "System",
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    },
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05",
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
    },
  },

  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
};

export type ThemeTokens = typeof tokens;
