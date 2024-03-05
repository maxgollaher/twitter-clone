import "./AppNavbar.css";
import useUserInfo from "../userInfo/UserInfoHook";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import Image from "react-bootstrap/Image";
import useToastListener from "../toaster/ToastListenerHook";
import { useState } from "react";
import { AppNavbarPresenter, AppNavbarView } from "../../presenter/AppNavbarPresenter";

const AppNavbar = () => {
  const location = useLocation();
  const { authToken, clearUserInfo } = useUserInfo();
  const { displayInfoMessage, displayErrorMessage, clearLastInfoMessage } =
    useToastListener();

  const listener: AppNavbarView = {
    clearLastInfoMessage: clearLastInfoMessage,
    clearUserInfo: clearUserInfo,
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    navigateToLogin: () => {
      window.location.href = "/login";
    },
  };

  const [presenter] = useState(new AppNavbarPresenter(listener));

  const logOut = async () => {
    presenter.logOut(authToken!);
  };

  return (
    <Navbar
      collapseOnSelect
      className="mb-4"
      expand="md"
      bg="primary"
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <div className="d-flex flex-row">
            <div className="p-2">
              <NavLink className="brand-link" to="/">
                <Image src={"./bird-white-32.png"} alt="" />
              </NavLink>
            </div>
            <div id="brand-title" className="p-3">
              <NavLink className="brand-link" to="/">
                <b>Tweeter</b>
              </NavLink>
            </div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <NavLink to="/feed">Feed</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/story">Story</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/following">Following</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/followers">Followers</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink id="logout" onClick={logOut} to={location.pathname}>
                Logout
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
