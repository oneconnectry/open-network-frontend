// src/services/profileApi.js

import { API_BASE_URL } from "./apiConfig";

/**
 * Fetch public profile data from API
 * @param {string} userId
 * @returns {Promise<Object>} profile data
 */
export async function fetchUserProfile(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/profile/${userId}`);
    if (!response.ok) {
      throw new Error("Profile not found");
    }
    const data = await response.json();
    return data; // { user: {...}, showLargeCard: true/false }
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}
