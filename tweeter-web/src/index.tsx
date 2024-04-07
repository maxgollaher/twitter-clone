import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ToastProvider from "./components/toaster/ToastProvider";
import UserInfoProvider from "./components/userInfo/UserInfoProvider";
import "./index.css";

library.add(fab);

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <UserInfoProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </UserInfoProvider>
  </React.StrictMode>
);
