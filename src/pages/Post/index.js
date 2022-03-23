import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import CreatePost from "./CreatePost/CreatePost";
import Homepage from "../Homepage/Homepage";
import DetailPost from "./DetailPost/DetailPost";
import MyPosts from "./MyPosts/MyPosts";
import EditPost from "./EditPost/EditPost";
import NewestPost from "./NewestPost/NewestPost";
import MasterPost from "./MasterPost/MasterPost";

function Post(props) {
  const match = useRouteMatch();
  console.log(match);
  return (
    <Switch>
      <Route exact path={match.url} component={Homepage} />
      <Route exact path={`${match.url}/create`} component={CreatePost} />
      <Route path={`${match.url}/detail/:postId`} component={DetailPost} />
      <Route path={`${match.url}/myposts`} component={MyPosts} />
      <Route path={`${match.url}/edit/:postId`} component={EditPost} />
      <Route path={`${match.url}/newest`} component={NewestPost} />
      <Route path={`${match.url}/master`} component={MasterPost} />
    </Switch>
  );
}
export default Post;
