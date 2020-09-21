import React from "react";
import DownloadButton from "../../Shared/img/Download.png";
import AppPhoto from "../../Shared/img/APP.png";
import "./AboutApp.css";

const AboutApp = () => {
  return (
    <div className="container-fluid" style={{ backgroundColor: "#020624" }}>
      <div data-aos="zoom-in" className="container">
        <p className="app-section-header-text text-center font-weight-bold text-white mt-5 p-3">
          Our App Is On The Way
        </p>
        <div className="row">
          <div className="col-6 mt-lg-5 app-one-column">
            <p className="heading-text text-left font-weight-bold text-white ml-auto">
              Get All Our Services in Teresa App
            </p>
            <p className="text-white ml-auto main-text-app-section">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, ised in the 1960s with the
              release of Letraset sheets containing Lorem
            </p>
            <button className="d-block mx-auto btn bg-white rounded-pill app-download-button">
              Download{" "}
              <img
                className="app-download-button-image"
                src={DownloadButton}
                alt="Download Button"
              />
            </button>
            {/* <img className="d-block mx-auto app-download-button" src={DownloadButton} alt=""/> */}
          </div>
          <div className="col-6 d-block">
            <img
              src={AppPhoto}
              alt="Phone"
              style={{
                width: "80%",
                height: "auto",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutApp;
