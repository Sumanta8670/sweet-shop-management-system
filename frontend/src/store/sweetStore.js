import { create } from "zustand";
import sweetService from "../services/sweetService";

/**
 * Zustand store for sweet management state
 */
const useSweetStore = create((set, get) => ({
  sweets: [],
  selectedSweet: null,
  isLoading: false,
  error: null,

  /**
   * Fetch all sweets
   */
  fetchSweets: async () => {
    set({ isLoading: true, error: null });
    try {
      const sweets = await sweetService.getAllSweets();
      set({ sweets, isLoading: false });
      return sweets;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch sweets";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Search sweets
   */
  searchSweets: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const sweets = await sweetService.searchSweets(params);
      set({ sweets, isLoading: false });
      return sweets;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Search failed";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Get sweet by ID
   */
  getSweetById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const sweet = await sweetService.getSweetById(id);
      set({ selectedSweet: sweet, isLoading: false });
      return sweet;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch sweet";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Add a new sweet (Admin only)
   */
  addSweet: async (sweetData) => {
    set({ isLoading: true, error: null });
    try {
      const newSweet = await sweetService.addSweet(sweetData);
      const sweets = [...get().sweets, newSweet];
      set({ sweets, isLoading: false });
      return newSweet;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to add sweet";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Update a sweet (Admin only)
   */
  updateSweet: async (id, sweetData) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await sweetService.updateSweet(id, sweetData);
      const sweets = get().sweets.map((s) => (s.id === id ? updated : s));
      set({ sweets, isLoading: false });
      return updated;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to update sweet";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Delete a sweet (Admin only)
   */
  deleteSweet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await sweetService.deleteSweet(id);
      const sweets = get().sweets.filter((s) => s.id !== id);
      set({ sweets, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete sweet";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Purchase a sweet
   */
  purchaseSweet: async (id, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await sweetService.purchaseSweet(id, quantity);
      const sweets = get().sweets.map((s) => (s.id === id ? updated : s));
      set({ sweets, isLoading: false });
      return updated;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to purchase sweet";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Restock a sweet (Admin only)
   */
  restockSweet: async (id, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await sweetService.restockSweet(id, quantity);
      const sweets = get().sweets.map((s) => (s.id === id ? updated : s));
      set({ sweets, isLoading: false });
      return updated;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to restock sweet";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Clear error messages
   */
  clearError: () => set({ error: null }),
}));

export default useSweetStore;
