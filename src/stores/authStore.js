import { createStore } from "solid-js/store";

// Initialize auth state from localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token") || null,
};

// Create store
const [auth, setAuth] = createStore(initialState);

export function useAuth() {
  const login = (userData) => {
    const { token, user } = userData;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setAuth({ user, token });
  };

  const logout = () => {
    // localStorage.removeItem("user");
    // localStorage.removeItem("token");
    localStorage.clear();
    setAuth({ user: null, token: null });
  };

  const isAuthenticated = () => Boolean(auth.user);

  return { auth, isAuthenticated, login, logout };
}

export { auth, setAuth };
