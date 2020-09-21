import React from "react";
import axios from "axios";
import ErrorModal from "../../Shared/Components/ErrorModal";
import auth from "../../Shared/Auth/auth";

class AddPatientForm extends React.Component{

    constructor(){
        super();
        this.state={
            fName:"",lName:"",email:"",phn:"",
            gender:"",age:"",height:"",weight:"",
            responseMessage: "",
            showSpinner: false,
            showSignUpBtn: true
        }

    }

    errorHandler = () =>{
        this.setState({
            responseMessage:""
        });
    };

    /* to set target value on input field */
    handleInput = (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    

    onSubmitForm = async (event) => {
        event.preventDefault();
    
        console.log(this.state.fName);
        console.log(this.state.lName);
        console.log(this.state.email);
        console.log(this.state.phn);
        console.log(this.state.gender);
        console.log(this.state.age);
        console.log(this.state.height);
        console.log(this.state.weight);

        this.setState({
            showSpinner: true,
            showSignUpBtn: false
        });

        try{
            const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL +"users/patientRegister",
                //process.env.REACT_APP_BACKEND_URL+"users/patientRegister",

                {
                    firstname: this.state.fName,
                    lastname:this.state.lName,
                    gender:this.state.gender,
                    age:this.state.age,
                    email:this.state.email,
                    phone:this.state.phn,
                    height:this.state.height,
                    weight:this.state.weight,
                    guardianId: auth.userId

                }

            );
            

            this.setState({
                responseMessage: response.data.message,
                fName:"",
                lName:"",
                gender:"",
                age:"",
                email:"",
                phn:"",
                height:"",
                weight:""

            });
            console.log(response.data.message);
            

        }
        catch(error){
            this.setState({
                responseMessage:error.response.data.message
            });

            console.log(error.response.data);
        }
        this.setState({
            showSignUpBtn:true,
            showSpinner:false
        });

      };

    render(){
        return(
            <div className="container">
                <form onSubmit={this.onSubmitForm}>
                    {this.state.responseMessage && (<ErrorModal
                    message={this.state.responseMessage}
                    onClear={this.errorHandler.bind(this)}/>
                    )}
                
                    <div className="row">
                        <div className="col-sm-6">
                        <div className="input-field">
                            <input
                            type="text"
                            className="form-control rounded-pill   form-input-background "
                            name="fName"
                            value={this.state.fName}
                            onInput={this.handleInput}
                            id="fName"
                            onChange={(e) =>
                                this.setState({
                                fName: e.target.value,
                                })
                            }
                            required
                            />
                            <label className="login-input-label" htmlFor="fName">
                            First Name
                            </label>
                        </div>
                        </div>
                        <div className="col-sm-6">
                        <div className="input-field forInput">
                            <input
                            type="text"
                            className="form-control rounded-pill   form-input-background "
                            name="lastName"
                            value={this.state.lName}
                            onInput={this.handleInput}
                            id="lastName"
                            onChange={(e) => this.setState({ lName: e.target.value })}
                            required
                            />
                            <label className="login-input-label" htmlFor="lastName">
                            Last Name
                            </label>
                        </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                        <div className="input-field">
                            <input
                            type="email"
                            className="form-control rounded-pill   form-input-background "
                            name="email"
                            value={this.state.email}
                            onInput={this.handleInput}
                            id="email"
                            onChange={(e) =>
                                this.setState({
                                email: e.target.value,
                                })
                            }
                            required
                            />
                            <label className="login-input-label" htmlFor="email">
                            Email
                            </label>
                        </div>
                        </div>
                        <div className="col-sm-6">
                        <div className="input-field forInput">
                            <input
                            type="tel"
                            className="form-control rounded-pill   form-input-background "
                            name="phnNo"
                            value={this.state.phn}
                            onInput={this.handleInput}
                            id="phnNo"
                            onChange={(e) => this.setState({ phn: e.target.value })}
                            required
                            />
                            <label className="login-input-label" htmlFor="phnNo">
                            Phone Number
                            </label>
                        </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                        <div className="input-field">
                            {/* <input
                            type="text"
                            className="form-control rounded-pill   form-input-background "
                            name="gender"
                            value={this.state.gender}
                            onInput={this.handleInput}
                            id="gender"
                            onChange={(e) =>
                                this.setState({
                                    gender: e.target.value,
                                })
                            }
                            required
                            /> */}

                            <select
                            className="form-control rounded-pill   form-input-background "
                            name="gender"
                            value={this.state.gender}
                            id="gender"
                            onChange={(e) => this.setState({ gender: e.target.value })}
                            custom="ture"
                            >
                            <option value="male" selected>
                                Male
                            </option>
                            <option value="female">Female</option>
                            </select>

                            {/* <label className="login-input-label" htmlFor="gender">
                            gender
                            </label> */}
                        </div>
                        </div>
                        <div className="col-sm-6">
                        <div className="input-field forInput">
                            <input
                            type="number" min="0"
                            className="form-control rounded-pill   form-input-background "
                            name="age"
                            value={this.state.age}
                            onInput={this.handleInput}
                            id="age"
                            onChange={(e) => this.setState({ age: e.target.value })}
                            required
                            />
                            <label className="login-input-label" htmlFor="age">
                            Age
                            </label>
                        </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                        <div className="input-field">
                            <input
                            type="number" min="0"
                            className="form-control rounded-pill   form-input-background "
                            name="height"
                            value={this.state.height}
                            onInput={this.handleInput}
                            id="height"
                            onChange={(e) =>
                                this.setState({
                                height: e.target.value,
                                })
                            }
                            required
                            />
                            <label className="login-input-label" htmlFor="height">
                            Height
                            </label>
                        </div>
                        </div>
                        <div className="col-sm-6">
                        <div className="input-field forInput">
                            <input
                            type="number" min="0"
                            className="form-control rounded-pill   form-input-background "
                            name="weight"
                            value={this.state.weight}
                            onInput={this.handleInput}
                            id="weight"
                            onChange={(e) => this.setState({ weight: e.target.value })}
                            required
                            />
                            <label className="login-input-label" htmlFor="weight">
                            Weight
                            </label>
                        </div>
                        </div>
                    </div>


                    {this.state.showSpinner ? (
                        <div className="spinner-border m-auto" role="status">
                            <span className="sr-only">Loading..</span>
                        </div>
                    ) :null}


                    {this.state.showSignUpBtn ? (
                        <div className="row">
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
                        CREATE
                        </button>
                    </div>
                    ): null}
                    

                </form>
            </div>
        );
    }

}
export default AddPatientForm;