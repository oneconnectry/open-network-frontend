import { useState } from "react";

export default function useSendVisitorMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendMessage = async ({
    profileUserId,
    visitorName,
    visitorPhone,
    visitorEmail,
    message,
    photo,
  }) => {
    if (!profileUserId || !message) {
      setError("Profile ID and message are required");
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("profile_user_id", profileUserId);
    formData.append("visitor_name", visitorName || "");
    formData.append("visitor_phone", visitorPhone || "");
    formData.append("visitor_email", visitorEmail || "");
    formData.append("message", message);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch("http://10.89.147.22:5000/api/vist/visitor/message", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send message");
      }

      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message || "Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading,
    error,
    success,
  };
}