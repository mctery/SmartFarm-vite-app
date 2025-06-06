import axios from "axios";

const API_BASE = import.meta.env.VITE_API;

export async function SysCheckToken() {
  const token = localStorage.getItem("x-token");

  try {
    const { data } = await axios.post(`${API_BASE}/api/users/token`, { token });
    if (data.message === "OK") {
      return true;
    }

    redirectToLogin();
    return false;
  } catch (error) {
    console.error("Token check failed:", error);
    redirectToLogin();
    return false;
  }
}

export function SysSignout() {
  console.log("Logging out...");
  localStorage.clear();
  setTimeout(redirectToLogin, 2000);
}

export async function SysLogin(username, password) {
  try {
    let res = await axios
      .post(`${API_BASE}/api/users/login`, {
        email: username,
        password: password,
      })
      .then(async (res) => {
        let ds = res.data;
        if (ds.message === "OK") {
          localStorage.setItem("x-token", ds.token);
          localStorage.setItem("user_info", JSON.stringify(ds.data));
          return ds.data;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
      });
    return res;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function SysRegister(name, surname, email, password) {
  try {
    const res = await axios
      .post(`${API_BASE}/api/users/register`, {
        first_name: name,
        last_name: surname,
        email: email,
        password: password,
      })
      .then(async (res) => {
        let ds = res.data;
        if (ds.message === "OK") {
          return ds.data;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.error("Registration error:", err);
      });
    return res;
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
}

function redirectToLogin() {
  window.location.pathname = "/login";
}
