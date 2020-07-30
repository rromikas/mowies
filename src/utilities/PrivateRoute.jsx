import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { ReadUser } from "../api/socket-requests";
import { connect } from "react-redux";

const PrivateRoute = ({ Component, bearerPath, user, ...rest }) => {
  const successPath = rest.computedMatch.url;
  const [validity, setValidity] = useState({ ready: false, valid: false });

  return validity.ready ? (
    <Route
      {...rest}
      render={(props) => {
        return validity.valid ? (
          <Component {...props}></Component>
        ) : (
          <Redirect
            to={{ pathname: bearerPath, state: { successPath: successPath } }}
          ></Redirect>
        );
      }}
    ></Route>
  ) : (
    <div></div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    ...ownProps,
  };
}

export default PrivateRoute;
