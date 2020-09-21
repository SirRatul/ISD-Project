import React, { Component } from "react";
import Logo from "../Shared/img/teresa.png";
import "./Forgot_Passwprd.css";
import Doctor from "../Shared/img/Nurse.png";
import { MDBCol } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { Helmet } from "react-helmet";
import axios from "axios";
import ErrorModal from "../Shared/Components/ErrorModal";

export default class Forgot_Password extends Component {
  constructor() {
    super();
    this.state = {
      showSpinner: false, //loading spinner
      showBtn: true, //submit Button
      email: "",
      response_message: "", //response message from API
    };
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  errorHandler = () => {
    this.setState({
      response_message: "", //clear API response message after clicking okay
    });
  };

  sendForm = async (e) => {
    e.preventDefault();
    console.log(this.state.email);

    this.setState({
      showBtn: false, //starts laoding
      showSpinner: true,
    });

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "forgot",
        //API Call
        {
          email: this.state.email,
        }
      );

      this.setState({
        response_message: response.data.message, //API response message store
      });
    } catch (error) {
      this.setState({
        response_message: error.response.data.message, //API error message store
      });
    }

    this.setState({
      showSpinner: false, //loading off
      showBtn: true,
    });
  };

  render() {
    return (
      <div>
        {this.state.response_message && ( //API message
          <ErrorModal
            message={this.state.response_message}
            onClear={this.errorHandler.bind(this)}
          />
        )}
        <Helmet>
          <meta charSet="utf-8" />
          <title>Forgot Passowrd</title>
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
                  Forgot Password
                </p>
                <div className="col-lg-8 forgot-pass-text">
                  <p className="h5  text-center" style={{ color: "#292A67" }}>
                    Enter the email address associated with your account
                  </p>
                  <br />

                  <p className="h6  text-center" style={{ color: "#292A67" }}>
                    We will email you a link to reset your password
                  </p>
                </div>
                <br />

                <form className="form-group-fPass" onSubmit={this.sendForm}>
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
