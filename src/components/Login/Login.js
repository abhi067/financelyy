import React from "react";
import Input from "../Input/Input";
import { useState } from "react";
import Button from "../Button/Button";
import "./Login.css";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function Login({ login, handleToggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  function loginUsingEmail() {
    setLoading(true); // Button will be enabled

    console.log(email);
    console.log(password);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logges In Successfully");
          // ...
          setEmail("");
          setPassword("");

          setLoading(false); // Button will be disabled

          navigate("/dashboard"); // after login navigating to dashboard page
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);

          setLoading(false); // Button will be disabled
        });
    } else {
      toast.error("All fields are mandatory");
      setLoading(false); // Button will be disabled
    }
  }
  function authenticateWithGoogle() {
    setLoading(true); // Button will be enabled
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log(user);
          toast.success("User signed in successfuly");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          setLoading(false); // Button will be disabled
          navigate("/dashboard"); // after login navigating to dashboard page
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false); // Button will be disabled
        });
    } catch (e) {
      toast.error(e.message);
      setLoading(false); // Button will be disabled
    }
  }

  return (
    <div className="login-wrapper">
      <h2 className="title">
        Log in to <span style={{ color: "var(--theme)" }}>Financely.</span>
      </h2>
      <form>
        <Input
          type={"email"}
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"TonyStark@gmail.com"}
        />
        <Input
          type={"password"}
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Example@123"}
        />
        <Button
          disabled={loading}
          text={loading ? "Loading..." : "Login Using Email & Password"}
          onClick={loginUsingEmail}
        />
        <p style={{ textAlign: "center", fontSize: "0.8rem", fontWeight: 400 }}>
          or
        </p>
        <Button
          disabled={loading}
          text={loading ? "Loading..." : "Login Using Google"}
          blue={true}
          onClick={authenticateWithGoogle}
        />
        <p style={{ textAlign: "center", fontSize: "0.8rem", fontWeight: 400 }}>
          Or Have An Account Already?{" "}
          <span
            style={{ color: "var(--theme)", cursor: "pointer" }}
            onClick={() => {
              if (login) {
                handleToggle(false);
              }
            }}
          >
            Click Here
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
