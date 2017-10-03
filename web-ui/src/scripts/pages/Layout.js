/**
 * Using layout inheritance with react router 4
 * https://simonsmith.io/reusing-layouts-in-react-router-4/
 */
import {Route} from "react-router-dom";
import React from "react";
import Communication from "../communication/Communication";
import DebugBarContainer from "../containers/DebugBarContainer";

const DefaultLayout = ({component: Component, ...rest}) => {
  return (
      <Route {...rest} render={matchProps => (
          <main className="container">
            <Communication/>
            <DebugBarContainer />
            <div className="container">
              <Component {...matchProps} />
            </div>
          </main>
      )} />
  )
};

export default DefaultLayout;