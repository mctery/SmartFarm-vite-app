import axios from "axios";

const API_BASE = import.meta.env.VITE_API;
const apiClient = axios.create({ baseURL: API_BASE });

export async function SysCheckToken(options = { redirect: true }) {
  const token = localStorage.getItem("x-token");

  if (!token) {
    if (options.redirect) {
      redirectToLogin();
    }
    return false;
  }

  try {
    const { data } = await apiClient.post("/api/users/token", { token });
    if (data.message === "OK") {
      return true;
    }

    if (options.redirect) {
      redirectToLogin();
    }
    return false;
  } catch (error) {
    console.error("Token check failed:", error);
    if (options.redirect) {
      redirectToLogin();
    }
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
    const { data } = await apiClient.post("/api/users/login", {
      email: username,
      password,
    });

    if (data.message === "OK") {
      localStorage.setItem("x-token", data.token);
      localStorage.setItem("user_info", JSON.stringify(data.data));
      return data.data;
    }

    return false;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function SysRegister(name, surname, email, password) {
  try {
    const { data } = await apiClient.post("/api/users/register", {
      first_name: name,
      last_name: surname,
      email,
      password,
    });

    if (data.message === "OK") {
      return data.data;
    }

    return false;
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
}

function redirectToLogin() {
  window.location.pathname = "/";
}