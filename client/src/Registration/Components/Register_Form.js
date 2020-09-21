import React, { Component } from "react";
import "../Registration.css";
import "mdbreact/dist/css/mdb.css";

import ErrorModal from "../../Shared/Components/ErrorModal";

import axios from "axios";

export default class Register_Form extends Component {
  constructor() {
    super();
    this.state = {
      showSpinner: false,
      showSignUpBtn: true,
      f_name: "",
      l_name: "",
      email: "",
      gender: "",
      age: "",
      password: "",
      confirm_password: "",
      phone: "",
      height: "",
      weight: "",
      userType: "",
      responseMessage: "",
    };
  }

  errorHandler = () => {
    this.setState({
      responseMessage: "", //clear response message
    });
  };

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  sendForm = async (e) => {
    e.preventDefault();
    console.log(this.state.email);
    console.log(this.state.password);
    console.log(this.state.f_name);
    console.log(this.state.l_name);
    console.log(this.state.gender);
    console.log(this.state.age);
    console.log(this.state.confirm_password);
    console.log(this.state.phone);
    console.log(this.state.height);
    console.log(this.state.weight);
    console.log(this.state.userType);

    this.setState({
      showSignUpBtn: false,
      showSpinner: true,
    });

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "register",

        {
          firstname: this.state.f_name,
          lastname: this.state.l_name,
          gender: this.state.gender,
          age: this.state.age,
          email: this.state.email,
          password: this.state.password,
          password2: this.state.confirm_password,
          phone: this.state.phone,
          height: this.state.height,
          weight: this.state.weight,
          userType: "",
        }
      );

      this.setState({
        responseMessage: response.data.message,
        f_name: "",
        l_name: "",
        email: "",
        gender: "",
        age: "",
        password: "",
        confirm_password: "",
        phone: "",
        height: "",
        weight: "",
        userType: "",
      });

      //alert(response.data.message);
      console.log(response.data.message);
    } catch (error) {
      this.setState({
        responseMessage: error.response.data.message,
      });

      //alert(error.response.data);
      console.log(error.response.data);
    }

    this.setState({
      showSpinner: false,
      showSignUpBtn: true,
    });
  };

  render() {
    return (
      <form className="form-group-reg" onSubmit={this.sendForm}>
        {this.state.responseMessage && (
          <ErrorModal
            message={this.state.responseMessage}
            onClear={this.errorHandler.bind(this)}
          />
        )}

        <div className="form-row">
          <div className="col-10 offset-1 col-sm-6 offset-sm-0">
            <div className="input-field-reg">
              <input
                type="text"
                className="form-control rounded-pill   form-input-background "
                name="f_name"
                value={this.state.f_name}
                onInput={this.handleInput}
                id="f_name"
                onChange={(e) =>
                  this.setState({
                    f_name: e.target.value,
                  })
                }
                required
              />
              <label className="input-label" htmlFor="f_name">
                First Name
              </label>
            </div>
          </div>

          <div className="col-10 offset-1 col-sm-6 offset-sm-0">
            <div className="input-field-reg">
              <input
                type="text"
                className="form-control rounded-pill   form-input-background "
                name="l_name"
                value={this.state.l_name}
                onInput={this.handleInput}
                id="l_name"
                onChange={(e) =>
                  this.setState({
                    l_name: e.target.value,
                  })
                }
                required
              />
              <label className="input-label" htmlFor="l_name">
                Last Name
              </label>
            </div>
          </div>
        </div>
        {/* --------------------- First Input Row finish -------------------------------- */}
        <div className="form-row pt-2">
          <div className="col-10 offset-1 col-sm-6 offset-sm-0">
            <label className="Gender_Label" htmlFor="gender">
              {this.state.gender === "" ? "" : "Gender"}
            </label>
            <select
              defaultValue="Gender"
              id="gender"
              className="form-control rounded-pill   form-input-background "
              value={this.state.value}
              onChange={(e) =>
                this.setState({
                  gender: e.target.value,
                })
              }
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="col-10 offset-1 col-sm-6 offset-sm-0">
            <div className="input-field-reg">
              <input
                type="number"
                className="form-control rounded-pill   form-input-background "
                name="age"
                value={this.state.age}
                onInput={this.handleInput}
                id="age"
                onChange={(e) =>
                  this.setState({
                    age: e.target.value,
                  })
                }
                required
              />
              <label className="input-label" htmlFor="age">
                Age
              </label>
            </div>
          </div>
        </div>
        {/* --------------------- 2nd Input Row finish -------------------------------- */}
        <div className="form-row pt-2">
          <div className="col-10 offset-1 col-sm-6 offset-sm-0">
            <div className="input-field-reg">
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
              <label className="input-label" htmlFor="name">
                Email
              </label>
            </div>
          </div>

          <div className="col-10 offset-1 col-sm-6 offset-sm-0">
            <div className="input-field-reg ">
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
              <label className="input-label" htmlFor="password">
                Password
              </label>
            </div>
          </div>
        </div>
        {/* --------------------- 3rd Input Row finish -------------------------------- */}
        <div className="form-row pt-2">
          <div className="col-10 offset-1 col-sm-6 offset-sm-0">
            <div className="input-field-reg ">
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
              <label className="input-label" htmlFor="confirm_password">
                Confirm Password
              </label>
            </div>
          </div>

          <div className="col-10 offset-1 col-sm-6 offset-sm-0">
            <div className="input-field-reg">
              <input
                type="tel"
                className="form-control rounded-pill   form-input-background "
                name="phone"
                value={this.state.phone}
                onInput={this.handleInput}
                id="phone"
                onChange={(e) =>
                  this.setState({
                    phone: e.target.value,
                  })
                }
                required
              />
              <label className="input-label" htmlFor="phone">
                Phone Number
              </label>
            </div>
          </div>
        </div>
        {/* --------------------- 4th Input Row finish -------------------------------- */}
        <div className="form-row pt-2">
          <div className="col-10 offset-1 col-sm-6 offset-sm-0">
            <div className="input-field-reg">
              <input
                type="number"
                className="form-control rounded-pill   form-input-background "
                name="height"
                value={this.state.height}
                onInput={this.handleInput}
                id="height"
                onChange={(e) =>
                  this.setState({
                    height: e.target.value,
                  })
                }
                required
              />
              <label className="input-label" htmlFor="height">
                Height
              </label>
            </div>
          </div>

          <div className="col-10 offset-1 col-sm-6 offset-sm-0">
            <div className="input-field-reg">
              <input
                type="number"
                className="form-control rounded-pill   form-input-background "
                name="weight"
                value={this.state.weight}
                onInput={this.handleInput}
                id="weight"
                onChange={(e) =>
                  this.setState({
                    weight: e.target.value,
                  })
                }
                required
              />
              <label className="input-label" htmlFor="weight">
                Weight
              </label>
            </div>
          </div>
        </div>

        {/* --------------------- 5th Input Row finish -------------------------------- 
        <label className="Register-as pl-2">Register As</label>
        <div className="form-row pl-2">
          <MDBCol size="1">
            <input
              className="radio-btn"
              type="radio"
              value="Guardian"
              name="userRole"
              onChange={(e) =>
                this.setState({
                  userType: e.target.value,
                })
              }
              id="userRole"
            />
          </MDBCol>

          <MDBCol size="3" className="abc">
            <label htmlFor="userRole">Guardian</label>
          </MDBCol>

          <MDBCol size="1">
            <input
              className="radio-btn"
              type="radio"
              value="Patient"
              name="userRole"
              onChange={(e) =>
                this.setState({
                  userType: e.target.value,
                })
              }
              id="userRole2"
            />
          </MDBCol>

          <MDBCol size="3" className="abc">
            <label htmlFor="userRole2">Patient</label>
          </MDBCol>
        </div>

        */}
        {/* --------------------- 6th Input Row finish -------------------------------- */}

        <br />
        {this.state.showSpinner ? (
          <div class="spinner-border m-auto" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        ) : null}

        <br />
        {this.state.showSignUpBtn ? (
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
            SIGN UP
          </button>
        ) : null}

        <p className="h6  text-center" style={{ color: "#292A67" }}>
          Already have an account?
        </p>
        <a
          href="/login"
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
          LOG IN
        </a>
      </form>
    );
  }
}
