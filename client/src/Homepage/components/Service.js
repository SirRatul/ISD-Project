import React, { Component } from "react";
import { Card } from "react-bootstrap";
import AddPatientIcon from "../../Shared/img/Add-Patient.jpg";
import PatientRoutineIcon from "../../Shared/img/Patient-Routine.jpg";
import NotificationIcon from "../../Shared/img/Real-Time-Notification.jpg";

import AOS from "aos";
import "aos/dist/aos.css";

import "./Service.css";

class Service extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  //AOS for scrolling animation design.
  componentDidMount() {
    AOS.init({
      duration: 2000,
    });
  }

  render() {
    return (
      <div
        id={this.props.id}
        data-aos="fade-up"
        className="container mb-5 mt-2 pt-5"
      >
        <p
          className="h1 text-center font-weight-bold mb-5"
          style={{ color: "#19184E" }}
        >
          Our Services
        </p>

        <div className="row">
          <div className="col-xs-6 col-md-6 col-lg-4 d-flex px-5 px-sm-4 align-items-stretch">
            <Card className="serviceCard my-5">
              <img
                src={AddPatientIcon}
                alt="AddPatientIcon"
                class="card-image"
              />
              <div class="overlay">
                <div class="text">
                  You can search with name or email address of your patient. if
                  he/she doesn't have any account, manually add him with proper
                  information. Or you can add yourself as a patient to act as
                  your guardian.
                </div>
              </div>
            </Card>
          </div>

          <div className="col-xs-6 col-md-6 col-lg-4 d-flex px-5 px-sm-4 align-items-stretch">
            <Card className="serviceCard my-5">
              <img
                src={PatientRoutineIcon}
                alt="PatientRoutineIcon"
                class="card-image"
              />
              <div class="overlay">
                <div class="text">
                  You can add your medicine, food or other activity routines for
                  your patient. We'll keep your schedules organized so that you
                  never miss any.
                </div>
              </div>
            </Card>
          </div>

          <div className="col-xs-6 col-md-6 col-lg-4 d-flex px-5 px-sm-4 align-items-stretch">
            <Card className="serviceCard my-5">
              <img
                src={NotificationIcon}
                alt="NotificationIcon"
                class="card-image"
              />
              <div class="overlay">
                <div class="text">
                  We'll add your schedules as google calender event so that you
                  can get all your upcoming events on the homescreen. You have
                  to strictly maintain your schedules as we'll notify your
                  guardian about your status.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default Service;
