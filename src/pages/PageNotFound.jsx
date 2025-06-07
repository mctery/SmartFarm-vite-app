import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      maxWidth={null}
      paperSx={{
        bgcolor: "rgba(255,255,255,0.85)",
        p: 5,
        borderRadius: 2,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main", mb: 1 }} />
      <Typography variant="h2" color="error" gutterBottom sx={{ fontWeight: "bold" }}>
        404
      </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Sorry, page not found!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              const token = localStorage.getItem("x-token");
              navigate(token ? "/dashboard" : "/");
            }
          }}
        >
        กลับหน้าหลัก
      </Button>
    </AuthLayout>
  );
}

