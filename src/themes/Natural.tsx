import { createTheme } from "@mui/material/styles";
import ExtendedTheme from "./../types/Theme";

const Natural = createTheme({
  palette: {
    primary: {
      main: "#765f43",
    },
    secondary: {
      main: "#dccdc4",
    },
    ternary: {
      main: "#fff3ec",
    },
    quaternary: {
      main: "#756449",
    },
    background: {
      default: "#fdf6eb",
    },
    red: {
      main: "#d1232a",
    },
    cyan: {
      main: "#00aeef",
    },
    black: {
      main: "#000000",
    },
    white: {
      main: "#ffffff",
    },
    purple: {
      main: "#794a75",
    },
  } as ExtendedTheme['palette'],
  typography: {
    fontFamily: ["PT Sans Narrow", "sans-serif"].join(","),
    body1: {
      lineHeight: 1.45,
    },
    h1: {
      fontFamily: ["Antonio", "sans-serif"].join(","),
      fontSize: "2em",
      lineHeight: 1.618,
    },
    h2: {
      fontFamily: ["Antonio", "sans-serif"].join(","),
      fontSize: "1.5em",
      lineHeight: 1.618,
    },
    h3: {
      fontFamily: ["Antonio", "sans-serif"].join(","),
      fontSize: "1.17em",
      lineHeight: 1.618,
    },
    h4: {
      fontFamily: ["Antonio", "sans-serif"].join(","),
      fontSize: "1em",
      lineHeight: 1.618,
    },
    h5: {
      fontFamily: ["Antonio", "sans-serif"].join(","),
      fontSize: "0.83em",
      lineHeight: 1.618,
    },
    h6: {
      fontFamily: ["Antonio", "sans-serif"].join(","),
      fontSize: "0.75em",
      lineHeight: 1.618,
    },
  },
});

export default Natural;
