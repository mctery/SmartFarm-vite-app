import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import App from "./App";
import Layout from "./layouts/dashboard";

import LoginPage from "./pages/authen/login";
import RegisterPage from "./pages/authen/register";

import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import PageNotFound from "./pages/PageNotFound";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: () => <LoginPage/>,
      },
      {
        path: "/register",
        Component: () => <RegisterPage/>,
      },
      {
        path: "/",
        Component: Layout,
        children: [
          {
            path: "dashboard",
            Component: () => <DashboardPage/>,
          },
          {
            path: "about",
            Component: () => <AboutPage/>,
          },
        ],
      },
    ],
    // errorElement: <PageNotFound />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
