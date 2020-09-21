import React, { Component } from "react";
import ProcessPhoto from "../../Shared/img/Process.jpg";
import "./Process.css";
import AOS from "aos";
import "aos/dist/aos.css";

class Process extends Component {
  componentDidMount() {
    AOS.init({
      duration: 2000,
    });
  }
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div
      //id using for 
        id={this.props.id}
        data-aos="fade-up"
        className="container-fluid process-section"
        style={{ backgroundColor: "#FBF8F4" }}
      >
        <img className="process-image" src={ProcessPhoto} alt="process" />
      </div>
    );
  }
}

export default Process;
