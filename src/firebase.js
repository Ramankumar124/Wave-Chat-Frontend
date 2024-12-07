import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCVsrSdA_zdgrlI4etWPJ9UcW9EIyJl05w",
    authDomain: "wave-chat-2f232.firebaseapp.com",
    projectId: "wave-chat-2f232",
    storageBucket: "wave-chat-2f232.appspot.com",
    messagingSenderId: "42490857268",
    appId: "1:42490857268:web:4a8f35a60e5bc11f240761",
    measurementId: "G-TVFRQYJ80B"
  };

 // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const app = initializeApp(firebaseConfig);
export { messaging };
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
export { auth, googleProvider };