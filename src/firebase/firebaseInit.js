// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQsgKdvCWBud-JBAHFJaVosJr9oBCWVjA",
  authDomain: "colorizephotos-385720.firebaseapp.com",
  projectId: "colorizephotos-385720",
  storageBucket: "colorizephotos-385720.appspot.com",
  messagingSenderId: "801196932289",
  appId: "1:801196932289:web:003038dc79f5d4ee75e840",
  measurementId: "G-J8TFWCNPRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);