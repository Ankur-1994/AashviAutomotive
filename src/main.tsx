import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "react-day-picker/dist/style.css";
import { HeadProvider } from "react-head";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeadProvider>
      <App />
    </HeadProvider>
  </React.StrictMode>
);
