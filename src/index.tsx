import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import React from "react";

import ReactDOM from "react-dom/client";
import { ReactFlowProvider } from "reactflow";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import App from "./viz/App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider>
      <ReactFlowProvider>
        <Notifications />
        <App />
      </ReactFlowProvider>
    </MantineProvider>
  </React.StrictMode>
);
