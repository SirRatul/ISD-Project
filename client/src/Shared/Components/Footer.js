import React from "react";

import ListGroup from "react-bootstrap/ListGroup";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="page-footer" style={{ backgroundColor: "#020624" }}>
      <div className="container text-center text-sm-left">
        <div className="row">
          <div className="col-sm-4 mx-auto">
            <ListGroup>
              <ListGroup.Item className="listgroup-style">
                <a
                  className="font-weight-normal text-light"
                  href="/patientroutine"
                >
                  My Health Record
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="#!">
                  Buy Medicine
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a
                  className="font-weight-normal text-light"
                  href="/patientroutine"
                >
                  Set Reminder
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="/#process">
                  Services
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="#!">
                  Products
                </a>
              </ListGroup.Item>
            </ListGroup>
          </div>
          <hr className="bg-white w-100 d-sm-none" />
          <div className="col-sm-4 mx-auto">
            <ListGroup>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="#!">
                  Need Help
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="/#about">
                  About Us
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="#!">
                  Contact Us
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="#!">
                  Health Tips
                </a>
              </ListGroup.Item>
            </ListGroup>
          </div>
          <hr className="bg-white w-100 d-sm-none" />
          <div className="col-sm-4 mx-auto">
            <ListGroup>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="#!">
                  Privacy
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="#!">
                  Accessibility
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="#!">
                  Copyright
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="#!">
                  Disclaimer
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="#!">
                  Terms of use
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="listgroup-style">
                <a className="font-weight-normal text-light" href="#!">
                  Service Availability
                </a>
              </ListGroup.Item>
            </ListGroup>
          </div>
          <hr className="bg-white w-100 d-sm-none" />
        </div>
        <div className="row">
          <div className="col-6">
            <p className="footer-copyright-text text-light pt-2">
              Copyright &copy; All right reserved
            </p>
          </div>

          <div className="col-6">
            <div className="float-right">
              <a
                class="btn-floating btn-lg btn-fb"
                href="#!"
                type="button"
                role="button"
              >
                <i class="fab fa-facebook-f blue-text"></i>
              </a>

              <a
                class="btn-floating btn-lg btn-yt"
                href="#!"
                type="button"
                role="button"
              >
                <i class="fab fa-youtube red-text"></i>
              </a>

              <a
                class="btn-floating btn-lg btn-tw"
                href="#!"
                type="button"
                role="button"
              >
                <i class="fab fa-twitter cyan-text"></i>
              </a>

              <a
                class="btn-floating btn-lg btn-gplus"
                href="#!"
                type="button"
                role="button"
              >
                <i class="fab fa-google-plus-g red-text"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
