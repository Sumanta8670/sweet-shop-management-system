import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

/**
 * Custom hook for authentication operations
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    token,
    isLoading,
    error,
    register,
    login,
    logout,
    clearError,
    isAdmin,
  } = useAuthStore();

  const handleRegister = useCallback(
    async (userData) => {
      try {
        await register(userData);
        navigate("/");
      } catch (err) {
        // Error is handled by the store
      }
    },
    [register, navigate]
  );

  const handleLogin = useCallback(
    async (credentials) => {
      try {
        await login(credentials);
        navigate("/");
      } catch (err) {
        // Error is handled by the store
      }
    },
    [login, navigate]
  );

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token,
    isAdmin: isAdmin(),
    handleRegister,
    handleLogin,
    handleLogout,
    clearError,
  };
};

export default useAuth;
