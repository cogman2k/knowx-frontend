import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import NotFound from "./components/NotFound";
import FindBuddy from "./pages/Find/FindBuddy/FindBuddy";
import MeetingOption from "./pages/Meeting/MeetingOption";
import Search from "./pages/Search/Search";

const Authentication = React.lazy(() => import("./pages/Authentication"));
const Admin = React.lazy(() => import("./pages/Admin"));
const Homepage = React.lazy(() => import("./pages/Homepage/Homepage"));
const Post = React.lazy(() => import("./pages/Post"));
const Job = React.lazy(() => import("./pages/Job"));
const Question = React.lazy(() => import("./pages/Question"));
const Profile = React.lazy(() => import("./pages/Profile/MyProfile/Profile"));
const OtherProfile = React.lazy(() =>
  import("./pages/Profile/OtherProfile/Profile")
);
const FindMentor = React.lazy(() =>
  import("./pages/Find/FindMentor/FindMentor")
);
const Reference = React.lazy(() => import("./pages/Reference/Reference"));
const Class = React.lazy(() => import("./pages/Class/Class"));

function App() {
  return (
    <div className="KnowX-Website">
      <Suspense fallback={<div>Loading ...</div>}>
        <BrowserRouter>
          <Switch>
            <Redirect exact from="/" to="/auth" />
            <Route path="/auth" component={Authentication} />
            <Route path="/admin" component={Admin} />
            <Route path="/post" component={Post} />
            <Route path="/homepage" component={Homepage} />
            <Route path="/question" component={Question} />
            <Route path="/profile" component={Profile} />
            <Route path="/otherprofile/:id" component={OtherProfile} />
            <Route path="/buddy" component={FindBuddy} />
            <Route exact path="/mentor" component={FindMentor} />
            <Route exact path="/meeting" component={MeetingOption} />
            <Route path="/jobs" component={Job} />
            <Route exact path="/search/:id" component={Search} />
            <Route exact path="/reference" component={Reference} />
            <Route exact path="/class/:id" component={Class} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
