// src/services/profileApi.js

import { API_BASE_URL } from "./apiConfig";

/**
 * 🔹 Generic fetch helper (clean + reusable)
 */
async function fetchJSON(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text(); // useful for debugging
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error("❌ API Error:", err.message);
    throw err;
  }
}

/**
 * 🔹 Fetch public profile or event
 */
export async function fetchUserProfile(userId) {
  try {
    // 👉 Event profile
    if (userId === "testing") {
      const data = await fetchJSON(
        `${API_BASE_URL}/api/events/public/${userId}`
      );

      return {
        user: {
          ...data.event,
          profile_type: "event",
        },
        accountType: "event",
      };
    }

    // 👉 Normal profile
    const data = await fetchJSON(
      `${API_BASE_URL}/api/discover/public/profile/${userId}`
    );

    return data;

  } catch (error) {
    console.error("❌ Profile fetch failed:", error.message);
    throw error;
  }
}

/**
 * 🔥 Fetch offers for ANY profile
 */
export async function fetchUserOffers(userId) {
  try {
    const data = await fetchJSON(
      `${API_BASE_URL}/api/offers/${userId}`
    );

    console.log("🔥 Offers API response:", data);

    // ✅ Always return array
    if (!Array.isArray(data)) return [];

    // ✅ Filter active + limit
    return data
      .filter((o) => o.is_active)
      .slice(0, 5);

  } catch (error) {
    console.error("❌ Offers fetch failed:", error.message);

    // 🚨 IMPORTANT: don't break UI
    return [];
  }
}