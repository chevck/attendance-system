import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div className='ccw-attendance-app'>
    <Router />
    <ToastContainer transition={"Bounce"} closeOnClick limit={1} />
  </div>
);
