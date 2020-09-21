import React from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import auth from "../Shared/Auth/auth";
import AddPatientSetPass from "./addPatientSetPass";

function AddPatientVerifyUser () {
    const { token } = useParams(); //get token from url
    const history = useHistory(); //to redirect link
    //alert("hello user");

    const verifyMethod = async () =>{
        try{
            const response = await axios.get(
                //process.env.REACT_APP_BACKEND_URL+'conformation/request/'+token,
                process.env.REACT_APP_BACKEND_URL +"conformation/request/" + token
            );
            auth.authMessage = response.data.message;
            console.log(auth.authMessage);
            auth.tempToken= token;

            //history.push("/login"); redirect to login
        }
        catch(error){
            auth.authMessage = error.response.data.message;
            console.log(auth.authMessage);

            history.push("/") //redirect to homepage

        }
    };


    verifyMethod();
    return <div><AddPatientSetPass/></div>;
}

export default AddPatientVerifyUser;