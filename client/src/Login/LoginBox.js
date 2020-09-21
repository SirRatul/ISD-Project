import React, { Component } from "react";
import Logo from "../Shared/img/teresa.png";
import axios from "axios";
import "./LoginBox.css";
import Doctor from "../Shared/img/Dr.jpg";
import { MDBCol } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import auth from "../Shared/Auth/auth";
import ErrorModal from "../Shared/Components/ErrorModal";
import { Redirect } from "react-router";
import { Cookies } from "react-cookie";

export default class LoginBox extends Component {
  cookies = new Cookies();
  constructor() {
    super();

    this.state = {
      showSpinner: false, //spinner
      showLoginBtn: true, //submit button
      email: "",
      password: "",
      response_message: "",
      redirect: false,
    };
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  errorHandler = () => {
    auth.authMessage = null; //clear auth message that comes from auth function
    this.setState({
      response_message: "", //clear API response message after clicking okay
    });
  };

  sendForm = async (e) => {
    e.preventDefault();
    console.log(this.state.email);
    console.log(this.state.password);

    this.setState({
      showLoginBtn: false, //starts laoding
      showSpinner: true,
    });

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "login", //API Call
        {
          email: this.state.email,
          password: this.state.password,
        }
      );

      //alert(response.data.message); //login success

      auth.isLoggedIn = true; //set login condion true
      this.setState({ redirect: true }); //redirect condion for home page
      console.log(auth.isLoggedIn);
      auth.userId = response.data.user._id; //user id store
      auth.token = response.data.Token; //token store
      auth.userRole = response.data.user.userType;
      console.log(response.data.user.userType);

      auth.firstName = response.data.user.firstname; //first name store
      this.cookies.set("userId", auth.userId, { path: "/", maxAge: 31536000 }); //set cookie for logged in user ID
      this.cookies.set("token", auth.token, { path: "/", maxAge: 31536000 }); //set cookie for logged in Token
      this.cookies.set("userRole", auth.userRole, {
        path: "/",
        maxAge: 31536000,
      });
      this.cookies.set("isLoggedIn", auth.isLoggedIn, {
        //set cookie for isloggedin
        path: "/",
        maxAge: 31536000,
      });
      this.cookies.set("firstName", auth.firstName, {
        //first name store in cookie
        path: "/",
        maxAge: 31536000,
      });

      this.cookies.set("googleSignedIn", false, {
        path: "/",
        maxAge: 31536000,
      });
    } catch (error) {
      this.setState({
        response_message: error.response.data.message, //error message store
      });

      //console.log(error.response.data.message);
      //alert(error.response.data.message);
    }

    this.setState({
      showSpinner: false, //loading off
      showLoginBtn: true,
    });
  };

  render() {
    //redirect to homepage after successful login
    const { redirect } = this.state;
    //alert(redirect);
    if (redirect) {
      return <Redirect to="/" />;
    } else
      return (
        <div className="container-fluid login_background">
          {auth.authMessage && ( //message dialogue from auth
            <ErrorModal
              message={auth.authMessage}
              onClear={this.errorHandler.bind(this)}
            />
          )}

          {this.state.response_message && ( //error message from API
            <ErrorModal
              message={this.state.response_message}
              onClear={this.errorHandler.bind(this)}
            />
          )}

          <br />
          <br />
          <div className="container shadow">
            <div className="row main_box bg-white">
              <br />
              <MDBCol sm="6" className="nurse_section  d-none d-lg-block">
                <img
                  className="mx-auto d-block teresa-logo"
                  src={Logo}
                  alt="Teresa Logo"
                />

                <img
                  className="mx-auto d-block doctor-image "
                  src={Doctor}
                  alt=""
                />
              </MDBCol>

              <MDBCol sm="6" className="login_form">
                <div className="d-lg-none">
                  <img
                    className="mx-auto d-block teresa-logo "
                    src={Logo}
                    alt="Teresa Logo"
                  />
                  <br />
                </div>

                <p className="active text-center font-weight-bold login-text">
                  Log In
                </p>

                <form className="form-group" onSubmit={this.sendForm}>
                  <div className="input-field">
                    <input
                      type="email"
                      className="form-control rounded-pill   form-input-background "
                      name="email"
                      value={this.state.email}
                      onInput={this.handleInput}
                      id="name"
                      onChange={(e) =>
                        this.setState({
                          email: e.target.value,
                        })
                      }
                      required
                    />
                    <label className="login-input-label" htmlFor="name">
                      Email
                    </label>
                  </div>

                  <div className="input-field ">
                    <input
                      type="password"
                      className="form-control rounded-pill   form-input-background "
                      name="password"
                      value={this.state.password}
                      onInput={this.handleInput}
                      id="password"
                      onChange={(e) =>
                        this.setState({
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <label className="login-input-label" htmlFor="password">
                      Password
                    </label>
                  </div>

                  <p className="Forgot_pass">
                    <a href="/forgot_password" style={{ color: "#2D2E6A" }}>
                      Forgot Password
                    </a>
                  </p>

                  {this.state.showSpinner ? (
                    <div class="spinner-border m-auto" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  ) : null}

                  {this.state.showLoginBtn ? (
                    <button
                      type="submit"
                      className="btn btn-block text-white text-center"
                      style={{
                        marginTop: "10px",
                        marginBottom: "20px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "150px",
                        borderRadius: "1em",
                        height: "35px",
                        backgroundColor: "#0C0C52",
                        fontSize: "14px",
                      }}
                    >
                      LOG IN
                    </button>
                  ) : null}

                  <p className="h6  text-center" style={{ color: "#292A67" }}>
                    Don't have an account?
                  </p>

                  <a
                    href="/register"
                    className="btn btn-block text-white text-center"
                    style={{
                      marginTop: "20px",
                      marginBottom: "10px",
                      marginLeft: "auto",
                      marginRight: "auto",
                      width: "150px",
                      borderRadius: "1em",
                      height: "35px",
                      backgroundColor: "#0C0C52",
                      fontSize: "14px",
                    }}
                  >
                    SIGN UP
                  </a>
                </form>
              </MDBCol>
            </div>
          </div>

          <br />
          <br />
        </div>
      );
  }
}
