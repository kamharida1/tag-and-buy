import React, { ReactNode } from "react";
import { Dimensions, ViewStyle, TextStyle, ImageStyle } from "react-native";
import {
  createTheme,
  createText,
  createBox,
  useTheme as useReTheme,
  ThemeProvider as ReStyleThemeProvider,
} from "@shopify/restyle";

const { width } = Dimensions.get("window");
export const aspectRatio = width / 374;

export const palette = {
  primary: "rgba(12, 13, 13, 0.7)",
  white: "#FFFFFF",
  cyan: "#2CB9B0",
  lightCyan: "#E7F9F7",
  darkBlue: "#0C0D34",
  orange: "#FE5E33",
  yellow: "#FFC641",
  pink: "#FF87A2",
  darkPink: "#FF0058",
  violet: "#442CB9",
  lightBlue: "#BFEAF5",
  grey: "#F4F0EF",
  darkGrey: "#808080",
  faceBookGrey: "#e1e4e8",
  bgSurface: "rgba(241,241, 241, 1)",
  bgSurfaceSelected: "rgba(235, 235, 235, 1)",
  bgSurfaceInverse: "rgba(181, 181, 181, 1)",
  bgSurfaceInfo: "rgba(202, 230, 255, 1)",
  bgSurfaceSuccess: "rgba(180, 254, 210, 1)",
  bgSurfaceCaution: "rgba(255, 248, 219, 1)",
  bgSurfaceWarning: "rgba(255,228,198,1)",
  bgSurfaceEmphasis: "rgba(232, 243, 255, 1)",
  bgSurfaceCritical: "rgba(255, 205, 210, 1)",
  textDark: "rgba(25, 25, 25, 0.9)",
  textInfo: "rgba(91, 91, 91, 1)",
  textSuccess: "rgba(12, 81, 50, 1)",
  textCaution: "rgba(255, 203, 0, 1)",
  textWarning: "rgba(178, 133, 0, 1)",
  textEmphasis: "rgba(0, 45, 112, 1)",
  textCritical: "rgba(142, 31, 11, 1)",
  bgFillMagic: "rgba(223, 217, 255, 1)",
  borderInfo: "rgba(145, 208, 255, 1)",
  borderSuccess: "rgba(46, 254, 194, 1)",
  borderCaution: "rgba(255, 235, 0, 1)",
  borderWarning: "rgba(255, 200, 121, 1)",
  borderEmphasis: "rgba(0, 91, 211, 1)",
  borderCritical: "rgba(142, 31, 11, 1)",
};

const theme = createTheme({
  colors: {
    background: palette.white,
    background2: palette.grey,
    primary: palette.cyan,
    primary2: palette.primary,
    primaryLight: palette.lightCyan,
    secondary: palette.darkBlue,
    disabled: palette.darkGrey,
    text: palette.lightBlue,
    danger: palette.darkPink,
    body: "rgba(12, 13, 52, 0.7)",
    faceBookGrey: palette.faceBookGrey,
    bgSurface: palette.bgSurface,
    bgSurfaceSelected: palette.bgSurfaceSelected,
    bgSurfaceInverse: palette.bgSurfaceInverse,
    bgSurfaceInfo: palette.bgSurfaceInfo,
    bgSurfaceSuccess: palette.bgSurfaceSuccess,
    bgSurfaceCaution: palette.bgSurfaceCaution,
    bgSurfaceWarning: palette.bgSurfaceWarning,
    bgSurfaceEmphasis: palette.bgSurfaceEmphasis,
    bgSurfaceCritical: palette.bgSurfaceCritical,
    textDark: palette.textDark,
    textInfo: palette.textInfo,
    textSuccess: palette.textSuccess,
    textCaution: palette.textCaution,
    textWarning: palette.textWarning,
    textEmphasis: palette.textEmphasis,
    textCritical: palette.textCritical,
    bgFillMagic: palette.bgFillMagic,
    borderInfo: palette.borderInfo,
    borderSuccess: palette.borderSuccess,
    borderCaution: palette.borderCaution,
    borderWarning: palette.borderWarning,
    borderEmphasis: palette.borderEmphasis,
    borderCritical: palette.borderCritical,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  borderRadii: {
    s: 4,
    m: 10,
    l: 25,
    xl: 75,
  },
  textVariants: {
    defaults: {
      fontSize: 15,
      fontFamily: "airRegular",
      color: "secondary",
    },
    hero: {
      fontWeight: "bold",
      fontSize: 35,
      lineHeight: 80,
      color: "textDark",
      textAlign: "center",
    },
    title1: {
      fontWeight: "500",
      fontSize: 24,
      color: "textDark",
      fontFamily: "airBold",
    },
    title2: {
      fontSize: 24,
      lineHeight: 30,
      color: "textCritical",
      fontFamily: "airMedium",
    },
    title3: {
      fontSize: 16,
      color: "textDark",
      fontFamily: "airMedium",
    },
    body: {
      //fontSize: 15,
      lineHeight: 24,
      color: "textDark",
      fontFamily: "airMedium",
    },
    body2: {
      fontSize: 14,
      lineHeight: 20,
      color: "textInfo",
      fontFamily: "airRegular",
    },
    button: {
      fontSize: 15,
      color: "secondary",
      fontFamily: "airBold",
    },
    header: {
      fontSize: 30,
      //lineHeight: 24,
      color: "textDark",
      fontFamily: "airBold",
    },
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <ReStyleThemeProvider {...{ theme }}>{children}</ReStyleThemeProvider>
);
export type Theme = typeof theme;
export const Box = createBox<Theme>();
export const Text = createText<Theme>();
export const useTheme = () => useReTheme<Theme>();

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export const makeStyles =
  <T extends NamedStyles<T>>(styles: (theme: Theme) => T) =>
  () => {
    const currentTheme = useTheme();
    return styles(currentTheme);
  };
