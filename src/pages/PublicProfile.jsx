import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileRenderer from "../components/profiles/ProfileRenderer";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { fetchUserProfile } from "../services/profileApi";

export default function PublicProfile() {
  const { userId } = useParams();

  const [data, setData] = useState(null);
  const [offers, setOffers] = useState([]); // ✅ NEW
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(null);
        setError(null);
        setOffers([]);

        const response = await fetchUserProfile(userId);

        // ✅ profile mapping
        const userWithType = {
          ...response.user,
          profile_type: response.accountType || "open",
        };

        setData({ ...response, user: userWithType });

        // 🔥 IMPORTANT: use offers from response
        const filteredOffers = (response.offers || [])
          .filter((o) => o.is_active)
          .slice(0, 5);

        setOffers(filteredOffers);

      } catch (err) {
        setError(err.message || "Failed to fetch user");
      }
    };

    fetchData();
  }, [userId]);

  // ❌ Error
  if (error) return <div>Error: {error}</div>;

  // ⏳ Loading
  if (!data) return <ProfileSkeleton />;

  console.log("👉 Profile:", data);

  return (
    <ProfileRenderer
      user={data.user}
      accountType={data.accountType}
      offers={offers}   // 🔥 PASS HERE
    />
  );
}