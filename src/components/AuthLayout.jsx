import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import { styled } from '@mui/system';
import backgroundImage from '../assets/farm_background.png';

const StyledContainer = styled(Container)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const defaultPaperSx = {
  p: '40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '15px',
};

export default function AuthLayout({
  children,
  maxWidth = 400,
  paperSx = {},
  containerProps = {},
  wrapperProps = {},
  paperProps = {},
}) {
  const { sx: wrapperSx = {}, ...otherWrapper } = wrapperProps;
  const { sx: contSx = {}, ...otherContainer } = containerProps;
  const { sx: pSx = {}, ...otherPaper } = paperProps;
  return (
    <StyledContainer maxWidth={false} sx={contSx} {...otherContainer}>
      <Box
        sx={{ ...(maxWidth ? { maxWidth, width: '100%' } : {}), ...wrapperSx }}
        {...otherWrapper}
      >
        <Paper
          elevation={3}
          sx={{ ...defaultPaperSx, ...paperSx, ...pSx }}
          {...otherPaper}
        >
          {children}
        </Paper>
      </Box>
    </StyledContainer>
  );
}
