import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Header } from "./Header";
import { Home } from "./Home";
import { Login } from "./Login";
import { Register } from "./Register";
import { Videoroom } from "./Videoroom";

export function Main() {
  return (
    <BrowserRouter>
      <Header />

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/videoroom">
          <Videoroom />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
