import * as React from "react";
import { Outlet } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Stack, Button } from "@mui/material";
import { ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import { useSnackbar } from "notistack";
import { SysSignout } from "../services/auth_service";

function ToolbarActions() {
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = () => {
    enqueueSnackbar("กำลังออกจากระบบ...", {
      variant: "info",
      autoHideDuration: 3000,
    });
    SysSignout();
  };
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {/* <ThemeSwitcher /> */}
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={handleLogout}
      >
        ออกจากระบบ
      </Button>
    </Stack>
  );
}

export default function Layout() {
  return (
    <DashboardLayout slots={{ toolbarActions: ToolbarActions }}>
      <PageContainer title="">
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
