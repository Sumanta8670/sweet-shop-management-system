import { create } from "zustand";
import authService from "../services/authService";

/**
 * Zustand store for authentication state management
 */
const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("authToken") || null,
  isLoading: false,
  error: null,

  /**
   * Register a new user
   */
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.registerUser(userData);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response));
      set({ user: response, token: response.token, isLoading: false });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Login a user
   */
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.loginUser(credentials);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response));
      set({ user: response, token: response.token, isLoading: false });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Logout the user
   */
  logout: () => {
    authService.logoutUser();
    set({ user: null, token: null, error: null });
  },

  /**
   * Clear error messages
   */
  clearError: () => set({ error: null }),

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const state = useAuthStore.getState();
    return state.token !== null;
  },

  /**
   * Check if user is admin
   */
  isAdmin: () => {
    const state = useAuthStore.getState();
    return state.user?.role === "ADMIN";
  },
}));

export default useAuthStore;
