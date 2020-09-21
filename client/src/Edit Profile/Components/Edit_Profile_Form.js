import React, { Component } from "react";
import "./Edit_Profile_Form.css";
import { MDBCol } from "mdbreact";
import axios from "axios";
import auth from "../../Shared/Auth/auth";
import ErrorModal from "../../Shared/Components/ErrorModal";
import { Cookies } from "react-cookie";

export default class extends Component {
  cookies = new Cookies();
  constructor() {
    super();
    this.state = {
      showSpinner: false, //loading spinner
      showBtn: true, //submit Button
      f_name: "",
      l_name: "",
      age: "",
      weight: "",
      height: "",
      phone: "",
      email: "",
      current_pass: "",
      new_pass: "",
      confirm_new_pass: "",
      response_message: "",
      childData: ["Name", "Pic", "Role", "POGname", "patientID"],
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

  componentDidMount = async (e) => {
    //this function will retrive profile info when the page loads and after any change happens
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URL + "users/" + auth.userId
      );

      this.setState({
        f_name: response.data.user.firstname,
        l_name: response.data.user.lastname,
        age: response.data.user.age,
        weight: response.data.user.weight,
        height: response.data.user.height,
        phone: response.data.user.phone,
        email: response.data.user.email,
      });

      this.state.childData[0] =
        response.data.user.firstname + " " + response.data.user.lastname;

      if (response.data.profilePicture) {
        this.state.childData[1] =
          "data:image/png;base64," + response.data.profilePicture; //clear API response message after clicking okay
        //get the value for profile picture
        this.props.parentCallback(
          this.state.childData //send the data to the parent component
        );
      }

      if (response.data.user.guardianList.length > 0) {
        this.state.childData[2] = "Patient";
        this.state.childData[3] =
          response.data.user.guardianList[0].guardianName;

        this.props.parentCallback(
          this.state.childData //send the data to the parent component
        );
      }

      if (response.data.user.patientList.length > 0) {
        this.state.childData[2] = "Guardian";
        this.state.childData[3] = response.data.user.patientList[0].patientName;
        this.state.childData[4] = response.data.user.patientList[0].patientId;

        this.props.parentCallback(
          this.state.childData //send the data to the parent component
        );
      }

      if (
        response.data.user.guardianList.length > 0 &&
        response.data.user.patientList.length > 0
      ) {
        auth.userRole = "Guardian/Patient";
        this.state.childData[2] = "Guardian/Patient";

        this.props.parentCallback(
          this.state.childData //send the data to the parent component
        );
      }

      if (
        response.data.user.guardianList.length === 0 &&
        response.data.user.patientList.length === 0
      ) {
        this.state.childData[2] = "";
        this.state.childData[3] = "";
        this.state.childData[3] = "";
        this.props.parentCallback(
          this.state.childData //send the data to the parent component
        );
      }
    } catch (error) {
      this.setState({
        response_message: error.response.data.message, //error message when page loads
      });
    }
  };

  sendForm = async (e) => {
    //update profile form action
    e.preventDefault();
    console.log(this.state.f_name);
    console.log(this.state.l_name);
    console.log(this.state.age);
    console.log(this.state.weight);
    console.log(this.state.height);
    console.log(this.state.phone);
    console.log(this.state.email);
    console.log(this.state.current_pass);
    console.log(this.state.new_pass);
    console.log(this.state.confirm_new_pass);

    this.setState({
      showBtn: false, //starts laoding
      showSpinner: true,
    });

    var crnt_pass = this.state.current_pass;

    if (crnt_pass === "") {
      console.log("current pass empty");
      //if user just change general information
      try {
        const response = await axios.patch(
          process.env.REACT_APP_BACKEND_URL + "users/me/" + auth.userId,

          {
            firstname: this.state.f_name,
            lastname: this.state.l_name,
            age: this.state.age,
            weight: this.state.weight,
            height: this.state.height,
            phone: this.state.phone,
            newPassword: this.state.new_pass,
            confirmPassword: this.state.confirm_new_pass,
            id: auth.userId,
          }
        );

        this.setState({
          showSpinner: false, //loading off
          showBtn: true,
          response_message: response.data.message,
        });

        auth.firstName = this.state.firstName;

        this.cookies.set("firstName", auth.firstName, {
          path: "/",
          maxAge: 31536000,
        });
      } catch (error) {
        this.setState({
          showSpinner: false, //loading off
          showBtn: true,
          response_message: error.response.data.message,
        });
      }
    } else {
      console.log("current pass is not empty");
      //if user changes password as well as general info

      try {
        const response = await axios.patch(
          process.env.REACT_APP_BACKEND_URL + "users/me/" + auth.userId,

          {
            firstname: this.state.f_name,
            lastname: this.state.l_name,
            age: this.state.age,
            weight: this.state.weight,
            height: this.state.height,
            phone: this.state.phone,
            password: this.state.current_pass,
            newPassword: this.state.new_pass,
            confirmPassword: this.state.confirm_new_pass,
            id: auth.userId,
          }
        );

        this.setState({
          showSpinner: false, //loading off
          showBtn: true,
          response_message: response.data.message,
          current_pass: "",
          new_pass: "",
          confirm_new_pass: "",
        });
      } catch (error) {
        this.setState({
          showSpinner: false, //loading off
          showBtn: true,
          response_message: error.response.data.message,
        });
      }
    }

    this.props.parentCallback(
      this.state.childData //send the data to the parent component
    );
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

        <form className="form-group-fPass" onSubmit={this.sendForm}>
          <p className="h4 pl-3 pb-3" style={{ color: "#000000" }}>
            General Information:
          </p>
          <div className="form-row">
            <MDBCol sm="5">
              <MDBCol sm="11">
                <div className="input-field-editProfile">
                  <input
                    type="name"
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
                  />
                  <label className="editProfile-input-label" htmlFor="f_name">
                    First Name
                  </label>
                </div>
              </MDBCol>
            </MDBCol>

            <MDBCol sm="5">
              <MDBCol sm="11">
                <div className="input-field-editProfile">
                  <input
                    type="name"
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
                  />
                  <label className="editProfile-input-label" htmlFor="l_name">
                    Last Name
                  </label>
                </div>
              </MDBCol>
            </MDBCol>
          </div>

          {/* --------------------- First Input Row finish -------------------------------- */}

          <div className="form-row">
            <MDBCol sm="5">
              <MDBCol sm="11">
                <div className="input-field-editProfile">
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
                  />
                  <label className="editProfile-input-label" htmlFor="age">
                    Age
                  </label>
                </div>
              </MDBCol>
            </MDBCol>

            <MDBCol sm="5">
              <MDBCol sm="11">
                <div className="input-field-editProfile">
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
                  />
                  <label className="editProfile-input-label" htmlFor="weight">
                    Weight
                  </label>
                </div>
              </MDBCol>
            </MDBCol>
          </div>

          {/* --------------------- Second Input Row finish -------------------------------- */}

          <div className="form-row">
            <MDBCol sm="5">
              <MDBCol sm="11">
                <div className="input-field-editProfile">
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
                  />
                  <label className="editProfile-input-label" htmlFor="height">
                    Height
                  </label>
                </div>
              </MDBCol>
            </MDBCol>

            <MDBCol sm="5">
              <MDBCol sm="11">
                <div className="input-field-editProfile">
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
                  />
                  <label className="editProfile-input-label" htmlFor="phone">
                    Phone Number
                  </label>
                </div>
              </MDBCol>
            </MDBCol>
          </div>

          {/* --------------------- Second Input Row finish -------------------------------- */}

          <br />
          <p className="h4 pl-3 pb-3 pt-5" style={{ color: "#000000" }}>
            Account Information:
          </p>

          <div className="form-row">
            <MDBCol sm="5">
              <MDBCol sm="11">
                <label className="label" style={{ marginLeft: "10px" }}>
                  Email
                </label>

                <label className="form-control rounded-pill   form-input-background ">
                  {this.state.email}
                </label>
              </MDBCol>
            </MDBCol>
          </div>

          {/* --------------------- Email Input Row finish -------------------------------- */}

          <br />
          <p className="h4 pl-3 pb-3 pt-5" style={{ color: "#000000" }}>
            Change Password:
          </p>

          <div className="form-row">
            <MDBCol sm="4">
              <MDBCol sm="12">
                <div className="input-field-editProfile">
                  <input
                    type="password"
                    className="form-control rounded-pill   form-input-background "
                    name="current_pass"
                    value={this.state.current_pass}
                    onInput={this.handleInput}
                    id="current_pass"
                    onChange={(e) =>
                      this.setState({
                        current_pass: e.target.value,
                      })
                    }
                  />
                  <label
                    className="editProfile-input-label"
                    htmlFor="current_pass"
                  >
                    Current Password
                  </label>
                </div>
              </MDBCol>
            </MDBCol>

            <MDBCol sm="4">
              <MDBCol sm="12">
                <div className="input-field-editProfile">
                  <input
                    type="password"
                    className="form-control rounded-pill   form-input-background "
                    name="new_pass"
                    value={this.state.new_pass}
                    onInput={this.handleInput}
                    id="new_pass"
                    onChange={(e) =>
                      this.setState({
                        new_pass: e.target.value,
                      })
                    }
                  />
                  <label className="editProfile-input-label" htmlFor="new_pass">
                    New Password
                  </label>
                </div>
              </MDBCol>
            </MDBCol>

            <MDBCol sm="4">
              <MDBCol sm="12">
                <div className="input-field-editProfile">
                  <input
                    type="password"
                    className="form-control rounded-pill   form-input-background "
                    name="confirm_new_pass"
                    value={this.state.confirm_new_pass}
                    onInput={this.handleInput}
                    id="confirm_new_pass"
                    onChange={(e) =>
                      this.setState({
                        confirm_new_pass: e.target.value,
                      })
                    }
                  />
                  <label
                    className="editProfile-input-label"
                    htmlFor="confirm_new_pass"
                  >
                    Confirm New Password
                  </label>
                </div>
              </MDBCol>
            </MDBCol>
          </div>

          {/* --------------------- Password Input Row finish -------------------------------- */}

          <br />

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
              SAVE CHANGES
            </button>
          ) : null}

          <br />
          <br />
        </form>
      </div>
    );
  }
}
