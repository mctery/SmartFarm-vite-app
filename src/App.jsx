import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { NAVIGATION } from "./pages/_router";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router";
import { SnackbarProvider } from "notistack";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5AB393", // ✅ สีเขียวสำหรับ navbar
    },
    background: {
      default: "#F5F5F5", // ✅ สีเทาอ่อนสำหรับเนื้อหา (container)
      paper: "#F2F2F2",   // ✅ พื้นหลัง component/card เป็นขาว
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#5AB393", // ✅ Navbar สีเขียว
          color: "#F2F2F2",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#F2F2F2", // ✅ Sidebar สีขาว
          color: "#000000",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "#F5F5F5", // ✅ สีเทาอ่อนใน main content
          minHeight: "100vh",
          padding: "16px",
        },
      },
    },
  },
});

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ReactRouterAppProvider
        theme={theme}
        navigation={NAVIGATION}
        branding={{
          logo: <img src="./logo.png" alt="logo" />,
          title: "Smart Chu Farm",
          homeUrl: "/dashboard",
          description: "Smart Chu Farm - A Smart Farming Solution",
        }}
      >
        <Outlet />
      </ReactRouterAppProvider>
    </SnackbarProvider>
  );
}
