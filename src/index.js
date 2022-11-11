import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CookiesProvider>
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CookiesProvider>
);
