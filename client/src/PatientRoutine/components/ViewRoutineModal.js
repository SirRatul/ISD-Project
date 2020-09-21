import React, { useState} from "react";
// import DatePicker from "react-date-picker";
import { Modal, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
// import TimePicker from "react-time-picker";
import auth from "../../Shared/Auth/auth";
// import "./AddRoutine.css";

const ViewRoutineModal = (props) => {
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
  const [notificationState, setNotificationState] = useState(
    props.rowInfo.notificationState
  );
  // const [userType, setUserType] = useState(props.rowInfo.userType)
  const [guardianCheck, setGuardianCheck] = useState(
    props.rowInfo.guardianCheck
  );
  const [patientCheck, setPatientCheck] = useState(props.rowInfo.patientCheck);

  const handleClose = () => {
    setShow(false);
    props.onClear();
  };

  //To select the routineItem type(Medicine or Activity or Food).
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

  //If routine item == activity then unit field will become hidden. 
  const unitClassHandler = () => {
    if (routineItem === "Activity") {
      return "d-none";
    }
  };

  //to convert the date in string.
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header style={{ backgroundColor: "#010624" }}>
        <Modal.Title style={{ color: "white" }}>Routine Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid bg-white">
          <div className="container">
            <div className="row py-5">
              <div className="col-lg-12">
                <form style={{ color: "#757575" }}>
                  <div className="form-row mb-4">
                    <div className="col-lg-3 mt-2">
                      <span className="font-weight-bold ml-1 h5">
                        Routine Item
                      </span>
                    </div>
                    <div className="col-7 col-sm-7">
                      <select
                        className="w-100 text-justify rounded-pill p-1"
                        style={{ backgroundColor: "#E6E6E6" }}
                        value={routineItem}
                        onChange={(e) => setRoutineItem(e.target.value)}
                        disabled
                      >
                        {/*To select the routineItem type(Medicine or Activity or Food). */}
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
                          disabled
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
                          disabled
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
                          disabled
                        />
                        {/* <DatePicker
                          className="form-control text-justify rounded-pill"
                          onChange={(date) => {
                            setStartDate(date);
                          }}
                          value={startDate}
                          disabled
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
                          disabled
                        />
                        {/* <DatePicker
                          className="form-control text-justify rounded-pill"
                          onChange={(date) => {
                            setEndDate(date);
                          }}
                          value={endDate}
                          disabled
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
                          disabled
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
                          disabled
                        >
                          <option value="Before Meal">Before Meal</option>
                          <option value="After Meal">After Meal</option>
                        </select>
                      </div>
                    </div>
                    {Array.from({ length: timesPerDay }, (v, k) => (
                      <div className="col-12 col-sm-6 mb-4" key={k}>
                        <div className="lg-form mr-4 mb-4 mb-sm-0">
                          <label>{"Time " + (k + 1)}</label>
                          <input
                            type="time"
                            className="form-control rounded-pill   form-input-background "
                            value={props.rowInfo.times[k].time}
                            disabled
                          />
                          {/* <TimePicker
                            className="form-control text-justify rounded-pill"
                            value={props.rowInfo.times[k].time}
                            disabled
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
                          disabled
                        >
                          <option value="Before 15 mins">
                            Notify Before 15 mins
                          </option>
                          <option value="Before 30 mins">
                            Notify Before 30 mins
                          </option>
                          <option value="Before 30 mins">
                            Notify Before 60 mins
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
                      disabled
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
                      disabled
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPatientCheck(true);
                        } else {
                          setPatientCheck(false);
                        }
                      }}
                    />
                    {/* <input type="radio" name="userType" value='Me' checked={userType === 'Me'} onChange={(e) => setUserType('Me')} disabled/><label className="radio-inline px-2 h5 mr-2 mt-n2">Me</label>
                                    <input type="radio" name="userType" value='Guardian' checked={userType === 'Guardian'} onChange={(e) => setUserType('Guardian')} disabled/><label className="radio-inline px-2 h5 mr-2 mt-n2">Guardian</label> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewRoutineModal;
