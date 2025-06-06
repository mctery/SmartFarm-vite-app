import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h1" color="primary" gutterBottom>404</Typography>
        <Typography variant="h5" color="text.secondary" paragraph>Sorry, page not found!</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>The page you're looking for doesn't exist or has been moved.</Typography>
        <Button variant="contained" onClick={() => navigate("/")}>กลับหน้าหลัก</Button>
      </Box>
    </Container>
  );
}
