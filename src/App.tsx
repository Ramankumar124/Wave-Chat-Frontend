import "./App.css";
import { BrowserRouter as Router, Routes, Route, redirect } from "react-router-dom";
import Home from "./components/home";
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { useUser } from "./context/UserContext";
import { RootState } from "./redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserData,
  removeUserData,
  setUserData,
} from "./redux/features/authSlice";
import AuthLaout from "./pages/auth";
import axios from "axios";
import { server } from "./constants/config";
import { AppDispatch } from "./redux/store/store";
import { Spinner } from "../Spinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  // const {theme,setTheme} = useUser();
  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/firebase-messaging-sw.js')
  //       .then(function(registration) {
  //         console.log('Service Worker registered with scope:', registration.scope);
  //       })
  //       .catch(function(error) {
  //         console.log('Service Worker registration failed:', error);
  //       });
  //   }

  // },[])

  // useEffect(() => {
  //   onMessage(messaging, (payload) => {
  //     console.log("Message received in foreground:", payload);
  //     // Optionally show a toast or custom notification here
  //   });
  // }, []);

  // useEffect(() => {
  //   const localTheme = localStorage.getItem('theme');
  //   if (localTheme) {
  //     setTheme(localTheme);
  //   }

  // }, [])

  const { user, loader } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  if (loader) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <Router>
        <div
          //  data-theme={theme}
          data-theme="light"
          className="App"
        >
          <Routes>
          <Route path="/" element={
              <ProtectedRoute user={user}>
              <Home />
              </ProtectedRoute>
              } 
              />
            <Route
              path="/login"
              element={
                <ProtectedRoute user={!user}  redirect={"/"}>
                  <AuthLaout />
                </ProtectedRoute>
              }
            />
        
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
