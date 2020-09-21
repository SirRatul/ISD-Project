import React from "react";
import { Helmet } from "react-helmet";
import LoginBox from "./LoginBox";

const Login = () => {
  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login</title>
      </Helmet>
      <LoginBox />
    </React.Fragment>
  );
};

export default Login;
