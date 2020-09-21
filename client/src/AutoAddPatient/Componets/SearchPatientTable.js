import React from "react";
import "./SearchPatientTable.css";
import axios from "axios";
import Helmet from "react-helmet";
//import auth from "../../Shared/Auth/auth";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
//import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import auth from "../../Shared/Auth/auth";
import ErrorModal from "../../Shared/Components/ErrorModal";

class SearchPatientTable extends React.Component {
  constructor(props) {
    super(props);

    //console.log(props);
    this.state = {
      showSpinner: false, //spinner
      showSpinnerForBtn: false, //spinner for add button
      patientSearch: "",
      rowSelect: false,
      userlist: [],
      search: "",
      setFilteredUserList: [],
      removeMessage: "",
      psearch: "",
      
    };

    //this.filterFORSearch = this.filterFORSearch.bind(this);
  }

  componentDidMount = async (e) => {
    console.log("hello");

    this.setState({
      showSpinner: true,
    });

    try {

        //to fetch all the user from database and show them on the table excluding the present user

      const response = await axios.get(
        "http://localhost:5000/userListExcludingMyself/" + auth.userId
      );

      console.log(response.data);

      this.setState({
        userlist: response.data.user,

        
        showSpinner: false,
      });

      
    } catch (error) {
      console.log(error.response.data);
      this.setState({
        showSpinner: false,
      });
    }
  };

  // filterFORSearch (){
  //   this.setState({
  //     setFilteredUserList: this.state.userlist.filter((user) => {
  //       return (
  //         user.firstname
  //           .toLowerCase()
  //           .indexOf(this.state.search.toLocaleLowerCase()) !== -1 ||
  //         user.lastname
  //           .toLowerCase()
  //           .indexOf(this.state.search.toLocaleLowerCase()) !== -1 ||
  //         user.email
  //           .toLowerCase()
  //           .indexOf(this.state.search.toLocaleLowerCase()) !== -1
  //       );
  //     }) 
  //   });
  // }

  /*to set the target value to search the user from table.
 */
  updateSearch(e) {
    this.setState({ search: e.target.value.substr(0, 20) });
  }

  addPatientFromRow = async (event) => {
    event.preventDefault();

    console.log(this.state.patientSearch);

    this.setState({
      showSpinnerForBtn: true,
    });

    if (this.state.patientSearch !== null) {
      console.log("1st if");
      console.log(auth.userRole);

      try {

        // to send a request to other user to become a patient of present user  after search and select the user from table

        console.log("enter try block");
        const response = await axios.post(
          "http://localhost:5000/users/sendRequest/" + auth.userId,
          {
            recipients: [
              {
                id: this.state.patientSearch,
              },
            ],
          }
        );
        console.log(response.data);

        console.log(response.data.message);

        this.setState({
          removeMessage: response.data.message,
        });
      } catch (error) {
        this.setState({
          showSpinnerForBtn: false,
        });
        console.log(error.response.data);
        this.setState({
          removeMessage: error.response.data.message,
        });
      }
    } else {
      this.setState({
        removeMessage: "You have to select any row to add patient",
      });
      console.log(this.state.removeMessage);
    }
    this.setState({
      showSpinnerForBtn: false,
    });
  };

  errorHandler = () => {
    auth.authMessage = null; //clear auth message that comes from auth function
    this.setState({
      removeMessage: "", //clear API response message after clicking okay
    });
  };

  render() {
    const columns = [
      {
        dataField: "_id",
        text: "User Id",
        sort: true,
        hidden: true,
        headerStyle: {
          width: "0%",
        },
      },
      {
        dataField: "firstname",
        text: "First Name",
        sort: true,
        headerClasses: "w-25",
        headerStyle: {
          backgroundColor: "#020624",
          color: "white",
        },
      },
      {
        dataField: "lastname",
        text: "Last Name",
        sort: true,
        headerClasses: "w-25",
        headerStyle: {
          backgroundColor: "#020624",
          color: "white",
        },
      },
      {
        dataField: "age",
        text: "Age",
        sort: true,
        headerClasses: "w-25",
        headerStyle: {
          backgroundColor: "#020624",
          color: "white",
        },
      },
      {
        dataField: "email",
        text: "Email",
        sort: true,
        headerClasses: "w-25",
        headerStyle: {
          backgroundColor: "#020624",
          color: "white",
        },
      },
    ];

    const selectRow = {
      mode: "radio",
      clickToSelect: true,
      style: {
        backgroundColor: "#404485",
        color: "white",
      },
      onSelect: (row, isSelect, rowIndex, e) => {
        // console.log(`clicked on row with index: ${rowIndex}`);
        this.setState({
          rowSelect: true,
          patientSearch: row._id,
        });
        console.log(`clicked on row with index: ${rowIndex}`);
        //console.log(this.state.patientSearch);
      },
    };

    
    
    // this.setState({
    //   setFilteredUserList: this.state.userlist.filter((user) => {
    //     return (
    //       user.firstname
    //         .toLowerCase()
    //         .indexOf(this.state.search.toLocaleLowerCase()) !== -1 ||
    //       user.lastname
    //         .toLowerCase()
    //         .indexOf(this.state.search.toLocaleLowerCase()) !== -1 ||
    //       user.email
    //         .toLowerCase()
    //         .indexOf(this.state.search.toLocaleLowerCase()) !== -1
    //     );
    //   }) 
    // });
    
     this.state.setFilteredUserList = this.state.userlist.filter((user) => {
      return (
        user.firstname
          .toLowerCase()
          .indexOf(this.state.search.toLocaleLowerCase()) !== -1 ||
        user.lastname
          .toLowerCase()
          .indexOf(this.state.search.toLocaleLowerCase()) !== -1 ||
        user.email
          .toLowerCase()
          .indexOf(this.state.search.toLocaleLowerCase()) !== -1
      );
    });

    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Add Patient</title>
        </Helmet>

        {this.state.removeMessage && ( //message dialogue from auth
          <ErrorModal
            message={this.state.removeMessage}
            onClear={this.errorHandler.bind(this)}
          />
        )}

        <form>
          <div className="container-fluid">
            <div className="row">
              <div className="input-field forPatientSearch">
                <input
                  type="search"
                  className="form-control rounded-pill  form-input-background "
                  name="search"
                  value={this.state.search}
                  id="search"
                  onChange={this.updateSearch.bind(this)}
                  required
                />
                {this.state.search ? null : (
                  <button className="border-0 rounded-pill bg-transparent forSearchBtn">
                    <i type="button" className="fa fa-search"></i>
                  </button>
                )}

                <label
                  className="border-0 rounded-pill login-input-label"
                  htmlFor="search"
                >
                  Patient Search
                </label>
              </div>
            </div>
          </div>

          <br />
          <br />

{/*Code for table pagination */}
          <div className="container tableDesign">
            <BootstrapTable
              keyField="_id"
              columns={columns}
              data={this.state.setFilteredUserList}
              selectRow={selectRow}
              pagination={paginationFactory()}
              responsive
            />
          </div>

          {/* spinner code */}
          {this.state.showSpinner ? (
            <div class="spinner-border m-auto" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          ) : null}

          {this.state.showSpinnerForBtn ? (
            <div
              class="spinner-border m-auto"
              style={{ marginTop: "50px" }}
              role="status"
            >
              <span class="sr-only">Loading...</span> {/*spinner code*/}
            </div>
          ) : (
            <div>

{/*Code and condition for ADD btn and CREATE PATIENT MANUALLY btn. Only one btn can be seen at time . when a row is selected then only show ADD btn and when any row is Not selected then only CREATE PATIENT MANUALLY btn can be seen */}
              {this.state.search || this.state.rowSelect ? (
                <div className="container-fluid">
                  <div className="row">
                    <button
                      type="submit"
                      onClick={this.addPatientFromRow}
                      className="btn text-white text-center"
                      style={{
                        marginTop: "35px",
                        marginBottom: "20px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "auto",
                        borderRadius: "1em",
                        height: "35px",
                        backgroundColor: "#0C0C52",
                        fontSize: "14px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                    >
                      ADD
                    </button>
                  </div>
                </div>
              ) : (
                <div className="container-fluid">
                  <div className="row">
                    <a
                      type="button"
                      href="./createpatientmanually"
                      className="btn text-white text-center"
                      style={{
                        marginTop: "35px",
                        marginBottom: "20px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "auto",
                        borderRadius: "1em",
                        height: "35px",
                        backgroundColor: "#0C0C52",
                        fontSize: "14px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                    >
                      CREATE PATIENT MANUALLY
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default SearchPatientTable;
