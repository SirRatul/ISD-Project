import React from "react";

import "./PatientRoutineForm.css";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import axios from "axios";

import moment from "moment";
import ErrorModal from "../../Shared/Components/ErrorModal";

import { Cookies } from "react-cookie";
import ApiCalendar from "./ApiCalendar";
import auth from "../../Shared/Auth/auth";
import apiCalendar from "./ApiCalendar";

class PatientRoutineForm extends React.Component {
  constructor() {
    super();

    this.state = {
      postArray: [],
      Body: "",
      id: "",
      routineItem: "Medicine",
      item_name: "",
      unit: "",
      s_date: "",
      e_date: "",
      continuity: "",
      meal_time: "",
      dose: [
        {
          time: "",
        },
        {
          time: "",
        },
        {
          time: "",
        },
        {
          time: "",
        },
        {
          time: "",
        },
      ],
      notification: "before 15 mins",
      dogeNumValue: "", //Times Per Day

      PatientCheck: true,
      GuardianCheck: "",
      response_message: "",
      showSpinner: false, //spinner
      showLoginBtn: true, //submit button
    };
  }

  componentDidMount = async (e) => {
    console.log("auth google sign in " + auth.googleSignedIn);
    if (auth.googleSignedIn === "false") {
      console.log("auth google sign in if " + auth.googleSignedIn);
      setTimeout(function () {
        console.log("wait 3 seconds");
        ApiCalendar.handleAuthClick();
        auth.googleSignedIn = ApiCalendar.sign;

        new Cookies().set("googleSignedIn", ApiCalendar.sign, {
          path: "/",
          maxAge: 31536000,
        });
      }, 3 * 1000);

      console.log("finish 3 seconds wait");
    }
    console.log("auth google sign in " + auth.googleSignedIn);
  };

  errorHandler = () => {
    this.setState({
      response_message: "", //clear API response message after clicking okay
    });
  };

  onSubmitForm = async (event) => {
    event.preventDefault();
    console.log(this.state.routineItem);
    console.log(this.state.item_name);
    console.log(this.state.unit);
    console.log(this.state.s_date);
    console.log(this.state.e_date);
    console.log(this.state.continuity);
    console.log(this.state.meal_time);
    console.log(this.state.dose);
    console.log(this.state.notification);
    console.log("Guardian Check " + this.state.GuardianCheck);
    console.log("Patient Check " + this.state.PatientCheck);
    console.log(this.state.dogeNumValue);

    if (apiCalendar.sign) {
      if (moment(this.state.s_date).isSameOrBefore(this.state.e_date)) {
        console.log("User Role " + auth.userRole);
        if (auth.userRole === null) {
          this.setState({
            response_message:
              "You don't have any patient and also you are not a patient to create a routine",
          });
        }

        //------------------------- For Self Patient/ Guardian User role -------------------------
        else if (auth.userRole === "Guardian/Patient") {
          this.setState({
            showLoginBtn: false, //starts laoding
            showSpinner: true,
          });

          let times = this.state.dose.slice(0, this.state.dogeNumValue);
          console.log("Time array ");
          console.log(times);

          let notificationTime = this.state.notification.split(" ");
          let i;

          try {
            const response = await axios.post(
              process.env.REACT_APP_BACKEND_URL + "routine/" + auth.userId,
              {
                routineItem: this.state.routineItem,
                itemName: this.state.item_name,
                unit: this.state.unit ? this.state.unit : undefined,
                startDate: moment(this.state.s_date).format("YYYY/MM/DD"),
                endDate: moment(this.state.e_date).format("YYYY/MM/DD"),
                timesPerDay: this.state.dogeNumValue,
                beforeAfterMeal: this.state.meal_time,
                times,
                notification: this.state.notification,
                notificationFor: "Me",
              }
            );
            console.log(response.data);
            console.log("Before For Loop");
            console.log("auth google sign in " + ApiCalendar.sign);

            // this function will set each time as event from start date to end date

            for (i = 0; i < this.state.dogeNumValue; i++) {
              const eventStartTime = new Date(this.state.s_date); //convert startDate String to date time object
              let input = times[i].time; //We have made this array at 118 line keeping all times

              console.log(this.state.s_date);
              console.log(response.data);
              console.log(input);

              //Seprate the times into hour min sec

              var fields = input.split(":");
              var hour = fields[0];
              var minute = fields[1];
              eventStartTime.setHours(hour);
              eventStartTime.setMinutes(minute);
              eventStartTime.setSeconds(0);

              console.log("eventStartTime) : " + eventStartTime);

              //We have set the end time same
              const eventEndTime = new Date(this.state.e_date);
              eventEndTime.setHours(hour);
              eventEndTime.setMinutes(minute);
              eventEndTime.setSeconds(0);

              console.log("end time: " + eventEndTime);

              //So every day from start date to end date, i time will be set as event

              const event = {
                summary: `${this.state.item_name} ${this.state.unit}`,
                description: `Routine Item: ${this.state.routineItem}\nItem Name: ${this.state.item_name}\nTimes Per Day: ${this.state.dogeNumValue}\n${this.state.notification}\nNotification For: Me
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
                .then((result) => {
                  this.setState({
                    response_message: "Your Routine is created successfully.",
                  });
                })
                .catch((error) => {
                  this.setState({
                    response_message:
                      "Your Routine is not created successfully.",
                  });
                });
            }

            this.setState({
              showLoginBtn: true, //stops laoding
              showSpinner: false,
              //response_message: response.data.message,

              //Clear the Routine form

              routineItem: "Medicine",
              item_name: "",
              unit: "",
              s_date: "",
              e_date: "",
              continuity: "",
              meal_time: "",
              dose: [
                {
                  time: "",
                },
                {
                  time: "",
                },
                {
                  time: "",
                },
                {
                  time: "",
                },
                {
                  time: "",
                },
              ],
              notification: "before 15 mins",
              dogeNumValue: "",

              PatientCheck: true,
              GuardianCheck: "",
            });
          } catch (error) {
            this.setState({
              response_message: error.response.data.message,
            });
          }
        }

        //--------------------------------------For Guardian User Role ---------------------------
        else if (auth.userRole === "Guardian") {
          //Guardian Works

          try {
            const userDetails = await axios.get(
              process.env.REACT_APP_BACKEND_URL + "getUser/" + auth.userId
            );
            // console.log(response)
            let patientEmail =
              userDetails.data.user.patientList[0].patientEmail;
            console.log("Patient Email:" + patientEmail);

            this.setState({
              showLoginBtn: false, //starts laoding
              showSpinner: true,
            });

            let times = this.state.dose.slice(0, this.state.dogeNumValue);
            console.log("Time array ");
            console.log(times);

            let notificationTime = this.state.notification.split(" ");
            let i;

            try {
              const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL + "routine/" + auth.userId,
                {
                  routineItem: this.state.routineItem,
                  itemName: this.state.item_name,
                  unit: this.state.unit ? this.state.unit : undefined,
                  startDate: moment(this.state.s_date).format("YYYY/MM/DD"),
                  endDate: moment(this.state.e_date).format("YYYY/MM/DD"),
                  timesPerDay: this.state.dogeNumValue,
                  beforeAfterMeal: this.state.meal_time,
                  times,
                  notification: this.state.notification,
                  notificationFor:
                    this.state.PatientCheck && this.state.GuardianCheck
                      ? "Guradian&Patient"
                      : "Patient",
                }
              );

              this.setState({
                response_message: response.data.message,
              });

              //calender

              // this function will set each time as event from start date to end date

              for (i = 0; i < this.state.dogeNumValue; i++) {
                const eventStartTime = new Date(this.state.s_date); //convert startDate String to date time object
                let input = times[i].time; //We have made this array at 118 line keeping all times

                console.log(this.state.s_date);
                console.log(input);

                //Seprate the times into hour min sec

                fields = input.split(":");
                hour = fields[0];
                minute = fields[1];
                eventStartTime.setHours(hour);
                eventStartTime.setMinutes(minute);
                eventStartTime.setSeconds(0);

                console.log("eventStartTime) : " + eventStartTime);

                //We have set the end time same
                const eventEndTime = new Date(this.state.e_date);
                eventEndTime.setHours(hour);
                eventEndTime.setMinutes(minute);
                eventEndTime.setSeconds(0);

                console.log("end time: " + eventEndTime);

                //So every day from start date to end date, i time will be set as event

                const event = {
                  summary: `${this.state.item_name} ${this.state.unit}`,
                  description: `Routine Item: ${
                    this.state.routineItem
                  }\nItem Name: ${this.state.item_name}\nTimes Per Day: ${
                    this.state.dogeNumValue
                  }\n${this.state.notification}\nNotification For: ${
                    this.state.GuardianCheck && this.state.PatientCheck
                      ? "Guradian&Patient"
                      : "Patient"
                  }`,
                  start: {
                    dateTime: eventStartTime,
                    timeZone: "Asia/Dhaka",
                  },
                  end: {
                    dateTime: eventEndTime,
                    timeZone: "Asia/Dhaka",
                  },

                  attendees: [{ email: patientEmail }],
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
                  .then((result) => {
                    this.setState({
                      response_message: "Your Routine is created successfully.",
                    });
                  })
                  .catch((error) => {
                    this.setState({
                      response_message:
                        "Your Routine is not created successfully.",
                    });
                  });
              }

              //ends calender

              this.setState({
                showLoginBtn: true, //stops laoding
                showSpinner: false,
                //response_message: response.data.message,

                //Clear the Routine form

                routineItem: "Medicine",
                item_name: "",
                unit: "",
                s_date: "",
                e_date: "",
                continuity: "",
                meal_time: "",
                dose: [
                  {
                    time: "",
                  },
                  {
                    time: "",
                  },
                  {
                    time: "",
                  },
                  {
                    time: "",
                  },
                  {
                    time: "",
                  },
                ],
                notification: "before 15 mins",
                dogeNumValue: "",

                PatientCheck: true,
                GuardianCheck: "",
              });
            } catch (error) {
              this.setState({
                showLoginBtn: true, //starts laoding
                showSpinner: false,
                response_message: error.response.data.message,
              });
            }
          } catch (error) {
            console.log(error.userDetails.data.message);
            // setMessage(error.response.data.message)
          }
        }

        //--------------------------------------For Patient User Role ---------------------------
        else if (auth.userRole === "Patient") {
          //Patient Works

          try {
            const userDetails = await axios.get(
              process.env.REACT_APP_BACKEND_URL + "getUser/" + auth.userId
            );
            // console.log(response)
            let guardianEmail =
              userDetails.data.user.guardianList[0].guardianEmail;
            console.log("Guardian Email:" + guardianEmail);

            this.setState({
              showLoginBtn: false, //starts laoding
              showSpinner: true,
            });

            let times = this.state.dose.slice(0, this.state.dogeNumValue);
            console.log("Time array ");
            console.log(times);

            let notificationTime = this.state.notification.split(" ");
            let i;

            try {
              const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL + "routine/" + auth.userId,
                {
                  routineItem: this.state.routineItem,
                  itemName: this.state.item_name,
                  unit: this.state.unit ? this.state.unit : undefined,
                  startDate: moment(this.state.s_date).format("YYYY/MM/DD"),
                  endDate: moment(this.state.e_date).format("YYYY/MM/DD"),
                  timesPerDay: this.state.dogeNumValue,
                  beforeAfterMeal: this.state.meal_time,
                  times,
                  notification: this.state.notification,
                  notificationFor:
                    this.state.PatientCheck && this.state.GuardianCheck
                      ? "Guradian&Patient"
                      : "Patient",
                }
              );

              this.setState({
                response_message: response.data.message,
              });

              //calender

              // this function will set each time as event from start date to end date

              for (i = 0; i < this.state.dogeNumValue; i++) {
                const eventStartTime = new Date(this.state.s_date); //convert startDate String to date time object
                let input = times[i].time; //We have made this array at 118 line keeping all times

                console.log(this.state.s_date);
                console.log(input);

                //Seprate the times into hour min sec

                fields = input.split(":");
                hour = fields[0];
                minute = fields[1];
                eventStartTime.setHours(hour);
                eventStartTime.setMinutes(minute);
                eventStartTime.setSeconds(0);

                console.log("eventStartTime) : " + eventStartTime);

                //We have set the end time same
                const eventEndTime = new Date(this.state.e_date);
                eventEndTime.setHours(hour);
                eventEndTime.setMinutes(minute);
                eventEndTime.setSeconds(0);

                console.log("end time: " + eventEndTime);

                //So every day from start date to end date, i time will be set as event

                const event = {
                  summary: `${this.state.item_name} ${this.state.unit}`,
                  description: `Routine Item: ${
                    this.state.routineItem
                  }\nItem Name: ${this.state.item_name}\nTimes Per Day: ${
                    this.state.dogeNumValue
                  }\n${this.state.notification}\nNotification For: ${
                    this.state.GuardianCheck && this.state.PatientCheck
                      ? "Guradian&Patient"
                      : "Patient"
                  }`,
                  start: {
                    dateTime: eventStartTime,
                    timeZone: "Asia/Dhaka",
                  },
                  end: {
                    dateTime: eventEndTime,
                    timeZone: "Asia/Dhaka",
                  },

                  attendees: [{ email: guardianEmail }],
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
                  .then((result) => {
                    this.setState({
                      response_message: "Your Routine is created successfully.",
                    });
                  })
                  .catch((error) => {
                    this.setState({
                      response_message:
                        "Your Routine is not created successfully.",
                    });
                  });
              }

              //ends calender

              this.setState({
                showLoginBtn: true, //stops laoding
                showSpinner: false,
                //response_message: response.data.message,

                //Clear the Routine form

                routineItem: "Medicine",
                item_name: "",
                unit: "",
                s_date: "",
                e_date: "",
                continuity: "",
                meal_time: "",
                dose: [
                  {
                    time: "",
                  },
                  {
                    time: "",
                  },
                  {
                    time: "",
                  },
                  {
                    time: "",
                  },
                  {
                    time: "",
                  },
                ],
                notification: "before 15 mins",
                dogeNumValue: "",

                PatientCheck: true,
                GuardianCheck: "",
              });
            } catch (error) {
              this.setState({
                showLoginBtn: true, //starts laoding
                showSpinner: false,
                response_message: error.response.data.message,
              });
            }
          } catch (error) {
            console.log(error.userDetails.data.message);
            // setMessage(error.response.data.message)
          }
        }
      } else {
        this.setState({
          response_message: "Start Date should not be greater than End Date.",
        });
      }
    } else {
      console.log("Else");
      this.setState({
        response_message:
          "Please sign in with your google account to create event and get notification of that routine in google calendar.",
      });
    }
  };

  handleTimeChange = (inputTime, index) => {
    let newArr = [...this.state.dose];
    newArr[index].time = inputTime;
    // this.state.dose = newArr
    this.setState({
      dose: newArr,
    });
  };

  render() {
    let conti = 0;
    return (
      <div className="container">
        {this.state.response_message && ( //error message from API
          <ErrorModal
            message={this.state.response_message}
            onClear={this.errorHandler.bind(this)}
          />
        )}

        <form onSubmit={this.onSubmitForm}>
          <div className="col-sm-6 col-12">
            <div className="input-field forNotification">
              <label className="pb-3">
                <h4>Routine Type</h4>
              </label>
              <br />

              <select
                className="form-control rounded-pill   form-input-background "
                name="mealTime"
                value={this.state.routineItem}
                id="mealTime"
                onChange={(e) => this.setState({ routineItem: e.target.value })}
                custom="ture"
              >
                <option value="Medicine" defaultValue>
                  Medicine
                </option>
                <option value="Food">Food</option>
                <option value="Excercise">Excercise</option>
              </select>
            </div>
          </div>
          <br />
          <br />

          <div className="col-sm-6 col-12">
            <div className="input-field forNotification">
              <label className="">
                <h4>Routine Details</h4>
              </label>
            </div>
          </div>

          <div className="form-row pt-2">
            <div className="col-12 col-sm-6">
              <div className="input-field">
                <input
                  type="text"
                  className="form-control rounded-pill   form-input-background "
                  name="itemName"
                  value={this.state.item_name}
                  id="itemName"
                  onChange={(e) =>
                    this.setState({
                      item_name: e.target.value,
                    })
                  }
                  //required
                />
                <label className="login-input-label" htmlFor="itemName">
                  {this.state.routineItem + " Name"}
                </label>
              </div>
            </div>

            {this.state.routineItem === "Medicine" ||
            this.state.routineItem === "Food" ? (
              <div className="col-12 col-sm-6">
                <div className="input-field forInput">
                  <input
                    type="number"
                    className="form-control rounded-pill   form-input-background "
                    name="unit"
                    value={this.state.unit}
                    id="unit"
                    onChange={(e) => this.setState({ unit: e.target.value })}
                    //required
                  />
                  <label className="login-input-label" htmlFor="unit">
                    Unit
                  </label>
                </div>
              </div>
            ) : null}

            <div className="col-12 col-sm-6">
              <div className="input-field">
                <input
                  type="date"
                  className="form-control rounded-pill   form-input-background "
                  name="startDate"
                  value={this.state.s_date}
                  id="startDate"
                  onChange={(e) => {
                    this.setState({ s_date: e.target.value });
                    if (this.state.e_date && e.target.value) {
                      let start = moment(e.target.value, "YYYY-MM-DD");
                      let end = moment(this.state.e_date, "YYYY-MM-DD");
                      console.log("Date Difference" + end.diff(start, "days"));
                      conti = end.diff(start, "days");
                      conti = conti + 1;
                      console.log("Date Difference conti " + conti);
                      this.setState({
                        continuity: conti,
                      });
                    }
                  }}
                  //required
                />
                <label className="login-input-label" htmlFor="startDate">
                  Start Date
                </label>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="input-field forInput">
                <input
                  type="date"
                  className="form-control rounded-pill form-input-background forDate"
                  name="endDate"
                  value={this.state.e_date}
                  id="endDate"
                  onChange={(e) => {
                    this.setState({ e_date: e.target.value });
                    if (this.state.s_date && e.target.value) {
                      let start = moment(this.state.s_date, "YYYY-MM-DD");
                      let end = moment(e.target.value, "YYYY-MM-DD");
                      console.log("Date Difference" + end.diff(start, "days"));
                      conti = end.diff(start, "days");
                      conti = conti + 1;
                      console.log("Date Difference conti " + conti);
                      this.setState({
                        continuity: conti,
                      });
                    }
                  }}
                  placeholder="End Date"
                  //required
                />
                <label className="login-input-label" htmlFor="endDate">
                  End Date
                </label>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="input-field">
                <input
                  type="text"
                  className="form-control rounded-pill   form-input-background "
                  name="continuity"
                  value={this.state.continuity}
                  id="continuity"
                  onChange={(e) => {
                    //this field get day difference from above startDate and endDate field
                  }}
                  readOnly
                  //required
                />
                <label className="login-input-label" htmlFor="continuity">
                  Continuity
                </label>
              </div>
            </div>

            {this.state.routineItem === "Medicine" ? (
              <div className="col-12 col-sm-6">
                <div className="input-field-two forInput">
                  <select
                    className="form-control rounded-pill   form-input-background "
                    name="mealTime"
                    value={this.state.meal_time}
                    id="mealTime"
                    onChange={(e) =>
                      this.setState({ meal_time: e.target.value })
                    }
                    custom="ture"
                  >
                    <option value="before meal" defaultValue>
                      Before meal
                    </option>
                    <option value="after meal">After meal</option>
                  </select>
                </div>
              </div>
            ) : null}

            <div className="col-12 col-sm-6">
              <div className="input-field">
                <select
                  className="form-control rounded-pill   form-input-background "
                  name="notification"
                  value={this.state.notification}
                  id="notification"
                  onChange={(e) =>
                    this.setState({ notification: e.target.value })
                  }
                  custom="trure"
                >
                  <option value="before 15 mins">Notify Before 15 mins</option>
                  <option value="before 30 mins">Notify Before 30 mins</option>
                  <option value="before 1 hour">Notify Before 1 hour</option>
                </select>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="input-field forInput">
                <input
                  type="number"
                  className="form-control rounded-pill   form-input-background "
                  name="timesPerDay"
                  min="1"
                  max="5"
                  value={this.state.dogeNumValue}
                  id="timesPerDay"
                  onChange={(e) =>
                    this.setState({ dogeNumValue: e.target.value })
                  }
                  //required
                />
                <label className="login-input-label" htmlFor="timesPerDay">
                  Times Per Day
                </label>
              </div>
            </div>

                  {/*to rendar the timesPerDay dynamically */}
            {Array.from({ length: this.state.dogeNumValue }, (v, k) => (
              <div className="col-12 col-sm-6">
                <div key={k}>
                  <div className="input-field forInput">
                    <input
                      type="time"
                      id={"doseTime" + k}
                      className="form-control rounded-pill   form-input-background "
                      value={this.state.dose[k].time}
                      onChange={(e) => {
                        // this.setState({ dose: e.target.value })
                        console.log("Dose Time:" + e.target.value);
                        this.handleTimeChange(e.target.value, k);
                      }}
                      //required
                    />
                    <label
                      className="login-input-label "
                      htmlFor={"doseTime" + k}
                    >
                      {"Dose " + (k + 1)}
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-sm-6">
            <div className="input-field forNotification">
              <label className="col-12 col-sm-6">
                <h3>Notification</h3>
              </label>
              <div className="col-sm-12 pt-5 forNotificationTo">
                <div className="row">
                  <div className="col-sm-6">
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => {
                            if (e.target.checked) {
                              this.setState({ PatientCheck: "true" });
                            } else {
                              this.setState({ PatientCheck: "false" });
                            }
                          }}
                          defaultChecked
                          required
                          name="patient Check"
                          color="primary"
                        />
                      }
                      label="Patient"
                    />
                  </div>

                  <div className="col-sm-6">
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => {
                            if (e.target.checked) {
                              this.setState({ GuardianCheck: "true" });
                            } else {
                              this.setState({ GuardianCheck: "false" });
                            }
                          }}
                          name="Guardian Check"
                          color="primary"
                        />
                      }
                      label="Guardian"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row routineBtn pt-5">
            {this.state.showSpinner ? (
              <div class="spinner-border m-auto" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            ) : null}

            {this.state.showLoginBtn ? (
              <button
                type="submit"
                className="btn btn-block text-white text-center"
                style={{
                  marginTop: "15px",
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
                ADD
              </button>
            ) : null}
          </div>
        </form>
      </div>
    );
  }
}

export default PatientRoutineForm;
