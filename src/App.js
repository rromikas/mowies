import React, { useEffect } from "react";
import store from "./store/store";
import { Provider } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import history from "./History";
import Home from "./components/user/Home";
import Movie from "./components/user/Movie";
import SearchResults from "./components/user/SearchResults";
import AdminDashboard from "./components/admin/AdminDashboard";
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";
import Toast from "./components/user/Toast";
import {
  GetAllRatings,
  GetAllPublicUsers,
  LoginWithToken,
  GetPopularReviews,
  GetSettings,
} from "./server/DatabaseApi";
import { GetTrendingMovies } from "./server/MoviesApi";
import Profile from "./components/user/profile/Profile";
import PrivateRoute from "./utilities/PrivateRoute";
import LegalDocument from "./components/user/LegalDocument";
import Navbar from "./components/user/Navbar";
import Serie from "./components/user/Serie";
import Footer from "./components/user/Footer";
import CookiesPolicy from "./components/user/CookiesPolicy";
import TermsAndConditions from "./components/user/TermsAndConditions";
import PrivacyPolicy from "./components/user/PrivacyPolicy";

function App() {
  useEffect(() => {
    async function getData() {
      let trending = await GetTrendingMovies();
      let settings = await GetSettings();
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
      let ratingsArr = await GetAllRatings();
      let ratings = {};
      ratingsArr.forEach((x) => {
        ratings[x.tmdb_id] = x;
      });
      store.dispatch({ type: "SET_RATINGS", ratings });
      let publicUsers = {};
      let publicUsersArr = await GetAllPublicUsers();
      publicUsersArr.forEach((x) => {
        publicUsers[x.user_id] = x;
      });
      store.dispatch({ type: "SET_PUBLICUSERS", publicUsers });

      let userToken = localStorage.getItem("movies_user_token");
      if (userToken !== null && userToken.length) {
        let res = await LoginWithToken({ token: userToken });
        if (!res.error) {
          store.dispatch({ type: "SET_USER", user: res });
        }
      }
    }
    getData();
  }, []);
  return (
    <Provider store={store}>
      <Router history={history}>
        <div className="container-fluid px-0">
          <Navbar></Navbar>
          <Switch>
            <Route
              exact
              path="/terms-and-conditions"
              component={TermsAndConditions}
            ></Route>
            <Route
              exact
              path="/cookies-policy"
              component={CookiesPolicy}
            ></Route>
            <Route
              exact
              path="/privacy-policy"
              component={PrivacyPolicy}
            ></Route>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/movie/:movieId" component={Movie}></Route>
            <Route exact path="/series/:movieId" component={Serie}></Route>
            <Route exact path="/search" component={SearchResults}></Route>
            <PrivateRoute
              exact
              path="/admin"
              bearerPath="/login"
              Component={AdminDashboard}
            ></PrivateRoute>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/signup" component={Signup}></Route>
            <Route
              exact
              path="/profile/:userId/:section"
              component={Profile}
            ></Route>
            <Route exact path="/profile/:userId" component={Profile}></Route>
          </Switch>
          <Footer></Footer>
          <Toast></Toast>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
