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
} from "./server/DatabaseApi";

function App() {
  useEffect(() => {
    async function getData() {
      let ratingsArr = await GetAllRatings();
      let ratings = {};
      ratingsArr.forEach((x) => {
        ratings[x.tmdb_id] = x;
      });
      let publicUsers = {};
      let publicUsersArr = await GetAllPublicUsers();
      publicUsersArr.forEach((x) => {
        publicUsers[x.user_id] = x;
      });

      let userToken = localStorage.getItem("movies_user_token");
      if (userToken) {
        let res = await LoginWithToken({ token: userToken });
        if (!res.error) {
          store.dispatch({ type: "SET_USER", user: res });
        }
      }

      store.dispatch({ type: "SET_PUBLICUSERS", publicUsers });
      store.dispatch({ type: "SET_RATINGS", ratings });
    }
    getData();
  }, []);
  return (
    <Provider store={store}>
      <Router history={history}>
        <div className="container-fluid px-0">
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/movie/:movieId" component={Movie}></Route>
            <Route exact path="/movie/:movieId" component={Movie}></Route>
            <Route exact path="/search" component={SearchResults}></Route>
            <Route exact path="/admin" component={AdminDashboard}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/signup" component={Signup}></Route>
          </Switch>
          <Toast></Toast>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
