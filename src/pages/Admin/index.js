
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AddUser from "./components/AddUser";
import Users from "./components/Users";
import Profile from "./components/Profile";
import Companies from "./components/Companies";
import AddCompanies from "./components/AddCompanies";
import DetailPost from "./components/DetailPost";
import DetailQuestion from "./components/DetailQuestion";
import Reports from "./components/Reports";

function Admin(props) {
  const match = useRouteMatch();
  // console.log(match);
  return (
    <Switch>
      <Route exact path={match.url} component={Dashboard} />
      <Route path={`${match.url}/users/new`} component={AddUser} />
      <Route path={`${match.url}/users`} component={Users} />
      <Route exact path={`${match.url}/user/:id`} component={Profile} />
      <Route exact path={`${match.url}/companies`} component={Companies} />
      <Route path={`${match.url}/companies/new`} component={AddCompanies} />
      <Route exact path={`${match.url}/post/:id`} component={DetailPost} />
      <Route exact path={`${match.url}/question/:id`} component={DetailQuestion} />
      <Route path={`${match.url}/reports`} component={Reports} />
    </Switch>
  );
}
export default Admin;
