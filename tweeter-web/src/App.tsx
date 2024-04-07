import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Status, User } from "tweeter-shared";
import "./App.css";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import ItemScroller from "./components/mainLayout/ItemScroller";
import MainLayout from "./components/mainLayout/MainLayout";
import StatusItem from "./components/statusItem/StatusItem";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import UserItem from "./components/userItem/UserItem";
import { FollowService } from "./model/service/FollowService";
import { StatusService } from "./model/service/StatusService";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { FollowersPresenter } from "./presenter/FollowersPresenter";
import { FollowingPresenter } from "./presenter/FollowingPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller<Status, StatusService>
              key={1}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
              renderItem={(status: Status) => <StatusItem item={status} />}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller<Status, StatusService>
              key={2}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
              renderItem={(status: Status) => <StatusItem item={status} />}
            />
          }
        />
        <Route
          path="following"
          element={
            <ItemScroller<User, FollowService>
              key={3}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FollowingPresenter(view)
              }
              renderItem={(item: User) => <UserItem item={item} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller<User, FollowService>
              key={4}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FollowersPresenter(view)
              }
              renderItem={(item: User) => <UserItem item={item} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register
          />
        }
      />
      <Route
        path="*"
        element={
          <Login
            originalUrl={location.pathname}
          />
        }
      />
    </Routes>
  );
};

export default App;
