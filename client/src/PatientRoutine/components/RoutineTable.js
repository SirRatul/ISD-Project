import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import UpdateRoutineModal from "./UpdateRoutineModal";
import ViewRoutineModal from "./ViewRoutineModal";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
// import LoadingSpinner from "../shared/component/LoadingSpinner";
import ErrorModal from "../../Shared/Components/ErrorModal";
import auth from "../../Shared/Auth/auth";
import ApiCalendar from "./ApiCalendar";
import view_icon from "../../Shared/img/view.png";
import edit_icon from "../../Shared/img/edit.png";
import delete_icon from "../../Shared/img/delete_icon.png";

import "./RoutineTable.css";

const RoutineTable = (props) => {
  // const auth = useContext(AuthContext);
  const [userRoutine, setUserRoutine] = useState([]);
  const [rowInfo, setRowInfo] = useState([]);
  const [rowSelect, setRowSelect] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [testBool, setTestBool] = useState(false);
  const [signBool, setSignBool] = useState(ApiCalendar.sign);

  //in fuctional component useEffect use to render. useEffect will be called when given parameter is changed.
  useEffect(() => {
    ApiCalendar.onLoad(() => {
      ApiCalendar.listenSign(signUpdate());
    });
    const getRoutine = async () => {
      try {

        //current user's routine list
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "routines/" + auth.userId
        );
        setUserRoutine(response.data.routine);
        console.log(response.data.routine);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    getRoutine(); // call the function 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.userId]);
  //auth.userId-----

  useEffect(() => {
    ApiCalendar.onLoad(() => {
      ApiCalendar.listenSign(signUpdate());
    });
    const getRoutine = async () => {
      try {
        //current user's routine
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "routines/" + auth.userId
        );
        setUserRoutine(response.data.routine);
      } catch (error) {
        console.log(error.response.data);
        setUserRoutine([]);
      }
    };
    getRoutine();
    setTestBool(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testBool]);
  //change testbool for new render

  useEffect(() => {
    ApiCalendar.onLoad(() => {
      ApiCalendar.listenSign(signUpdate());
    });
    const getRoutine = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "routines/" + auth.userId
        );
        setUserRoutine(response.data.routine);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    getRoutine();
    props.pageNotRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.renderPage]);
 //change props for new render

  useEffect(() => {
    console.log("Effect in sign");
    ApiCalendar.onLoad(() => {
      ApiCalendar.listenSign(signUpdate());
    });
    setSign(ApiCalendar.sign);
    setSignBool(ApiCalendar.sign);
    console.log(sign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signBool]);

  //set sign from google calendar api.
  const signUpdate = () => {
    setSign(ApiCalendar.sign);
  };

  //update the state
  const [sign, setSign] = useState(ApiCalendar.sign);

  const { SearchBar } = Search;

  //here code inside rankformatter there are 3 button of the table(view, update, delete)
  const rankFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <React.Fragment>
        <div className="btn-group" role="group" aria-label="Basic example">
          <div onClick={() => viewRow()}>
            <img
              className="mx-auto d-block view_icon"
              src={view_icon}
              alt="View"
            />
          </div>
          <div onClick={() => updateRow()}>
            <img
              className="mx-auto d-block edit_icon"
              src={edit_icon}
              alt="View"
            />
          </div>
          <div onClick={() => deleteRow(row)}>
            <img
              className="mx-auto d-block dlt_icon"
              src={delete_icon}
              alt="View"
            />
          </div>
        </div>
      </React.Fragment>
    );
  };

  //table column and attribute
  const columns = [
    {
      dataField: "_id",
      text: "Routine Id",
      sort: true,
      hidden: true,
      headerStyle: {
        width: "0%",
      },
    },
    {
      dataField: "routineItem",
      text: "Routine Item",
      sort: true,
      headerStyle: {
        width: "17%",
      },
    },
    {
      dataField: "itemName",
      text: "Name",
      sort: true,
      headerStyle: {
        width: "10%",
      },
    },
    {
      dataField: "startDate",
      text: "Start Date",
      sort: true,
      headerStyle: {
        width: "15%",
      },
    },
    {
      dataField: "endDate",
      text: "End Date",
      sort: true,
      headerStyle: {
        width: "14%",
      },
    },
    {
      dataField: "timesPerDay",
      text: "Times Per Day",
      sort: true,
      headerStyle: {
        width: "15%",
      },
    },
    {
      dataField: "beforeAfterMeal",
      text: "Meal",
      sort: true,
      headerStyle: {
        width: "13%",
      },
    },
    {
      dataField: "unit",
      text: "Unit",
      sort: true,
      headerStyle: {
        width: "9%",
      },
    },
    {
      dataField: "notification",
      text: "Notification",
      sort: true,
      headerStyle: {
        width: "20%",
      },
    },
    {
      dataField: "edit",
      text: "Actions",
      sort: false,
      formatter: rankFormatter,
      headerStyle: {
        width: "5%",
      },
    },
  ];

  const errorHandler = () => {
    setRowSelect(false);
    setViewDetails(false);
    props.pageRender();
  };

  const viewRow = () => {
    if (rowInfo) {
      setViewDetails(true);
    }
  };

  const updateRow = () => {
    if (rowInfo) {
      setRowSelect(true);
    }
  };

  const deleteRow = async (row) => {
    if (ApiCalendar.sign) {
      // setIsLoading(true);

      try {

        //to get the individual routine info with row id.

        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "routine/" + row._id
        );
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
        //??????????
        //check timesPerDay >1 or not  to ensure that how many timesPerDay will be deleted. 
        if (response.data.timesPerDay > 1) {
          if (!moment(response.data.startDate).isSame(response.data.endDate)) {
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

        //take the id to delete
        let deleteId = [];
        for (i = 0; i < events.length; i++) {
          if (
            eventMinTimeUTC.indexOf(events[i].start.dateTime) > -1 &&
            eventMaxTimeUTC.indexOf(events[i].end.dateTime) > -1
          ) {
            deleteId.push(events[i].id);
          }
        }
        
        const deleteResponse = await axios.delete(
          process.env.REACT_APP_BACKEND_URL + "routine/" + row._id
        );
        setMessage(deleteResponse.data.message);
        for (i = 0; i < deleteId.length; i++) {
          ApiCalendar.deleteEvent(deleteId[i]).then(({ result }) => {});
        }
        setRowSelect(false);
        setMessage(response.data.message);
        // setIsLoading(false);
        setTestBool(true);
      } catch (error) {
        setMessage(error.response.data.message);
        // setIsLoading(false);
        setTestBool(true);
      }
    } else {
      setMessage("Please sign in with your google account to delete event.");
    }
  };

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    style: {
      backgroundColor: "rgba(5, 6, 70, 1)",
      color: "white",
    },
    onSelect: (row, isSelect, rowIndex, e) => {
      let routineItem = row.routineItem;
      let itemName = row.itemName;
      let startDate = row.startDate;
      let endDate = row.endDate;
      let timesPerDay = row.timesPerDay;
      let beforeAfterMeal = row.beforeAfterMeal;
      let timeList = [
        {
          time: "10:00",
        },
        {
          time: "11:00",
        },
        {
          time: "12:00",
        },
        {
          time: "13:00",
        },
        {
          time: "14:00",
        },
      ];
      console.log(row.times);
      if (timesPerDay === 1) {
        timeList[0].time = row.times[0].time;
        timeList[1].time = "11:00";
        timeList[2].time = "12:00";
        timeList[3].time = "13:00";
        timeList[4].time = "14:00";
      } else if (timesPerDay === 2) {
        timeList[0].time = row.times[0].time;
        timeList[1].time = row.times[1].time;
        timeList[2].time = "12:00";
        timeList[3].time = "13:00";
        timeList[4].time = "14:00";
      } else if (timesPerDay === 3) {
        timeList[0].time = row.times[0].time;
        timeList[1].time = row.times[1].time;
        timeList[2].time = row.times[2].time;
        timeList[3].time = "13:00";
        timeList[4].time = "14:00";
      } else if (timesPerDay === 4) {
        timeList[0].time = row.times[0].time;
        timeList[1].time = row.times[1].time;
        timeList[2].time = row.times[2].time;
        timeList[3].time = row.times[3].time;
        timeList[4].time = "14:00";
      } else if (timesPerDay === 5) {
        timeList[0].time = row.times[0].time;
        timeList[1].time = row.times[1].time;
        timeList[2].time = row.times[2].time;
        timeList[3].time = row.times[3].time;
        timeList[4].time = row.times[4].time;
      }
      /* let length = row.times.length
            let i = 0
            for(i = 0; i < length; i++){
                eval('setTime'+(i+1))(row.times[i].time)
            } */
      console.log(timeList);
      let unit = row.unit;
      let notificationState = row.notification;
      let guardianCheck =
        row.notificationFor === "Guradian&Patient" ? true : false;
      let patientCheck = true;
      if (row.times[timesPerDay - 1]) {
        console.log("if");

        //take the information of the row
        const setRowInfoFunction = async () => {
          await setRowInfo({
            id: row._id,
            routineItem,
            itemName,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            timesPerDay,
            beforeAfterMeal,
            times: timeList,
            /* time1,
                        time2,
                        time3,
                        time4,
                        time5, */
            unit,
            notificationState,
            guardianCheck,
            patientCheck,
          });
        };
        setRowInfoFunction();
        console.log(rowInfo);
      }
    },
  };

  const messageHandler = () => {
    setMessage(null);
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="container">
        {message && (
          <ErrorModal message={message} onClear={messageHandler.bind(this)} />
        )}
        <p className="h2 text-center font-weight-bold mt-5">Your Routine</p>
        {rowInfo && rowSelect && (
          <UpdateRoutineModal
            rowInfo={rowInfo}  //pass the row value as props
            onClear={errorHandler.bind(this)}
          />
        )}
        {rowInfo && viewDetails && (
          <ViewRoutineModal
            rowInfo={rowInfo}  ////pass the row value as props
            onClear={errorHandler.bind(this)}
          />
        )}
        {/* {isLoading && <LoadingSpinner />} */}

      {/*default code from documentation for search*/}
        <ToolkitProvider
          keyField="_id"
          data={userRoutine}
          columns={columns}
          search
        >
          {(props) => (
            <div>
              <SearchBar {...props.searchProps} />
              <BootstrapTable
                classes="table-responsive table-striped table-hover"
                headerWrapperClasses="thead-dark"
                {...props.baseProps}
                selectRow={selectRow}
                pagination={paginationFactory()}
              />
            </div>
          )}
        </ToolkitProvider>
      </div>
    </div>
  );
};

export default RoutineTable;
