import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { UserItemView } from "./presenter/UserItemPresenter";
import { FollowingPresenter } from "./presenter/FollowingPresenter";
import { FollowersPresenter } from "./presenter/FollowersPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { StatusItemView } from "./presenter/StatusItemPresenter";
import { LoginPresenter, LoginView } from "./presenter/LoginPresenter";
import { RegisterPresenter, RegisterView } from "./presenter/RegisterPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { StatusService } from "./model/service/StatusService";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { FollowService } from "./model/service/FollowService";

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
              presenterGenerator={(view: StatusItemView) =>
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
              presenterGenerator={(view: StatusItemView) =>
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
              presenterGenerator={(view: UserItemView) =>
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
              presenterGenerator={(view: UserItemView) =>
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
            presenterGenerator={(view: LoginView) => new LoginPresenter(view)}
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register
            presenterGenerator={(view: RegisterView) =>
              new RegisterPresenter(view)
            }
          />
        }
      />
      <Route
        path="*"
        element={
          <Login
            presenterGenerator={(view: LoginView) => new LoginPresenter(view)}
            originalUrl={location.pathname}
          />
        }
      />
    </Routes>
  );
};

export default App;
