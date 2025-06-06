import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";

export default function DashboardPage() {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Dashboard" />
            <CardContent>
              <Typography variant="h5">Welcome to the Dashboard</Typography>
              <Button variant="contained" color="primary">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
