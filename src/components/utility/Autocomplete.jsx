import { default as MuiAutocomplete } from "@material-ui/lab/Autocomplete";
import React from "react";
import TextField from "@material-ui/core/TextField";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
}));

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

const Autocomplete = (props) => {
  const classes = useStyles();
  return (
    <MuiThemeProvider theme={theme}>
      <MuiAutocomplete
        {...props}
        classes={classes}
        multiple
        id="tags-outlined"
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder={props.placeholder}
          />
        )}
      ></MuiAutocomplete>
    </MuiThemeProvider>
  );
};

export default Autocomplete;
