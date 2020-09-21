import React from "react";
import AboutTeresaPhoto from "../../Shared/img/About Us.jpg";
import "./AboutTeresa.css";

const AboutTeresa = (props) => {
  return (
    <div
      data-aos="fade-up"
      id={props.id}
      className="container-fluid"
      style={{ backgroundColor: "#F1F5F8" }}
    >
      <div className="container">
        <img
          className="d-block about-teresa"
          src={AboutTeresaPhoto}
          alt="About Us"
        />
      </div>
    </div>
  );
};

export default AboutTeresa;
