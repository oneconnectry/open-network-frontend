import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileRenderer from "../components/profiles/ProfileRenderer";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { fetchUserProfile } from "../services/profileApi";

export default function PublicProfile() {
  const { userId } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resetTimer = setTimeout(() => {
      setData(null);
      setError(null);
    }, 0);

    const fetchTimer = setTimeout(() => {
      fetchUserProfile(userId)
        .then((response) => {
          // Map accountType to profile_type
          const userWithType = {
            ...response.user,
            profile_type: response.accountType || "open", // fallback to "open"
          };
          
          setData({ ...response, user: userWithType });
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch user");
        });
    }, 500);

    return () => {
      clearTimeout(resetTimer);
      clearTimeout(fetchTimer);
    };
  }, [userId]);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <ProfileSkeleton />;

  console.log("👉 Data before render:", data);

  return <ProfileRenderer user={data.user} accountType={data.accountType} />;
}
