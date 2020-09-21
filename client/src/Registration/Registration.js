import React, { Component } from "react";
import { Helmet } from "react-helmet";
import "./Registration.css";
import Logo from "../Shared/img/teresa.png";
import Doctor from "../Shared/img/Dr.jpg";
import { MDBCol } from "mdbreact";
import "mdbreact/dist/css/mdb.css";

import RegisterForm from "./Components/Register_Form";

export default class Registration extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Registration</title>
        </Helmet>

        <div className="container-fluid register_background">
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

              <MDBCol lg="6" className="container-fluid Register_form">
                <div className="d-lg-none">
                  <img
                    className="mx-auto d-block teresa-logo "
                    src={Logo}
                    alt="Teresa Logo"
                  />
                  <br />
                </div>

                <p className="active text-center font-weight-bold signup-text">
                  Create Account
                </p>

                <RegisterForm />
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
