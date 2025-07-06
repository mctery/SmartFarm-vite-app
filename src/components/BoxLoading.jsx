
import React from 'react';
import { Box, CircularProgress, Typography, Stack } from '@mui/material';

const BoxLoading = () => {
  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      minHeight="100vh"
    >
      <CircularProgress />
      <Typography>Loading...</Typography>
    </Stack>
  );
};

export default BoxLoading;
