import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Checkbox as MuiCheckbox } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "rgb(255, 0, 64)",
    },
    secondary: {
      main: "#202020",
    },
  },
});

const Checkbox = (props) => {
  return (
    <MuiThemeProvider theme={theme}>
      <MuiCheckbox {...props}></MuiCheckbox>
    </MuiThemeProvider>
  );
};

export default Checkbox;
