import React from "react";
import "./SignupSignin.css";
import Input from "../Input/Input";
import { useState } from "react";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignupSignin({ login, handleToggle }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  function signupWithEmail() {
    setLoading(true); // Button will be enabled

    console.log(name);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    // Authenticate the user , or basically signup using email and password
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("User>>>", user);
            toast.success("User signed in successfuly");
            // ...

            setLoading(false); // Button will be disabled

            setName(""); // clearing the input box after user is created
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            navigate("/dashboard"); // after signup navigating to dashboard page

            createDoc(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);

            setLoading(false); // Button will be disabled
            // ..
          });
      } else {
        toast.error("Password and Confirm Password do not match.");
        setLoading(false); // Button will be disabled
      }
    } else {
      toast.warn("All fields are mandatory");
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
          createDoc(user);
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

  async function createDoc(user) {
    // Make sure that the doc with the uid dosen't exitst
    // Create a doc
    console.log("inside createDoc!");

    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      // Checking id user already exists
      try {
        await setDoc(doc(db, "users", user.uid), {
          // creating new DOC for the user if not existed
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("User DOC created successfuly!");
      } catch (e) {
        toast.error(e.message);
      }
    } else {
      toast.error("User DOC already exists!");
    }
  }

  return (
    <div className="signup-wrapper">
      <h2 className="title">
        Sign Up on <span style={{ color: "var(--theme)" }}>Financely.</span>
      </h2>
      <form>
        <Input
          type={"text"}
          label={"Full Name"}
          state={name}
          setState={setName}
          placeholder={"Tony Stark"}
        />
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
        <Input
          type={"password"}
          label={"Confirm Password"}
          state={confirmPassword}
          setState={setConfirmPassword}
          placeholder={"Example@123"}
        />
        <Button
          disabled={loading}
          text={loading ? "Loading..." : "Signup Using Email & Password"}
          onClick={signupWithEmail}
        />
        <p style={{ textAlign: "center", fontSize: "0.8rem", fontWeight: 400 }}>
          or
        </p>
        <Button
          disabled={loading}
          text={loading ? "Loading..." : "Signup Using Google"}
          blue={true}
          onClick={authenticateWithGoogle}
        />
        <p style={{ textAlign: "center", fontSize: "0.8rem", fontWeight: 400 }}>
          Or Have An Account Already?{" "}
          <span
            style={{ color: "var(--theme)", cursor: "pointer" }}
            onClick={() => {
              if (!login) {
                handleToggle(true);
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

export default SignupSignin;
