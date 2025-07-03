import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, TextField, Typography, Divider, Box } from "@mui/material";
import { useSnackbar } from 'notistack';
import { SysRegister } from "../../services/global_function";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AuthLayout from "../../components/AuthLayout";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, password, password_confirm } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      enqueueSnackbar("รูปแบบอีเมลไม่ถูกต้อง", { variant: "error" });
      return false;
    }

    if (password.length < 6) {
      enqueueSnackbar("รหัสผ่านต้องมีความยาวมากกว่า 6 ตัวอักษร", { variant: "error" });
      return false;
    }

    if (password !== password_confirm) {
      enqueueSnackbar("รหัสผ่านไม่ตรงกัน", { variant: "error" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // console.log(formData);
    const res = await SysRegister(formData.name, formData.surname ,formData.email, formData.password);
    if (res) {
      enqueueSnackbar("ท่านได้สมัครสมาชิกเรียบร้อยแล้ว...", { variant: "success" });
      enqueueSnackbar("กำลังไปที่หน้า Login...", { variant: "info" });
      setTimeout(() => navigate("/"), 2000);
    } else {
      enqueueSnackbar("email หรือ password ไม่ถูกต้อง", { variant: "error" });
    }
  };

  const formFields = [
    { label: "ชื่อผู้ใช้", name: "name" },
    { label: "นามสกุล", name: "surname" },
    { label: "Email Address สำหรับเข้าสู่ระบบ", name: "email", type: "email", autoComplete: "email" },
    { label: "รหัสผ่าน", name: "password", type: "password", autoComplete: "new-password" },
    { label: "ยืนยันรหัสผ่านอีกครั้ง", name: "password_confirm", type: "password", autoComplete: "new-password" },
  ];

  return (
    <AuthLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 2 }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIosNewIcon />}
            color="success"
            onClick={() => navigate("/")}
            sx={{ textTransform: "none" }}
          >
            กลับ
          </Button>
          <Typography variant="h5" color="success" sx={{ fontWeight: "bold" }}>
            Smart Farm Register
          </Typography>
        </Box>

          <Divider sx={{ width: "100%", mb: 2 }} />

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Typography color="success" sx={{ fontWeight: "bold" }}>ระบบสมัครสมาชิก</Typography>

            {formFields.map((field, index) => (
              <>
                {
                  index === 2 &&
                  <>
                    <Divider sx={{ width: "100%", mb: 2, mt: 2 }} />
                    <Typography color="success" sx={{ fontWeight: "bold" }}>สำหรับเข้าสู่ระบบ</Typography>
                  </>
                }
                <TextField
                  key={field.name}
                  size="small"
                  color="success"
                  margin="normal"
                  required
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  autoComplete={field.autoComplete || "off"}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              </>
            ))}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 2, mb: 2, padding: "12px" }}
            >
              สมัครสมาชิก
            </Button>
          </form>

          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
            Welcome to Smart Farm Management System
          </Typography>
    </AuthLayout>
  );
};

export default RegisterPage;
