import React from "react";
import AuthUI from "../components/AuthUI";

const Login = ({ setUser }) => {
  const handleAuthentication = (token) => {
    console.log("Authenticated User Token:", token);
    setUser({ token });
  };

  return (
    <div>
      <AuthUI onAuthenticated={handleAuthentication} />
    </div>
  );
};

export default Login;
