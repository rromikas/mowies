import React, { useEffect, useState } from "react";
import store from "./store/store";
import { Provider } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import history from "./History";
import Home from "./components/Home";
import Movie from "./components/Movie";
import SearchResults from "./components/SearchResults";
import AdminDashboard from "./components/admin/AdminDashboard";
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <div className="container-fluid px-0">
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/movie/:movieId" component={Movie}></Route>
            <Route exact path="/search" component={SearchResults}></Route>
            <Route exact path="/admin" component={AdminDashboard}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/signup" component={Signup}></Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
