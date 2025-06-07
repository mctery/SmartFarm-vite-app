import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button, TextField, Typography, Divider } from "@mui/material";
import { useSnackbar } from 'notistack';
import { SysLogin, SysCheckToken } from "../../service/global_function";
import AuthLayout from "../../components/AuthLayout";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem("x-token");
      if (token) {
        const valid = await SysCheckToken({ redirect: false });
        if (valid) {
          enqueueSnackbar("เข้าสู่ระบบอัตโนมัติ...", { variant: "info" });
          navigate("/dashboard");
        }
      }
    };

    autoLogin();
  }, [navigate, enqueueSnackbar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await SysLogin(formData.email, formData.password);
    if (res) {
      enqueueSnackbar("กำลังเข้าสู่ระบบ...", { variant: "success", autoHideDuration: 3000 });
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } else {
      enqueueSnackbar("email หรือ password ไม่ถูกต้อง", { variant: "error", autoHideDuration: 3000 });
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h5" color="success" sx={{ mb: 2, fontWeight: "bold", }}>Smart Farm Login</Typography>
          <Divider sx={{ width: "100%", mb: 2}} />
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              size="small"
              color="success"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              size="small"
              color="success"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{mb: 2}}
            />
            <Button
              color="primary"
              onClick={() => navigate("/register")}
              sx={{ textTransform: "none" }}
            >
              เข้าร่วมเป็นสมาชิก
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 2, mb: 2, padding: "12px" }}
            >
              เข้าสู่ระบบ
            </Button>
          </form>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mt: 2 }}
          >
            Welcome to Smart Farm Management System
          </Typography>
    </AuthLayout>
  );
};

export default LoginPage;
