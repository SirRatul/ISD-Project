import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HomePage from "./Homepage/homepage";
import LoginPage from "./Login/Login";
import registrationPage from "./Registration/Registration";
import ForgotPassPage from "./Forgot Password/Forgot_Password";
import NotificationPage from "./Notification/Notification";

import ResetPassPage from "./Reset Password/Reset_Password";
import EditProfilePage from "./Edit Profile/Edit_Profile";

import PatientRoutine from "./PatientRoutine/PatientRoutine";
import CreateAddPatient from "./AddPatient/AddPatient";
import AddPatientSetPass from "./addPatientSetPass/addPatientSetPass";
import AddPatientVerifyUser from "./addPatientSetPass/addPatientVerifyUser";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

import AutoAddPatient from "./AutoAddPatient/AutoAddPatient";
import VerifyUser from "./Verify User/verifyUser";
import VerifyUserResetPassword from "./Verify User Reset Password/verifyUserResetPass";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import auth from "./Shared/Auth/auth";

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        {auth.isLoggedIn ? (
          <Switch>
            <Route path="/" component={HomePage} exact />
            <Route
              path="/createpatientmanually"
              component={CreateAddPatient}
              exact
            />
            <Route
              path="/createpatientmanuallysetpass"
              component={AddPatientSetPass}
              exact
            />

            <Route path="/edit_profile" component={EditProfilePage} exact />

            <Route path="/patientroutine" component={PatientRoutine} exact />
            <Route path="/addpatient" component={AutoAddPatient} exact />
            <Route path="/notification" component={NotificationPage} exact />
            <Route path="/edit_profile" component={EditProfilePage} exact />

            <Route path="/patientroutine" component={PatientRoutine} exact />

            <Route path="/addpatient" component={AutoAddPatient} exact />

            <Redirect to="/"></Redirect>
          </Switch>
        ) : (
          <Switch>
            <Route path="/" component={HomePage} exact />
            <Route path="/login" component={LoginPage} exact />
            <Route path="/register" component={registrationPage} exact />
            <Route path="/forgot_password" component={ForgotPassPage} exact />

            <Route path="/reset_password" component={ResetPassPage} exact />

            <Route path="/confirmation/:token" component={VerifyUser} exact />
            <Route
              path="/setPasswordForNewPatient/:token"
              component={AddPatientVerifyUser}
              exact
            />

            <Route
              path="/resetPassword/:token"
              component={VerifyUserResetPassword}
              exact
            />

            <Redirect to="/login"></Redirect>
          </Switch>
        )}
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
