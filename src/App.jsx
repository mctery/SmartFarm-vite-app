import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { NAVIGATION } from "./pages/_router";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router";
import { SnackbarProvider } from 'notistack';

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
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
          homeUrl: "/toolpad/core/introduction",
        }}
      >
        <Outlet />
      </ReactRouterAppProvider>
    </SnackbarProvider>
  );
}
