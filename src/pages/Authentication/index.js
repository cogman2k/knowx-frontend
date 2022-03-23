
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Signout from "./components/Signout";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";

function Authentication(props) {
  const match = useRouteMatch();
  console.log(match);
  return (
    <Switch>
      <Route exact path={match.url} component={Signin} />
      <Route path={`${match.url}/forgot`} component={ForgotPassword} />
      <Route path={`${match.url}/sign-up`} component={Signup} />
      <Route path={`${match.url}/changepassword`} component={ChangePassword} />
    </Switch>
  );
}
export default Authentication;
