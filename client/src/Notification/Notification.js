import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "../Shared/Components/NavigationBar";
import { Helmet } from "react-helmet";
import NotificationAlert from "./NotificationAlert";
import Footer from "../Shared/Components/Footer";
import auth from "../Shared/Auth/auth";

const Notification = () => {
  const [notificationList, setNotificationList] = useState([]); //use state for storing total patient request

  useEffect(() => {
    const getNotificationList = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "users/requestList/" + auth.userId
        );
        setNotificationList(response.data.requestExist); //store patient request
      } catch (error) {
        console.log("catch");
      }
    };
    getNotificationList();
  });

  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Notification</title>
      </Helmet>
      <Menu />
      <div className="container-fluid w-100 h-100 pt-5 header-background mb-5">
        <div className="container">
          <div className="row">
            <p className="text-left text-light display-4">Notification</p>
          </div>
        </div>
      </div>

      {/* Now notification alert component with patient requests as props*/}

      {notificationList ? (
        <NotificationAlert notificationList={notificationList} />
      ) : (
        <NotificationAlert />
      )}

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <Footer />
    </React.Fragment>
  );
};

export default Notification;
