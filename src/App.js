import React, { useEffect, useState } from "react";
import store from "./store/store";
import { Provider } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import history from "./History";
import Home from "./components/Home";
import Movie from "./components/Movie";
import SearchResults from "./components/SearchResults";

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <div className="container-fluid px-0">
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/movie/:movieId" component={Movie}></Route>
            <Route exact path="/search" component={SearchResults}></Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
