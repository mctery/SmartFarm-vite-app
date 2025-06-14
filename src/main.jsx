import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import App from "./App";
import Layout from "./layouts/dashboard";

import LoginPage from "./pages/authen/login";
import RegisterPage from "./pages/authen/register";

import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import HelpPage from "./pages/HelpPage";
import FarmControlSystem from "./pages/FarmControlSystem";
import PageNotFound from "./pages/PageNotFound";

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    errorElement: <PageNotFound />, 
    children: [
      {
        index: true,
        Component: LoginPage,
      },
      {
        path: 'register',
        Component: RegisterPage,
      },
      {
        Component: Layout,
        children: [
          {
            path: 'dashboard',
            Component: DashboardPage,
          },
          {
            path: 'about',
            Component: AboutPage,
          },
          {
            path: 'help',
            Component: HelpPage,
          },
          {
            path: 'farm_control_system',
            Component: FarmControlSystem,
          },
        ],
      },
      {
        path: '*',
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
