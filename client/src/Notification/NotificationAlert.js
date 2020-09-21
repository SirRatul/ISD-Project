import React, { useState, useEffect } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import Checkmark from "../Shared/img/checkmark.png";
import Cross from "../Shared/img/Cross.png";
import Alert from "react-bootstrap/Alert";
import ErrorModal from "../Shared/Components/ErrorModal";
import auth from "../Shared/Auth/auth";

const NotificationAlert = (props) => {
  const [routineNotificationList, setRoutineNotificationList] = useState([]); //state for storing all routine notification
  const cookies = new Cookies();
  useEffect(() => {
    const getNotificationList = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL +
            "routineNotification/" +
            auth.userId
        );

        setRoutineNotificationList(response.data.routine); //store all routine notification
      } catch (error) {
        console.log("catch");
      }
    };
    getNotificationList();
  });

  const [message, setMessage] = useState("");
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //For accepting patient request

  const acceptRequest = async (requesterId) => {
    console.log("Accept" + requesterId);
    setIsLoading(true);
    setDisable(true);

    try {
      const response = await axios.patch(
        process.env.REACT_APP_BACKEND_URL +
          "users/acceptRequest/" +
          auth.userId,
        {
          requester: requesterId,
        }
      );
      setIsLoading(false);
      setDisable(false);
      auth.userRole = "Patient";
      cookies.set("userRole", auth.userRole, { path: "/", maxAge: 31536000 });
      setMessage(response.data.message);
      console.log(response.data.message);
    } catch (error) {
      setIsLoading(false);
      setDisable(false);
      setMessage(error.response.data.message);
      console.log(error.response.data);
    }
  };

  //For cancelling User request
  const cancelRequest = async (deleteId) => {
    console.log("Cancel" + deleteId);
    setIsLoading(true);
    setDisable(true);

    //deletID is the ID of the request
    try {
      const response = await axios.delete(
        process.env.REACT_APP_BACKEND_URL + "requestDelete/" + deleteId
      );
      setIsLoading(false);
      setDisable(false);
      setMessage(response.data.message);
      console.log(response.data);
    } catch (error) {
      setIsLoading(false);
      setDisable(false);
      setMessage(error.response.data.message);
      console.log(error.response.data);
    }
  };

  //For mark the routine as done

  const acceptRoutine = async (id, time) => {
    console.log("Accept Routine" + id);
    console.log("Accept Routine" + time);
    setIsLoading(true);
    setDisable(true);
    try {
      const response = await axios.patch(
        process.env.REACT_APP_BACKEND_URL + "acceptRoutine",
        {
          id,
          time,
        }
      );
      setIsLoading(false);
      setDisable(false);
      setMessage(response.data.message);
      console.log(response.data);
    } catch (error) {
      setIsLoading(false);
      setDisable(false);
      setMessage(error.response.data.message);
      console.log(error.response.data);
    }
  };

  //For mark the routine as not done

  const cancelRoutine = async (id, time) => {
    console.log("Cancel Routine" + id);
    console.log("Cancel Routine" + time);
    setIsLoading(true);
    setDisable(true);
    try {
      const response = await axios.patch(
        process.env.REACT_APP_BACKEND_URL + "cancelRoutine",
        {
          id,
          time,
        }
      );
      setIsLoading(false);
      setDisable(false);
      setMessage(response.data.message);
      console.log(response.data);
    } catch (error) {
      setIsLoading(false);
      setDisable(false);
      setMessage(error.response.data.message);
      console.log(error.response.data);
    }
  };

  //handle the errormodal message

  const messageHandler = () => {
    setMessage(null);
  };

  //convert the 24 hours time format to 12 hours time format

  const timeFormat = (timeString) => {
    var time = timeString.split(":");
    var hour = time[0] % 12 || 12;
    var minute = time[1];
    var ampm = time[0] < 12 || time[0] === 24 ? "AM" : "PM";
    return hour + ":" + minute + ampm;
  };

  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="container">
          {message && (
            <ErrorModal message={message} onClear={messageHandler.bind(this)} />
          )}
          {isLoading && (
            <div class="spinner-border m-auto" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          )}
          <p className="h5 mb-4">Patient Request</p>

          {/* If there exist any patinet request */}

          {props.notificationList ? (
            <ul className="p-0">
              {props.notificationList.map((item, i) => {
                return (
                  <Alert
                    style={{
                      backgroundColor: "#EBEBEB",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                    key={i}
                  >
                    <i
                      className="fas fa-circle"
                      style={{ backgroundColor: "#EBEBEB", padding: "10px" }}
                    ></i>
                    {item.requesterName} wants to become your guardian
                    <div
                      className="btn-group float-md-right"
                      role="group"
                      aria-label="Basic example"
                    >
                      <div className="row ml-2 ml-sm-0">
                        <button
                          className="btn btn-block text-white text-center"
                          onClick={function () {
                            acceptRequest(item.requester);
                          }}
                          style={{
                            marginTop: "auto",
                            marginBottom: "auto",
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "100px",
                            borderRadius: "1em",
                            height: "35px",
                            backgroundColor: "#0C0C52",
                            fontSize: "14px",
                          }}
                        >
                          Confrim
                        </button>
                      </div>
                      <div className="row ml-4 ml-sm-4 mr-sm-1 ml-md-4 mr-md-1">
                        <button
                          className="btn btn-block text-white text-center bg-danger"
                          onClick={function () {
                            cancelRequest(item._id);
                          }}
                          style={{
                            marginTop: "auto",
                            marginBottom: "auto",
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "100px",
                            borderRadius: "1em",
                            height: "35px",

                            fontSize: "14px",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Alert>
                );
              })}
            </ul>
          ) : (
            <Alert style={{ backgroundColor: "#EBEBEB", marginTop: "10px" }}>
              <i
                className="fas fa-circle"
                style={{ backgroundColor: "#EBEBEB", padding: "10px" }}
              ></i>
              You have no Notification.
            </Alert>
          )}

          <p className="h5 mt-4 mb-4">Daily Routine</p>

          {routineNotificationList ? (
            <ul className="p-0">
              {routineNotificationList.map((item, i) => {
                return (
                  <Alert
                    style={{ backgroundColor: "#EBEBEB", marginTop: "10px" }}
                    key={i}
                  >
                    <div class="container">
                      <div class="row">
                        {item.notificationArray.routineItem === "Activity" ? (
                          <div class="col-9">
                            <i
                              className="fas fa-circle"
                              style={{
                                backgroundColor: "#EBEBEB",
                                padding: "10px",
                              }}
                            ></i>
                            You have to {item.notificationArray.itemName} at{" "}
                            {timeFormat(item.notificationTime.time)}.
                          </div>
                        ) : null}

                        {item.notificationArray.routineItem === "Food" ? (
                          <div class="col-9">
                            <i
                              className="fas fa-circle"
                              style={{
                                backgroundColor: "#EBEBEB",
                                padding: "10px",
                              }}
                            ></i>
                            You have to eat {item.notificationArray.unit} unit{" "}
                            {item.notificationArray.itemName} at{" "}
                            {timeFormat(item.notificationTime.time)}.
                          </div>
                        ) : null}

                        {item.notificationArray.routineItem === "Medicine" ? (
                          <div class="col-9">
                            <i
                              className="fas fa-circle"
                              style={{
                                backgroundColor: "#EBEBEB",
                                padding: "10px",
                              }}
                            ></i>
                            You have to take {item.notificationArray.unit} unit{" "}
                            {item.notificationArray.itemName} at{" "}
                            {timeFormat(item.notificationTime.time)}{" "}
                            {item.notificationArray.beforeAfterMeal}.
                          </div>
                        ) : null}

                        <div class="col">
                          <div
                            className="btn-group float-right"
                            role="group"
                            aria-label="Basic example"
                          >
                            {/* Mark routine as done*/}

                            <div
                              className="mr-4"
                              onClick={function () {
                                acceptRoutine(
                                  item.notificationArray._id,
                                  item.notificationTime.time
                                );
                              }}
                              disabled={disable ? "disabled" : ""}
                            >
                              <img
                                src={Checkmark}
                                style={{ width: "22px", height: "22px" }}
                                alt="CheckMark"
                              />
                            </div>

                            {/* Mark routine as not doen */}
                            <div
                              className=""
                              onClick={function () {
                                cancelRoutine(
                                  item.notificationArray._id,
                                  item.notificationTime.time
                                );
                              }}
                              disabled={disable ? "disabled" : ""}
                            >
                              <img
                                src={Cross}
                                style={{ width: "16px", height: "16px" }}
                                alt="Cross"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Alert>
                );
              })}
            </ul>
          ) : (
            <Alert style={{ backgroundColor: "#EBEBEB", marginTop: "10px" }}>
              <i
                className="fas fa-circle"
                style={{ backgroundColor: "#EBEBEB", padding: "10px" }}
              ></i>
              You have no Notification.
            </Alert>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default NotificationAlert;
