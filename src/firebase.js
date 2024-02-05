// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-WRyIJrE9rGzI7faiY8C-fvUM6sw9kr8",
  authDomain: "financely-dd574.firebaseapp.com",
  projectId: "financely-dd574",
  storageBucket: "financely-dd574.appspot.com",
  messagingSenderId: "107711475204",
  appId: "1:107711475204:web:cdb467ac601b7f79684f51",
  measurementId: "G-BNXGNBMGMF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db, auth, provider, doc, setDoc };