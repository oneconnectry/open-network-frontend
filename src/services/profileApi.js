// src/services/profileApi.js



/**
 * Fetch public profile data from API
 * @param {string} userId
 * @returns {Promise<Object>} profile data
 */
export async function fetchUserProfile(userId) {
  try {
    const response = await fetch(`http://192.168.1.4:5000/api/public/profile/${userId}`);
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
