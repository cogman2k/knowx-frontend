import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import DetailJob from './DetailJob/DetailJob';
import ListJobs from './ListJobs/ListJobs';

function Job(props) {
  const match = useRouteMatch();
  console.log(match);
  return (
    <Switch>
      <Route exact path={match.url} component={ListJobs} />
      <Route path={`${match.url}/detail/:id`} component={DetailJob} />
    </Switch>
  );
}
export default Job;
