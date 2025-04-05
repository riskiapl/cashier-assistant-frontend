import { createStore } from "solid-js/store";

// Initialize auth state from localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem("user") || null),
  token: localStorage.getItem("token") || null,
};

// Create store
const [auth, setAuth] = createStore(initialState);

function useAuth() {
  const login = (userData) => {
    const { token, user } = userData;
    localStorage.setItem("user", JSON.stringify(user || ""));
    localStorage.setItem("token", token || "");
    setAuth({ user, token });
  };

  const logout = () => {
    const language = localStorage.getItem("language");
    const darkMode = localStorage.getItem("darkMode");
    const sidebarOpen = localStorage.getItem("sidebarOpen");
    localStorage.clear();
    localStorage.setItem("language", language || "en");
    localStorage.setItem("darkMode", darkMode || "false");
    localStorage.setItem("sidebarOpen", sidebarOpen || "true");
    setAuth({ user: null, token: null });
  };

  const isAuthenticated = () => Boolean(auth.user);

  return { auth, isAuthenticated, login, logout };
}

export { auth, setAuth, useAuth };
