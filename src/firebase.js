import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
const firebaseConfig = {
    apiKey: "AIzaSyCVsrSdA_zdgrlI4etWPJ9UcW9EIyJl05w",
    authDomain: "wave-chat-2f232.firebaseapp.com",
    projectId: "wave-chat-2f232",
    storageBucket: "wave-chat-2f232.appspot.com",
    messagingSenderId: "42490857268",
    appId: "1:42490857268:web:4a8f35a60e5bc11f240761",
    measurementId: "G-TVFRQYJ80B"
  };

  export const app = initializeApp(firebaseConfig);
  export const messaging = getMessaging(app);