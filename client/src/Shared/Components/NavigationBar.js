import React, { Component } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import Logo from "../img/logo.png";
import Avatar from "../img/avatar.png";
import LoginButton from "../img/Login Button.png";
import LogoutButton from "../img/Logout Button.png";
import auth from "../Auth/auth";
import { Cookies } from "react-cookie";
import NotificationIcon from "../img/Notification Icon.png";
import axios from "axios";
import "./NavigationBar.css";
import { Redirect } from "react-router";
import apiCalendar from "../../PatientRoutine/components/ApiCalendar";
import { Link } from "react-scroll";

export default class NavigationBar extends Component {
  cookies = new Cookies();
  constructor(props) {
    super(props);

    this.state = {
      loggedin: auth.isLoggedIn,
      showSpinner: false, //loading spinner
      showBtn: true, // Button
      redirect: false, //redirect to homepage if logout
      notificationNumber: 0,
    };
    console.log("cookie1: " + auth.isLoggedIn);
  }

  logoutHandler = async (e) => {
    this.setState({
      showSpinner: true, //loading spinner
      showBtn: false, // Button
    });
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "logout",
        {
          id: auth.userId,
        }
      );

      this.setState({
        showSpinner: false, //loading spinner
        showBtn: true, // Button
      });
      console.log(response.data.message);
      auth.userId = null;
      auth.firstName = null;
      auth.token = null;
      auth.isLoggedIn = false;
      this.cookies.remove("userId", { path: "/" });
      this.cookies.remove("token", { path: "/" });
      this.cookies.remove("isLoggedIn", { path: "/" });
      this.cookies.remove("firstName", { path: "/" });
      this.cookies.remove("userRole", { path: "/" });
      if (apiCalendar.sign) {
        apiCalendar.handleSignoutClick();
        this.cookies.remove("googleSignedIn", { path: "/" });
      }
      this.cookies.remove("googleSignedIn", { path: "/" });

      this.setState({
        redirect: true,
        loggedin: false,
      });
      console.log("cookie2: " + this.state.loggedin);
      window.location.reload(false);
    } catch (error) {
      this.setState({
        showSpinner: false, //loading spinner
        showBtn: true, // Button
      });
      console.log(error);
    }
  };

  componentDidMount = async (e) => {
    var length = 0;

    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URL + "users/requestList/" + auth.userId
      );
      if (response.data.requestExist) {
        length = response.data.requestExist.length;
      } else {
      }
    } catch (error) {}

    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URL + "routineNotification/" + auth.userId
      );
      if (response.data.routine) {
        length = length + response.data.routine.length;
        // console.log('Routine Length'+response.data.routine.length)
        this.setState({
          notificationNumber: length,
        });
      } else {
        // console.log('Routine Length:'+0)
        this.setState({
          notificationNumber: length,
        });
      }
    } catch (error) {
      // console.log('catch')
    }
  };

  render() {
    //redirect to homepage after logout
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to="/" />;
    }
    return (
      <Navbar
        sticky="top"
        className="my-nav"
        collapseOnSelect
        expand="lg"
        variant="dark"
      >
        <Navbar.Brand href="/">
          <img
            src={Logo}
            width="100"
            height="70"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          className="justify-content-end"
          id="responsive-navbar-nav"
        >
          <Nav.Link className="text-light" href="/">
            Home
          </Nav.Link>

          <NavDropdown
            className="justify-content-center"
            title={
              <span
                className="dropdown-toggle text-white"
                data-toggle="dropdown"
                style={{ backgroundColor: "#020624" }}
              >
                Service
                <i className="fa fa-angle-down ml-1"></i>
              </span>
            }
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item
              className="justify-content-lg-center text-white"
              href="/addpatient"
            >
              Add Patient
            </NavDropdown.Item>
            <NavDropdown.Item
              className="justify-content-lg-center text-white"
              href="/patientroutine"
            >
              Patinent Routine
            </NavDropdown.Item>
            <NavDropdown.Item className="justify-content-lg-center text-white"></NavDropdown.Item>
          </NavDropdown>

          {window.location.pathname === "/" ? (
            <React.Fragment>
              <Nav.Item>
                <Link
                  className="nav-link text-light"
                  to="about"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  style={{ cursor: "pointer" }}
                >
                  About
                </Link>
              </Nav.Item>

              <Nav.Item>
                <Link
                  className="nav-link text-light"
                  to="process"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  style={{ cursor: "pointer" }}
                >
                  Process
                </Link>
              </Nav.Item>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Nav.Item>
                <Nav.Link className="text-light" href="/#about">
                  About
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link className="text-light" href="/#process">
                  Process
                </Nav.Link>
              </Nav.Item>
            </React.Fragment>
          )}

          {this.state.loggedin ? (
            <Nav.Link className="text-dark" href="/notification">
              <img
                className="mr-2"
                src={NotificationIcon}
                style={{ width: "35px", height: "35px" }}
                alt="Notification Icon"
              />

              {this.state.notificationNumber > 0 ? (
                <span className="badge rounded-circle bg-light text-dark position-relative ml-n4 badge-notify ">
                  {this.state.notificationNumber}
                </span>
              ) : null}
            </Nav.Link>
          ) : (
            <div></div>
          )}

          {this.state.loggedin ? (
            <Nav.Link className="text-light mt-lg-n2" href="/edit_profile">
              <img
                src={Avatar}
                className="ml-n2 ml-lg-0 profile"
                alt="avatar"
              />
            </Nav.Link>
          ) : (
            <div></div>
          )}

          {this.state.showSpinner ? ( //show loading spinner
            <div class="spinner-border  text-light" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          ) : null}

          {this.state.showBtn ? (
            this.state.loggedin ? (
              <img
                itemType="Button"
                src={LogoutButton}
                onClick={this.logoutHandler}
                className="ml-n2 ml-lg-0 login-button mt-lg-n1"
                alt="Login Button"
              />
            ) : (
              <Nav.Link className="text-light mt-lg-n2" href="/login">
                <img
                  src={LoginButton}
                  className="ml-n2 ml-lg-0 login-button"
                  alt="Login Button"
                />
              </Nav.Link>
            )
          ) : null}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
