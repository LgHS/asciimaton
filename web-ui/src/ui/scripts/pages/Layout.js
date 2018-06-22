/**
 * Using layout inheritance with react router 4
 * https://simonsmith.io/reusing-layouts-in-react-router-4/
 */
import {Route} from "react-router-dom";
import React from "react";
import Communication from "../communication/Communication";
import Settings from "../modals/Settings";
import DebugBar from "../components/DebugBar";

const DefaultLayout = ({component: Component, ...rest}) => {
  return (
      <Route {...rest} render={matchProps => (
          <main className="wrapper">
            <Communication/>
            <DebugBar />
            <div className="container">
              <Component {...matchProps} />
            </div>
            <Settings />
          </main>
      )} />
  )
};

export default DefaultLayout;
