import React, { useEffect, useState, Suspense } from "react";
import store from "./store/store";
import { Provider } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import history from "./History";
import Home from "./components/user/Home";
import Movie from "./components/user/Movie";
import SearchResults from "./components/user/SearchResults";
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";
import Toast from "./components/user/Toast";
import {
  GetAllRatings,
  GetAllPublicUsers,
  LoginWithToken,
  GetSettings,
} from "./server/DatabaseApi";
import Profile from "./components/user/profile/Profile";
import PrivateRoute from "./utilities/PrivateRoute";
import Navbar from "./components/user/Navbar";
import Serie from "./components/user/Serie";
import Footer from "./components/user/Footer";
import LegalDocument from "./components/user/LegalDocument";
import ForgotPassword from "./components/login/ForgotPassword";
import ResetPassword from "./components/login/ResetPassword";
import LogoLoader from "./images/LogoLoader.gif";
import MobileSearchBar from "./components/user/MobileSearchBar";

const AdminDashboard = React.lazy(() =>
  import("./components/admin/AdminDashboard")
);

function App() {
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);

  useEffect(() => {
    async function getData() {
      GetSettings((settings) => {
        if (!settings.error) {
          if (!settings.length) {
            store.dispatch({
              type: "SET_NOTIFICATION",
              notification: {
                title: "Action required",
                message:
                  "Settings are not set. Inform website administrator to set Api key and other settings for the website",
                type: "failure",
              },
            });
          } else {
            store.dispatch({ type: "UPDATE_SETTINGS", settings: settings[0] });
          }
        } else {
          store.dispatch({
            type: "SET_NOTIFICATION",
            notification: {
              title: "Action required",
              message:
                "Settings are not set. Inform website administrator to set Api key and other settings for the website",
              type: "failure",
            },
          });
        }
        setInitialLoadCompleted(true);
      });

      GetAllRatings((ratingsArr) => {
        let ratings = {};
        ratingsArr.forEach((x) => {
          ratings[x.tmdb_id] = x;
        });
        store.dispatch({ type: "SET_RATINGS", ratings });
      });

      GetAllPublicUsers((publicUsersArr) => {
        let publicUsers = {};
        publicUsersArr.forEach((x) => {
          publicUsers[x.user_id] = x;
        });
        store.dispatch({ type: "SET_PUBLICUSERS", publicUsers });
      });

      let userToken = localStorage.getItem("movies_user_token");
      if (userToken !== null && userToken.length) {
        let res = await LoginWithToken({ token: userToken });
        if (!res.error) {
          store.dispatch({ type: "SET_USER", user: res });
        }
      }

      // let errorRes = await CreateError();
      // store.dispatch({
      //   type: "SET_NOTIFICATION",
      //   notification: {
      //     title: "Action required",
      //     message: errorRes,
      //     type: "failure",
      //   },
      // });
    }
    getData();
  }, []);

  return (
    <Provider store={store}>
      <Router history={history}>
        <div className="container-fluid px-0">
          {initialLoadCompleted ? <Navbar></Navbar> : ""}
          <Switch>
            <Route
              exact
              path="/terms-and-conditions"
              render={() => (
                <LegalDocument type="terms-and-conditions"></LegalDocument>
              )}
            ></Route>
            <Route
              exact
              path="/cookies-policy"
              render={() => (
                <LegalDocument type="cookies-policy"></LegalDocument>
              )}
            ></Route>
            <Route
              exact
              path="/privacy-policy"
              render={() => (
                <LegalDocument type="privacy-policy"></LegalDocument>
              )}
            ></Route>
            <Route
              exact
              path="/"
              render={() => {
                return initialLoadCompleted ? (
                  <Home></Home>
                ) : (
                  <div className="row no-gutters justify-content-center">
                    <img
                      alt="loading"
                      height={window.innerHeight}
                      src={LogoLoader}
                    ></img>
                  </div>
                );
              }}
            ></Route>
            <Route
              exact
              path="/movie/:movieId/:reviewId/:commentId"
              component={Movie}
            ></Route>
            <Route
              exact
              path="/movie/:movieId/:reviewId"
              component={Movie}
            ></Route>
            <Route exact path="/movie/:movieId" component={Movie}></Route>
            <Route exact path="/series/:movieId" component={Serie}></Route>
            <Route exact path="/search" component={SearchResults}></Route>
            <PrivateRoute
              exact
              path="/admin"
              bearerPath="/login"
              Component={() => (
                <Suspense fallback={<div>Loading...</div>}>
                  <AdminDashboard />
                </Suspense>
              )}
            ></PrivateRoute>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/signup" component={Signup}></Route>
            <Route
              exact
              path="/forgot-password"
              component={ForgotPassword}
            ></Route>
            <Route
              exact
              path="/reset-password/:token"
              component={ResetPassword}
            ></Route>
            <Route
              exact
              path="/profile/:userId/:section"
              component={Profile}
            ></Route>
            <Route exact path="/profile/:userId" component={Profile}></Route>
          </Switch>
          {initialLoadCompleted ? <Footer></Footer> : ""}
          <div style={{ overflow: "auto" }}>
            <MobileSearchBar></MobileSearchBar>
          </div>

          <Toast></Toast>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
