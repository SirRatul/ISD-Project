import React, { Component } from "react";
import Logo from "../Shared/img/teresa.png";
import "./Reset_Password.css";
import Doctor from "../Shared/img/Nurse.png";
import { MDBCol } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router";
import axios from "axios";
import auth from "../Shared/Auth/auth";
import ErrorModal from "../Shared/Components/ErrorModal";

export default class Reset_Password extends Component {
  constructor() {
    super();
    this.state = {
      showSpinner: false, //spinner
      showBtn: true, //submit button
      password: "",
      confirm_password: "",
      redirect: false, //redirect to login page
    };

    console.log("Auth Message: " + auth.authMessage); //check auth message
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
    console.log(this.state.password);
    console.log(this.state.confirm_password);

    this.setState({
      showBtn: false, //starts laoding
      showSpinner: true,
    });

    console.log(auth.tempToken);

    try {
      const response = await axios.post(
        "http://localhost:5000/reset/" + auth.tempToken, //API Call
        {
          password: this.state.password,
          confirm: this.state.confirm_password,
        }
      );

      auth.authMessage = response.data.message; //send the API response message to show in Login page

      this.setState({
        redirect: true, // redirect condition gets true for login page
      });
      console.log(response.data);
    } catch (error) {
      this.setState({
        response_message: error.response.data.message, //error message store
      });
      console.log(error.response.data);
    }

    this.setState({
      showSpinner: false, //loading off
      showBtn: true,
    });
  };

  render() {
    //redirect to login page after successful password reset
    const { redirect } = this.state;
    //alert(redirect);
    if (redirect) {
      return <Redirect to="/login" />;
    }
    //default page design starts from here
    else
      return (
        <div>
          {auth.authMessage && ( //message dialogue from auth
            <ErrorModal
              message={auth.authMessage}
              onClear={this.errorHandler.bind(this)}
            />
          )}

          {this.state.response_message && ( //message dialogue from API response
            <ErrorModal
              message={this.state.response_message}
              onClear={this.errorHandler.bind(this)}
            />
          )}

          <Helmet>
            <meta charSet="utf-8" />
            <title>Reset Passowrd</title>
          </Helmet>
          <div className="container-fluid login_background">
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
                    style={{ marginTop: 20 }}
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
                    Reset Password
                  </p>
                  <div className="col-lg-8 forgot-pass-text">
                    <p className="h5  text-center" style={{ color: "#292A67" }}>
                      Enter your new password
                    </p>
                    <br />
                  </div>

                  <form className="form-group-fPass" onSubmit={this.sendForm}>
                    <div className="input-field">
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

                    <div className="input-field">
                      <input
                        type="password"
                        className="form-control rounded-pill   form-input-background "
                        name="confirm_password"
                        value={this.state.confirm_password}
                        onInput={this.handleInput}
                        id="confirm_password"
                        onChange={(e) =>
                          this.setState({
                            confirm_password: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        className="login-input-label"
                        htmlFor="confirm_password"
                      >
                        Confirm Password
                      </label>
                    </div>

                    {this.state.showSpinner ? (
                      <div class="spinner-border m-auto" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    ) : null}

                    {this.state.showBtn ? (
                      <button
                        type="submit"
                        className="btn btn-block text-white text-center"
                        style={{
                          marginTop: "15px",
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
                        SEND
                      </button>
                    ) : null}
                  </form>
                </MDBCol>
              </div>
            </div>

            <br />
            <br />
          </div>
        </div>
      );
  }
}
