import apiClient from "./api";

/**
 * Get all sweets
 * @returns {Promise} - List of all sweets
 */
export const getAllSweets = async () => {
  const response = await apiClient.get("/sweets");
  return response.data;
};

/**
 * Get a sweet by ID
 * @param {number} id - Sweet ID
 * @returns {Promise} - Sweet details
 */
export const getSweetById = async (id) => {
  const response = await apiClient.get(`/sweets/${id}`);
  return response.data;
};

/**
 * Search sweets
 * @param {Object} params - Search parameters (name, category, minPrice, maxPrice)
 * @returns {Promise} - List of matching sweets
 */
export const searchSweets = async (params) => {
  const response = await apiClient.get("/sweets/search", { params });
  return response.data;
};

/**
 * Add a new sweet (Admin only)
 * @param {Object} sweetData - Sweet details
 * @returns {Promise} - Created sweet
 */
export const addSweet = async (sweetData) => {
  const response = await apiClient.post("/sweets", sweetData);
  return response.data;
};

/**
 * Update a sweet (Admin only)
 * @param {number} id - Sweet ID
 * @param {Object} sweetData - Updated sweet details
 * @returns {Promise} - Updated sweet
 */
export const updateSweet = async (id, sweetData) => {
  const response = await apiClient.put(`/sweets/${id}`, sweetData);
  return response.data;
};

/**
 * Delete a sweet (Admin only)
 * @param {number} id - Sweet ID
 * @returns {Promise} - Response
 */
export const deleteSweet = async (id) => {
  const response = await apiClient.delete(`/sweets/${id}`);
  return response.data;
};

/**
 * Purchase a sweet
 * @param {number} id - Sweet ID
 * @param {number} quantity - Quantity to purchase
 * @returns {Promise} - Updated sweet
 */
export const purchaseSweet = async (id, quantity) => {
  const response = await apiClient.post(`/sweets/${id}/purchase`, { quantity });
  return response.data;
};

/**
 * Restock a sweet (Admin only)
 * @param {number} id - Sweet ID
 * @param {number} quantity - Quantity to add
 * @returns {Promise} - Updated sweet
 */
export const restockSweet = async (id, quantity) => {
  const response = await apiClient.post(`/sweets/${id}/restock`, { quantity });
  return response.data;
};

export default {
  getAllSweets,
  getSweetById,
  searchSweets,
  addSweet,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};
