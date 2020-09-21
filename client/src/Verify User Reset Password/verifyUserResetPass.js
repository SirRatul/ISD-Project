import React from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import auth from "../Shared/Auth/auth";

function VerifyUserResetPass() {
  const { token } = useParams(); //get token from link
  const history = useHistory(); //for link redirect

  const verificationMethod = async () => {
    try {
      const response = await axios.get(
        //call API
        process.env.REACT_APP_BACKEND_URL + "reset/" + token
      );
      auth.authMessage = response.data.message; //send auth message to show in reset password page
      console.log(auth.authMessage);
      auth.tempToken = token; //temporary token for reset password API call in reset pass page

      history.push("/reset_password"); //redirect to reset pass page
    } catch (error) {
      auth.authMessage = error.response.data.message; // error message of API call
      console.log(auth.authMessage);

      history.push("/login"); //verfication failed!! go back to login page
    }
  };
  verificationMethod();

  return <div></div>;
}

export default VerifyUserResetPass;
