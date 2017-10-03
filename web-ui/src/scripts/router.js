import React from "react";
import {Switch, HashRouter, Route } from 'react-router-dom';
import App from "./components/App";
import Home from "./pages/Home";
import Live from "./pages/Live";
import Still from "./pages/Still";
import Printing from "./pages/Printing";
import Facebook from "./pages/Facebook";
import DefaultLayout from "./pages/Layout";

// build the router
const router = (
    <HashRouter onUpdate={() => window.scrollTo(0, 0)}>
      <Switch component={App}>
        <DefaultLayout exact path="/" component={Home}/>
        <DefaultLayout path="/live" component={Live}/>
        <DefaultLayout path="/still" component={Still}/>
        <DefaultLayout path="/print" component={Printing}/>
        <DefaultLayout path="/share" component={Facebook}/>
      </Switch>
    </HashRouter>
);

// export
export { router };
