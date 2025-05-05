// Import Firebase scripts for service worker usage
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVsrSdA_zdgrlI4etWPJ9UcW9EIyJl05w",
  authDomain: "wave-chat-2f232.firebaseapp.com",
  projectId: "wave-chat-2f232",
  storageBucket: "wave-chat-2f232.appspot.com",
  messagingSenderId: "42490857268",
  appId: "1:42490857268:web:4a8f35a60e5bc11f240761",
  measurementId: "G-TVFRQYJ80B",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});
