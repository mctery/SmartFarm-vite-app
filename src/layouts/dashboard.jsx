import * as React from 'react';
import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Stack, Button } from '@mui/material';
import { ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { useSnackbar } from 'notistack';
import { SysSignout } from '../service/global_function';

function ToolbarActionsWithLogout() {
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = () => {
    enqueueSnackbar('กำลังออกจากระบบ...', { variant: 'info', autoHideDuration: 3000 });
    SysSignout();
  };
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <ThemeSwitcher />
      <Button variant="outlined" size="small" onClick={handleLogout}>
        Logout
      </Button>
    </Stack>
  );
}

export default function Layout() {
  return (
    <DashboardLayout slots={{ toolbarActions: ToolbarActionsWithLogout }}>
      <PageContainer title=''>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
