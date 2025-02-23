import { createSignal } from "solid-js";

const [isAuthenticated, setIsAuthenticated] = createSignal(
  !!localStorage.getItem("auth")
);

export function useAuth() {
  const login = (userData) => {
    localStorage.setItem("auth", JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
