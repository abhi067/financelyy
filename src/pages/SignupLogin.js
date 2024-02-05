import React from "react";
import Header from "../components/Header/Header";
import SignupSignin from "../components/SignupSignin/SignupSignin";
import { useState } from "react";
import Login from "../components/Login/Login";

function SignupLogin() {
  const [login, setLogin] = useState(false);

  function handleToggle(e) {
    setLogin(e);
  }
  return (
    <div>
      <Header />
      <div className="wrapper">
        {login ? (
          <Login handleToggle={handleToggle} login={login} />
        ) : (
          <SignupSignin handleToggle={handleToggle} login={login} />
        )}
      </div>
    </div>
  );
}

export default SignupLogin;
