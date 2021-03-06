import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import store from "../store/store";
import { LoginWithToken } from "../server/DatabaseApi";
import history from "../History";

const PrivateRoute = ({ Component, bearerPath, user, ...rest }) => {
  const successPath = rest.computedMatch.url;
  const [validity, setValidity] = useState({ ready: false, valid: false });

  useEffect(() => {
    async function getData() {
      let token = localStorage.getItem("movies_user_token");
      if (token === null || !token.length) {
        setValidity((prev) => Object.assign({}, prev, { ready: true }));
      } else {
        let data = await LoginWithToken({
          token,
        });
        if (!data.error) {
          if (data.role === "Administrator") {
            setValidity((prev) =>
              Object.assign({}, prev, { ready: true, valid: true })
            );
          } else {
            store.dispatch({
              type: "SET_NOTIFICATION",
              notification: {
                title: "Your role is not admin",
                message: "Contact website administrator to change your role",
                type: "failure",
              },
            });
            history.push("/");
          }
        } else {
          history.push("/");
          store.dispatch({
            type: "SET_NOTIFICATION",
            notification: {
              title: "Your role is not admin",
              message: "Only website admins can access this page",
              type: "failure",
            },
          });
        }
      }
    }
    getData();
  }, []);

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

export default PrivateRoute;
