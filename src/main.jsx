import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "weather-icons/css/weather-icons.css";
import "gridstack/dist/gridstack.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Layout from "./layouts/DashboardLayout";

import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";

import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import HelpPage from "./pages/HelpPage";

import FarmControlDevices from "./pages/farm/FarmControlDevices";
import FarmGridStackOverview from "./pages/farm/FarmGridStackOverview";

import PageNotFound from "./pages/PageNotFound";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    errorElement: <PageNotFound />,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
      {
        Component: Layout,
        children: [
          {
            path: "dashboard",
            Component: DashboardPage,
          },
          {
            path: "about",
            Component: AboutPage,
          },
          {
            path: "help",
            Component: HelpPage,
          },
          {
            path: "farm_control_system",
            Component: FarmControlDevices,
            // children: [
            //   {
            //     path: "devices",
            //     Component: FarmControlDevices,
            //     children: [
            //       {
            //         path: "gridstack/:deviceId",
            //         Component: FarmGridStackOverview,
            //       }
            //     ]
            //   },
            // ]
          },
          {
            path: "farm_control_system/devices",
            Component: FarmControlDevices,
          },
          {
            path: "farm_control_system/devices/gridstack/:deviceId",
            Component: FarmGridStackOverview,
          },
        ],
      },
      {
        path: "*",
        Component: PageNotFound,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
