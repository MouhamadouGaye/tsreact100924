import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

// Ensure the root element exists and is properly typed
if (!rootElement) {
  throw new Error("Root element not found. Check your HTML file for an element with id 'root'.");
}

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
