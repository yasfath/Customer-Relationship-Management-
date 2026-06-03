import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/reset.css";
import "./index.css";
import { Provider } from "react-redux";
import { store, persistor } from "./Redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import { AuthProvider } from "./Redux/user/AuthContext.jsx";
window.global = window;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
        <AuthProvider> <App /></AuthProvider>
         
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
