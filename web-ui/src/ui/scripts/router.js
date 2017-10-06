import React from "react";
import {Switch, HashRouter, Route } from 'react-router-dom';
import App from "./components/App";
import Home from "./pages/Home";
import Live from "./pages/Live";
import Still from "./pages/Still";
import Print from "./pages/Print";
import Share from "./pages/Share";
import DefaultLayout from "./pages/Layout";

// build the router
const router = (
    <HashRouter onUpdate={() => window.scrollTo(0, 0)}>
      <Switch component={App}>
        <DefaultLayout exact path="/" component={Home}/>
        <DefaultLayout path="/live" component={Live}/>
        <DefaultLayout path="/still" component={Still}/>
        <DefaultLayout path="/print" component={Print}/>
        <DefaultLayout path="/share" component={Share}/>
      </Switch>
    </HashRouter>
);

// export
export { router };
