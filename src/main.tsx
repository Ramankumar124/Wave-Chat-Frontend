import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.js";
import { ErrorBoundary } from "react-error-boundary";
import FallbackUI from "./components/ui/fallbackUI.js";
import { SocketProvider } from "./context/socket";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={FallbackUI}>
    <SocketProvider>
    <Provider store={store}>
      <App />
    </Provider>
    </SocketProvider>
  </ErrorBoundary>
);
  