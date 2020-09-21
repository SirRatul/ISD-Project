import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Slider1 from "../../Shared/img/front 1.jpg";
import Slider2 from "../../Shared/img/front 2.jpg";
import Slider3 from "../../Shared/img/front 3.jpg";
import "./Slider.css";
import { Link } from "react-scroll";

const Slider = () => {
  return (
    <Carousel data-aos="fade-down">
      <Carousel.Item>
        <img className="d-block sliderimage" src={Slider1} alt="First slide" />
        <Carousel.Caption>
          <Link
            className="btn bg-white float-left rounded-pill font-weight-bold marginSliderButton mb-lg-5"
            to="services"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            style={{ color: "#080808", cursor: "pointer" }}
          >
            Learn More
          </Link>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block sliderimage" src={Slider2} alt="Second slide" />

        <Carousel.Caption>
          <Link
            className="btn bg-white float-left rounded-pill font-weight-bold marginSliderButton mb-lg-5"
            to="services"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            style={{ color: "#080808", cursor: "pointer" }}
          >
            Learn More
          </Link>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block sliderimage" src={Slider3} alt="Third slide" />

        <Carousel.Caption>
          <Link
            className="btn bg-white float-left rounded-pill font-weight-bold marginSliderButton mb-lg-5"
            to="services"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            style={{ color: "#080808", cursor: "pointer" }}
          >
            Learn More
          </Link>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Slider;
