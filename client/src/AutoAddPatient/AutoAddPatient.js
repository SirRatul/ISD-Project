import React from "react";
import NavigationBar from "../Shared/Components/NavigationBar";
import Banner from "../Shared/img/Banner.png";
import SearchPatientTable from "./Componets/SearchPatientTable";
import "./AutoAddPatient.css";
import axios from "axios";
import auth from "../Shared/Auth/auth";
import { Cookies } from "react-cookie";
import ErrorModal from "../Shared/Components/ErrorModal";

import addMeAsPatientImage from "../Shared/img/addmep.jpg";

class AutoAddPatient extends React.Component {
  cookies = new Cookies();
  constructor(props) {
    super(props);
    this.state = {
      showSpinner: false,
      removeMessage: "",

      
    };
  }

  addMeAsPatient = async (e) => {
    e.preventDefault();
    console.log("entered");

    this.setState({
      showSpinner: true,
    });
    console.log(this.state.showSpinner);
    console.log(auth.userRole);

    try {
      console.log("enter try block");
      const response = await axios.patch(
        "http://localhost:5000/addPatientMyself/" + auth.userId
      );
      console.log(response.data);

      auth.userRole = "Guardian/Patient"; //set userRole as gaurdian and patient both

      this.cookies.set("userRole", auth.userRole, {
        path: "/",
        maxAge: 31536000,
      });

      this.setState({
        removeMessage: response.data.message,
      });
    } catch (error) {
      this.setState({
        showSpinner: false,
      });
      console.log(error.response.data);
      this.setState({
        removeMessage: error.response.data.message,
      });
    }


    //manual code for errorhandling and set user Roll

    // if(auth.userRole === null){

    //     try {
    //         console.log("enter try block")
    //         const response =await axios.patch(
    //             "http://localhost:5000/addPatientMyself/"+auth.userId
    //         );
    //         console.log(response.data)

    //         auth.userRole="Guardian/Patient"; //set userRole as gaurdian and patient both

    //         this.cookies.set("userRole",auth.userRole, {path:"/",maxAge:31536000})

    //         this.setState({
    //             removeMessage:response.data.message
    //          })

    //     } catch (error) {
    //         this.setState({
    //             showSpinner:false,
    //         })
    //         console.log(error.response.data)
    //         this.setState({
    //             removeMessage:error.response.data.message
    //          })
    //     }

    // }
    // else if(auth.userRole==="Guardian"){
    //     this.setState({
    //         removeMessage:"You are already a Guardian. Remove that relationship"
    //     })

    // }
    // else if(auth.userRole==="Patient"){
    //     this.setState({
    //        removeMessage:"You are already a Patient. Remove that relationship"
    //     })

    // }
    // else if(auth.userRole==="Guardian/Patient"){
    //     this.setState({
    //         removeMessage:"You are already Your Patient"
    //     })

    // }

    this.setState({
      showSpinner: false,
    });
  };

  errorHandler = () => {
    auth.authMessage = null; //clear auth message that comes from auth function
    this.setState({
      removeMessage: "", //clear API response message after clicking okay
    });
  };

  render() {
    return (
      <div>
        {this.state.removeMessage && ( //message dialogue from auth
          <ErrorModal
            message={this.state.removeMessage}
            onClear={this.errorHandler.bind(this)}
          />
        )}

        <NavigationBar />

        <div className="container-fluid">
          <div className="row">
            <img
              className="image-fluid banner"
              src={Banner}
              height="200px"
              width="100%"
              alt="Banner"
            ></img>

            <div className="headline">
              <p className="text-center text-light ml-3 mb-4 ml-lg-0 headlineForXs display-4">
                Add Patient
              </p>
            </div>
          </div>
        </div>

        <div>
          <img
            className="mx-auto d-block ml-3"
            style={{ width: "300px" }}
            src={addMeAsPatientImage}
            alt="patient"
          />
        </div>

        <div>
          {this.state.showSpinner ? (
            <div
              class="spinner-border m-auto"
              style={{ marginTop: "50px" }}
              role="status"
            >
              <span class="sr-only">Loading...</span> {/*spinner code*/}
            </div>
          ) : (
            <div className="container-fluid">
              <div className="row">
                <button
                  type="submit"
                  onClick={this.addMeAsPatient}
                  className="btn btn-block text-white text-center"
                  style={{
                    marginTop: "10px",
                    marginBottom: "15px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "auto",
                    borderRadius: "1em",
                    height: "35px",
                    backgroundColor: "#0C0C52",
                    fontSize: "15px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                >
                  Add Me As A Patient
                </button>
              </div>
            </div>
          )}

          {/* <SearchPatientTable allUser={this.state.userlist} /> */}
          <SearchPatientTable />
        </div>
      </div>
    );
  }
}

export default AutoAddPatient;
