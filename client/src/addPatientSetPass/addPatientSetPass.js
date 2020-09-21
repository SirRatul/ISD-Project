import React from "react";
import NavigationBar from "../Shared/Components/NavigationBar";
import Banner from "../Shared/img/Banner.png";
import "./addPatientSetPass.css";
import auth from "../Shared/Auth/auth";
import axios from "axios";
import { Redirect } from "react-router-dom";
import ErrorModal from "../Shared/Components/ErrorModal";


class AddPatientSetPass extends React.Component{

    constructor(){
        super();
        this.state={
            password: "",
            confirmPass: "",
            showSpinner: false,
            showBtn: true,
            redirect :false

        };
        console.log("test message: "+auth.authMessage);
    }

    inputHandle = (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }; 

    errorHandle =()=>{
        //auth.authMessage=null; //clear the previous auth message
        this.setState({
            response_message:"",
        });
    };

    sendForm = async (e) => {
        e.preventDefault();
        console.log(this.state.password);
        console.log(this.state.confirmPass);

        this.setState({
            showBtn:false,
            showSpinner:true
        });

        console.log(auth.tempToken);

        /*to send a token to the patients email to add and veryfiy his password as a newly created patient manually. */
        try{
            
            const response = await  axios.post(
                process.env.REACT_APP_BACKEND_URL +"conformation/request/"+auth.tempToken,
                {
                    password: this.state.password,
                    confirm: this.state.confirmPass
                }
            );
            

            auth.authMessage= response.data.message;

            this.setState({
                response_message: response.data.message
            });

            this.setState({
                redirect:true //redirect true because condition gets fullfiled
            });
            console.log(response.data);
        }
        catch(error){
            console.log(error.response.data)
            // auth.authMessage= error.response.data.message;
            this.setState({
                response_message: error.response.data.message
            });
            console.log(error.response.data);
        } 

        this.setState({
            showSpinner:false,
            showBtn:true
        });
    }

   



    render(){
        //redirect to login page after set the password
        const {redirect}= this.state;

        if(redirect){
            return <Redirect to = "/login"/>
            
        }

        else
            return(
                <div>
                    
                    {this.state.response_message && (
                        <ErrorModal
                            message={this.state.response_message}
                            onClear={this.errorHandle.bind(this)}
                        />
                    )}
                    <NavigationBar />

                    <div className="row">
                        <div className="col-12 col-sm-12">
                            <img
                            className="image-fluid banner"
                            src={Banner}
                            height="200px"
                            width="100%"
                            alt="Banner"
                            ></img>
                        </div>
                        <div className="headline">
                            <p className="text-center text-light ml-3 mb-4 ml-lg-0 headlineForXs display-4">
                                Set Your Password
                            </p>
                        </div>
                    </div>

                    <div className="container setPassPage">
                        <form onSubmit={this.sendForm}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="input-field">
                                        <input
                                        type="password"
                                        className="form-control rounded-pill   form-input-background "
                                        name="password"
                                        value={this.state.password}
                                        // onInput={this.inputHandle}
                                        id="password"
                                        onChange={(e) =>
                                            this.setState({
                                            password: e.target.value,
                                            })
                                        }
                                        required
                                        />
                                        <label className="login-input-label" htmlFor="password">
                                        New Password
                                        </label>
                                    </div>
                                    </div>
                                    <div className="col-sm-6">
                                    <div className="input-field">
                                        <input
                                        type="password"
                                        className="form-control rounded-pill   form-input-background "
                                        name="confirmPass"
                                        value={this.state.confirmPass}
                                        // onInput={this.inputHandle}
                                        id="confirmPass"
                                        onChange={(e) => this.setState({ confirmPass: e.target.value })}
                                        required
                                        />
                                        <label className="login-input-label" htmlFor="confirmPass">
                                        Confirm Password
                                        </label>
                                    </div>
                                </div>
                            </div>

                            
                            {this.state.showSpinner ? (
                                <div className="spinner-border m-auto" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ): null}

                            {this.state.showBtn ? (
                                <div className="row btnDesign">
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
                                        fontSize: "14px"
                                    }}
                                    >
                                        Submit
                                    </button>
                                </div>
                            ): null}
                            
                            
                        </form>
                    </div>

                    
                    </div>
                );
    }
}
export default AddPatientSetPass;