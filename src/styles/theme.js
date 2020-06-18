import { createMuiTheme } from "@material-ui/core/styles";
export default createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "rgba(255, 255, 255, 1)" },
    primary: {
      light: "rgba(94, 94, 94, 1)",
      main: "rgba(68, 68, 68, 1)",
      dark: "rgba(0, 0, 0, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(173, 173, 173, 1)",
      main: "rgba(128, 126, 126, 1)",
      dark: "rgba(92, 92, 92, 1)",
      contrastText: "#fff",
    },
    error: {
      light: "rgba(233, 121, 121, 1)",
      main: "rgba(196, 42, 29, 1)",
      dark: "rgba(168, 0, 0, 1)",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});
