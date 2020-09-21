import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
// import DatePicker from "react-date-picker";
import Form from "react-bootstrap/Form";
import { Modal, Button } from "react-bootstrap";
// import TimePicker from "react-time-picker";
// import LoadingSpinner from '../shared/component/LoadingSpinner'
import ErrorModal from "../../Shared/Components/ErrorModal";
import ApiCalendar from "./ApiCalendar";
import auth from "../../Shared/Auth/auth";
// import "./AddRoutine.css";

const UpdateRoutineModal = (props) => {
  // const auth = useContext(AuthContext)
  const [show, setShow] = useState(true);
  const [routineItem, setRoutineItem] = useState(props.rowInfo.routineItem);
  const [itemName, setItemName] = useState(props.rowInfo.itemName);
  const [unit, setUnit] = useState(props.rowInfo.unit);
  const [startDate, setStartDate] = useState(props.rowInfo.startDate);
  const [endDate, setEndDate] = useState(props.rowInfo.endDate);
  const [timesPerDay, setTimesPerDay] = useState(props.rowInfo.timesPerDay);
  const [beforeAfterMeal, setBeforeAfterMeal] = useState(
    props.rowInfo.beforeAfterMeal
  );
  const [timeList, setTimeList] = useState([
    {
      time: props.rowInfo.times[0].time || "10:00",
    },
    {
      time: props.rowInfo.times[1].time || "11:00",
    },
    {
      time: props.rowInfo.times[2].time || "12:00",
    },
    {
      time: props.rowInfo.times[3].time || "13:00",
    },
    {
      time: props.rowInfo.times[4].time || "14:00",
    },
  ]);
  const [notificationState, setNotificationState] = useState(
    props.rowInfo.notificationState
  );
  // const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [message, setMessage] = useState("");
  const [guardianCheck, setGuardianCheck] = useState(
    props.rowInfo.guardianCheck
  );
  const [patientCheck, setPatientCheck] = useState(props.rowInfo.patientCheck);

  const handleClose = () => {
    setShow(false);
    props.onClear();
  };


  //to convert  the date in string
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    if (ApiCalendar.sign) {

      //Check given start date is less or same with end date  
      if (moment(startDate).isSameOrBefore(endDate)) {
        // setIsLoading(true);
        setDisable(true);
        let times = timeList.slice(0, timesPerDay);
        let startingDate;
        let endingDate;
        if (startDate === props.rowInfo.startDate) {
          startingDate = moment(props.rowInfo.startDate).format("YYYY/MM/DD");
        } else {
          startingDate = moment(startDate).format("YYYY/MM/DD");
        }
        if (endDate === props.rowInfo.endDate) {
          endingDate = moment(props.rowInfo.endDate).format("YYYY/MM/DD");
        } else {
          endingDate = moment(endDate).format("YYYY/MM/DD");
        }
        try {

          //get user routine info with rowInfo id

          const response = await axios.get(
            process.env.REACT_APP_BACKEND_URL + "routine/" + props.rowInfo.id
          );
          let notificationTime = notificationState.split(" ");
          if (response.data.timesPerDay === timesPerDay) {
            let i;
            let eventMinTime = [];
            let eventMaxTime = [];
            let eventMinTimeUTC = [];
            let eventMaxTimeUTC = [];
            let events = [];
            for (i = 0; i < response.data.timesPerDay; i++) {
              eventMinTime[i] = new Date(response.data.startDate);
              let input = response.data.times[i].time;
              var fields = input.split(":");
              var hour = fields[0];
              var minute = fields[1];
              eventMinTime[i].setHours(hour);
              eventMinTime[i].setMinutes(minute);
              eventMinTimeUTC[i] = moment(eventMinTime[i]).format();
              eventMaxTime[i] = new Date(response.data.endDate);
              eventMaxTime[i].setHours(hour);
              eventMaxTime[i].setMinutes(minute);
              eventMaxTimeUTC[i] = moment(eventMaxTime[i]).format();
            }
            if (response.data.timesPerDay > 1) {
              if (
                !moment(response.data.startDate).isSame(response.data.endDate)
              ) {
                await ApiCalendar.listUpcomingEvents(
                  10,
                  eventMinTimeUTC[0],
                  eventMaxTimeUTC[response.data.timesPerDay - 1]
                ).then(({ result }) => {
                  events = result.items;
                });
              } else {
                await ApiCalendar.listTodayEvents(10, eventMinTimeUTC[0]).then(
                  ({ result }) => {
                    events = result.items;
                  }
                );
              }
            } else {
              await ApiCalendar.listTodayEvents(10, eventMinTimeUTC[0]).then(
                ({ result }) => {
                  events = result.items;
                }
              );
            }
            let updateId = [];
            for (i = 0; i < events.length; i++) {
              if (
                //////////
                eventMinTimeUTC.indexOf(events[i].start.dateTime) > -1 &&
                eventMaxTimeUTC.indexOf(events[i].end.dateTime) > -1
              ) {
                updateId.push(events[i].id);
              }
            }
            for (i = 0; i < timesPerDay; i++) {
              const eventStartTime = new Date(startingDate);
              let input = times[i].time;
              fields = input.split(":");
              hour = fields[0];
              minute = fields[1];
              eventStartTime.setHours(hour);
              eventStartTime.setMinutes(minute);
              eventStartTime.setSeconds(0);
              const eventEndTime = new Date(endingDate);
              eventEndTime.setHours(hour);
              eventEndTime.setMinutes(minute);
              eventEndTime.setSeconds(0);
              const event = {
                summary: `${itemName}`,
                description: `Routine Item: ${routineItem}\nItem Name: ${itemName}\nTimes Per Day: ${timesPerDay}\n${beforeAfterMeal}\nNotification For: ${
                  guardianCheck && patientCheck ? "Guradian&Patient" : "Patient"
                }
                                `,
                start: {
                  dateTime: eventStartTime,
                  timeZone: "Asia/Dhaka",
                },
                end: {
                  dateTime: eventEndTime,
                  timeZone: "Asia/Dhaka",
                },
                reminders: {
                  useDefault: false,
                  overrides: [
                    {
                      method: "popup",
                      minutes: notificationTime[1],
                    },
                  ],
                },
                colorId: 9,
              };
              await ApiCalendar.updateEvent(event, updateId[i])
                .then((result) => {
                  setMessage("Your Event is updated successfully.");
                })
                .catch((error) => {
                  setMessage("Your Event is not updated successfully.");
                });
            }
            const updateResponse = await axios.patch(

              //to get the individual routine info with row id
              process.env.REACT_APP_BACKEND_URL + "routine/" + props.rowInfo.id,
              {
                routineItem,
                itemName,
                unit: routineItem === "Activity" ? null : unit,
                startDate: startingDate,
                endDate: endingDate,
                timesPerDay: timesPerDay,
                beforeAfterMeal,
                times,
                notification: notificationState,
                notificationFor:
                  guardianCheck && patientCheck
                    ? "Guradian&Patient"
                    : "Patient",
              }
            );
            setMessage(updateResponse.data.message);
          } else {
            let i;
            let eventMinTime = [];
            let eventMaxTime = [];
            let eventMinTimeUTC = [];
            let eventMaxTimeUTC = [];
            let events = [];
            for (i = 0; i < response.data.timesPerDay; i++) {
              eventMinTime[i] = new Date(response.data.startDate);
              let input = response.data.times[i].time;
              fields = input.split(":");
              hour = fields[0];
              minute = fields[1];
              eventMinTime[i].setHours(hour);
              eventMinTime[i].setMinutes(minute);
              eventMinTimeUTC[i] = moment(eventMinTime[i]).format();
              eventMaxTime[i] = new Date(response.data.endDate);
              eventMaxTime[i].setHours(hour);
              eventMaxTime[i].setMinutes(minute);
              eventMaxTimeUTC[i] = moment(eventMaxTime[i]).format();
            }
            if (response.data.timesPerDay > 1) {
              if (
                !moment(response.data.startDate).isSame(response.data.endDate)
              ) {
                await ApiCalendar.listUpcomingEvents(
                  10,
                  eventMinTimeUTC[0],
                  eventMaxTimeUTC[response.data.timesPerDay - 1]
                ).then(({ result }) => {
                  events = result.items;
                });
              } else {
                await ApiCalendar.listTodayEvents(10, eventMinTimeUTC[0]).then(
                  ({ result }) => {
                    events = result.items;
                  }
                );
              }
            } else {
              await ApiCalendar.listTodayEvents(10, eventMinTimeUTC[0]).then(
                ({ result }) => {
                  events = result.items;
                }
              );
            }
            let deleteId = [];
            for (i = 0; i < events.length; i++) {
              if (
                eventMinTimeUTC.indexOf(events[i].start.dateTime) > -1 &&
                eventMaxTimeUTC.indexOf(events[i].end.dateTime) > -1
              ) {
                deleteId.push(events[i].id);
              }
            }
            for (i = 0; i < deleteId.length; i++) {
              ApiCalendar.deleteEvent(deleteId[i]).then(({ result }) => {});
            }
            for (i = 0; i < timesPerDay; i++) {
              const eventStartTime = new Date(startingDate);
              let input = times[i].time;
              fields = input.split(":");
              hour = fields[0];
              minute = fields[1];
              eventStartTime.setHours(hour);
              eventStartTime.setMinutes(minute);
              eventStartTime.setSeconds(0);
              const eventEndTime = new Date(endingDate);
              eventEndTime.setHours(hour);
              eventEndTime.setMinutes(minute);
              eventEndTime.setSeconds(0);
              const event = {
                summary: `${itemName} ${unit}`,
                description: `Routine Item: ${routineItem}\nItem Name: ${itemName}\nTimes Per Day: ${timesPerDay}\n${beforeAfterMeal}\nNotification For: ${
                  guardianCheck && patientCheck ? "Guradian&Patient" : "Patient"
                }
                                `,
                start: {
                  dateTime: eventStartTime,
                  timeZone: "Asia/Dhaka",
                },
                end: {
                  dateTime: eventEndTime,
                  timeZone: "Asia/Dhaka",
                },
                reminders: {
                  useDefault: false,
                  overrides: [
                    {
                      method: "popup",
                      minutes: notificationTime[1],
                    },
                  ],
                },
                colorId: 9,
              };
              await ApiCalendar.createEvent(event)
                .then((result) => {})
                .catch((error) => {
                  setMessage("Your Event is not updated successfully.");
                });
            }
            ////
            const updateResponse = await axios.patch(
              process.env.REACT_APP_BACKEND_URL + "routine/" + props.rowInfo.id,
              {
                routineItem,
                itemName,
                unit: routineItem === "Activity" ? null : unit,
                startDate: startingDate,
                endDate: endingDate,
                timesPerDay: timesPerDay,
                beforeAfterMeal,
                times,
                notification: notificationState,
                notificationFor:
                  guardianCheck && patientCheck
                    ? "Guradian&Patient"
                    : "Patient",
              }
            );
            setMessage(updateResponse.data.message);
          }
          // setIsLoading(false);
          setDisable(false);
        } catch (error) {
          console.log(error.response.data);
          // setIsLoading(false);
          setDisable(false);
        }
      } else {
        setMessage("Start Date should not be greater than End Date.");
      }
    } else {
      setMessage("Please sign in with your google account to update event.");
    }
  };

  const itemNamePlaceHolder = () => {
    if (routineItem === "Medicine") {
      return "Medicine Name";
    }
    if (routineItem === "Activity") {
      return "Activity Name";
    }
    if (routineItem === "Food") {
      return "Food Name";
    }
  };

  // if routine item == activity then unit field will become hidden
  const unitClassHandler = () => {
    if (routineItem === "Activity") {
      return "d-none";
    }
  };

  const messageHandler = () => {
    setMessage(null);
  };

  //to hanlde times per day array
  const handleTimeChange = (inputTime, index) => {
    let newArr = [...timeList];
    newArr[index].time = inputTime;
    setTimeList(newArr);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header style={{ backgroundColor: "#010624" }}>
        <Modal.Title style={{ color: "white" }}>Update Routine</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (
          <ErrorModal message={message} onClear={messageHandler.bind(this)} />
        )}
        <div className="container-fluid bg-white">
          {/* {isLoading && <LoadingSpinner/>} */}
          <div className="container">
            <div className="row py-5">
              <div className="col-lg-12">
                <form style={{ color: "#757575" }} onSubmit={submitHandler}>
                  <div className="form-row mb-4">
                    <div className="col-lg-3 mt-2">
                      <span className="font-weight-bold ml-2 h5">
                        Routine Item
                      </span>
                    </div>
                    <div className="col-7 col-sm-7">
                      <select
                        className="w-100 text-justify rounded-pill p-1"
                        style={{ backgroundColor: "#E6E6E6" }}
                        value={routineItem}
                        onChange={(e) => setRoutineItem(e.target.value)}
                      >
                        <option value="Medicine">Medicine</option>
                        <option value="Activity">Activity</option>
                        <option value="Food">Food</option>
                      </select>
                    </div>
                    <div className="col-lg-3"></div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-6 mb-4">
                      <div className="lg-form mr-4">
                        <label>{itemNamePlaceHolder()}</label>
                        <input
                          type="text"
                          className="form-control text-justify rounded-pill"
                          style={{ backgroundColor: "#E6E6E6" }}
                          placeholder={itemNamePlaceHolder()}
                          name="itemName"
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          required
                          disabled={disable ? "disabled" : ""}
                        />
                      </div>
                    </div>
                    <div
                      className={"col-12 col-sm-6 mb-4 " + unitClassHandler()}
                    >
                      <div className="lg-form mr-4">
                        <label>Unit</label>
                        <input
                          type="text"
                          className="form-control text-justify rounded-pill"
                          style={{ backgroundColor: "#E6E6E6" }}
                          placeholder="Unit"
                          name="unit"
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          required={
                            routineItem !== "Activity" ? "required" : ""
                          }
                          disabled={disable ? "disabled" : ""}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 mb-4">
                      <div className="lg-form mr-4">
                        <label>Start Date</label>
                        <input
                          type="date"
                          className="form-control text-justify rounded-pill"
                          style={{ backgroundColor: "#E6E6E6" }}
                          name="startDate"
                          value={convert(startDate)}
                          onChange={(e) => setStartDate(e.target.value)}
                          disabled={disable ? "disabled" : ""}
                        />
                        {/* <DatePicker
                          className="form-control text-justify rounded-pill"
                          onChange={(date) => {
                            setStartDate(date);
                          }}
                          value={startDate}
                        /> */}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 mb-4">
                      <div className="lg-form mr-4">
                        <label>End Date</label>
                        <input
                          type="date"
                          className="form-control text-justify rounded-pill"
                          style={{ backgroundColor: "#E6E6E6" }}
                          name="endDate"
                          value={convert(endDate)}
                          onChange={(e) => setEndDate(e.target.value)}
                          disabled={disable ? "disabled" : ""}
                        />
                        {/* <DatePicker
                          className="form-control text-justify rounded-pill"
                          onChange={(date) => {
                            setEndDate(date);
                          }}
                          value={endDate}
                        /> */}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 mb-4">
                      <div className="lg-form mr-4">
                        <label>Times Per Day</label>
                        <input
                          type="number"
                          className="form-control text-justify rounded-pill"
                          style={{ backgroundColor: "#E6E6E6" }}
                          value={timesPerDay}
                          placeholder="Times Per Day"
                          min="1"
                          max="5"
                          onChange={(e) => setTimesPerDay(e.target.value)}
                          required
                          disabled={disable ? "disabled" : ""}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 mb-4">
                      <div className="lg-form mr-4">
                        <label>Before/After Meal</label>
                        <select
                          className="w-100 text-secondary text-justify rounded-pill p-2"
                          style={{ backgroundColor: "#E6E6E6" }}
                          value={beforeAfterMeal}
                          onChange={(e) => setBeforeAfterMeal(e.target.value)}
                        >
                          <option value="Before Meal">Before Meal</option>
                          <option value="After Meal">After Meal</option>
                        </select>
                      </div>
                    </div>

                    
                    {/* to render dynamically timesperday array */}
                    {Array.from({ length: timesPerDay }, (v, k) => (
                      <div className="col-12 col-sm-6 mb-4" key={k}>
                        <div className="lg-form mr-4 mb-4 mb-sm-0">
                          <label>{"Time " + (k + 1)}</label>
                          <input
                            type="time"
                            className="form-control rounded-pill   form-input-background "
                            value={timeList[k].time}
                            onChange={(e) => {
                              handleTimeChange(e.target.value, k);
                            }}
                            // required
                          />
                          {/* <TimePicker
                            className="form-control text-justify rounded-pill"
                            onChange={(inputTime) =>
                              handleTimeChange(inputTime, k)
                            }
                            value={timeList[k].time}
                          /> */}
                        </div>
                      </div>
                    ))}
                    <div className="col-12 col-sm-6 mb-4">
                      <div className="lg-form mr-4">
                        <label>Notification Time</label>
                        <select
                          className="w-100 text-secondary text-justify rounded-pill p-2"
                          style={{ backgroundColor: "#E6E6E6" }}
                          value={notificationState}
                          onChange={(e) => setNotificationState(e.target.value)}
                        >
                          <option value="Before 5 mins">
                            Notify Before 5 mins
                          </option>
                          <option value="Before 15 mins">
                            Notify Before 15 mins
                          </option>
                          <option value="Before 30 mins">
                            Notify Before 30 mins
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "form-row my-4 " +
                      (auth.userRole === "Guardian/Patient" ? "d-none" : "")
                    }
                  >
                    <p
                      className="font-weight-bold h4 pl-1"
                      style={{ color: "#857072" }}
                    >
                      Notification For
                    </p>
                  </div>
                  <div
                    className={
                      "form-row my-4 " +
                      (auth.userRole === "Guardian/Patient" ? "d-none" : "")
                    }
                  >
                    <Form.Check
                      inline
                      label="Guardian"
                      type="checkbox"
                      id="guardian"
                      value="Guardian"
                      checked={guardianCheck ? "checked" : ""}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGuardianCheck(true);
                        } else {
                          setGuardianCheck(false);
                        }
                      }}
                    />
                    <Form.Check
                      inline
                      label="Patient"
                      type="checkbox"
                      id="patient"
                      value="Patient"
                      required
                      checked={patientCheck ? "checked" : ""}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPatientCheck(true);
                        } else {
                          setPatientCheck(false);
                        }
                      }}
                    />
                    {/* <input type="radio" name="userType" value='Me' checked={userType === 'Me'} onChange={(e) => setUserType('Me')} disabled = {(disable)? "disabled" : ""}/><label className="radio-inline px-2 h5 mr-2 mt-n2">Me</label>
                                    <input type="radio" name="userType" value='Guardian' checked={userType === 'Guardian'} onChange={(e) => setUserType('Guardian')} disabled = {(disable)? "disabled" : ""}/><label className="radio-inline px-2 h5 mr-2 mt-n2">Guardian</label> */}
                  </div>
                  <div className="row mt-5">
                    <div className="col-lg-4"></div>
                    <div className="col-lg-4">
                      <button
                        type="submit"
                        className="btn btn-block text-white text-center"
                        style={{
                          marginTop: "10px",
                          marginBottom: "20px",
                          marginLeft: "auto",
                          marginRight: "auto",
                          width: "150px",
                          borderRadius: "1em",
                          height: "35px",
                          backgroundColor: "#0C0C52",
                          fontSize: "14px",
                        }}
                      >
                        Update
                      </button>
                    </div>
                    <div className="col-lg-4"></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          style={{
            backgroundColor: "#0C0C52",
          }}
          onClick={handleClose}
        >
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateRoutineModal;
