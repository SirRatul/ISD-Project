import React from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import auth from "../Shared/Auth/auth";

function VerifyUser() {
  const { token } = useParams(); //get token from link
  const history = useHistory(); //for link redirect

  const verificationMethod = async () => {
    try {
      const response = await axios.get(
        //call API
        process.env.REACT_APP_BACKEND_URL + "conformation/" + token
      );
      auth.authMessage = response.data.message;

      history.push("/login");
    } catch (error) {
      auth.authMessage = error.response.data.message;

      history.push("/login");
    }
  };
  verificationMethod();

  return <div></div>;
}

export default VerifyUser;
