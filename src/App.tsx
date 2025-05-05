import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
} from "react-router-dom";
import Home from "./pages/Home/home";
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { RootState } from "./redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "./redux/features/authSlice";
import AuthLaout from "./pages/auth";
import { AppDispatch } from "./redux/store/store";
import { Spinner } from "../Spinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { setTheme } from "./redux/features/applSlice";
import { Toaster } from "react-hot-toast";

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

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      dispatch(setTheme(localTheme));
    }
  }, []);

  const { user, loader } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.app.theme);
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
          data-theme={theme}
          className="App"
        >
          <Toaster/>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute user={!user} redirect={"/"}>
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
