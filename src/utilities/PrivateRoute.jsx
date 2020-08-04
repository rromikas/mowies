import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import store from "../store/store";
import { LoginWithToken } from "../server/DatabaseApi";
import history from "../History";

const PrivateRoute = ({ Component, bearerPath, user, ...rest }) => {
  const successPath = rest.computedMatch.url;
  const [validity, setValidity] = useState({ ready: false, valid: false });

  useEffect(() => {
    console.log(localStorage["asilas"]);
    async function getData() {
      console.log(localStorage["movies_user_token"]);
      let token = JSON.parse(localStorage["movies_user_token"] || null);
      console.log("token", token === null);
      if (!token) {
        setValidity((prev) => Object.assign({}, prev, { ready: true }));
      } else {
        let data = await LoginWithToken({
          token: localStorage["movies_user_token"],
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
