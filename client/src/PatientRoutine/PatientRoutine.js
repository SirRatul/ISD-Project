import React from "react";
import { Helmet } from "react-helmet";
import "react-bootstrap";
import NavigationBar from "../Shared/Components/NavigationBar";
import Footer from "../Shared/Components/Footer";
import PatinetRoutineForm from "./components/PatientRoutineForm";
import RoutineTable from "./components/RoutineTable";
import Banner from "./img/Banner.png";
import RoutineImg from "./img/Patient_Routine.jpg";
import "./PatientRoutine.css";
import { MDBCol } from "mdbreact";

class PatientRoutine extends React.Component {
  constructor() {
    super();
    this.state = {
      renderPage: false,
    };

    this.pageRender = this.pageRender.bind(this);
    this.pageNotRender = this.pageNotRender.bind(this);
  }

  // const [renderPage, setRenderPage] = useState(false)
  pageRender = () => {
    this.setState({
      renderPage: true,
    });
  };

  pageNotRender = () => {
    this.setState({
      renderPage: false,
    });
  };
  render() {
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Patient Routine</title>
        </Helmet>
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
              <p className="text-left text-light ml-3 mb-4 ml-lg-0 display-4">
                Patient Routine
              </p>
            </div>
          </div>
        </div>

        <div className="container-fluid row">
          <MDBCol sm="7">
            <div className="forPatientRoutine">
              <PatinetRoutineForm />
            </div>
          </MDBCol>

          <MDBCol sm="5">
            <div>
              <img
                className="d-none d-sm-block image-fluid routineImg m-auto pt-5"
                src={RoutineImg}
                width="70%"
                alt="RoutineTime"
              ></img>
            </div>
          </MDBCol>
        </div>

        <div className="container-fluid row justify-content-center align-self-center">
          <RoutineTable
            renderPage={this.renderPage}
            pageRender={this.pageRender}
            pageNotRender={this.pageNotRender}
          />
        </div>

        <div className="mt-5 pt-5">
          <Footer />
        </div>
      </div>
    );
  }
}

export default PatientRoutine;
