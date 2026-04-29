import React from "react";

import OpenNetworkProfile from "./OpenNetworkProfile";
import ServiceProfile from "./ServiceProfile";
import ProfessionalProfile from "./ProfessionalProfile";
import BusinessProfile from "./BusinessProfile";
import EventProfile from "./EventProfile";

export default function ProfileRenderer({ user, accountType, offers = [] }) {
  if (!user) return null;

  console.log("ProfileRenderer active, type =", user?.profile_type);

  switch (user.profile_type) {
    case "service":
      return (
        <ServiceProfile
          user={user}
          accountType={accountType}
          offers={offers}   // ✅ pass (optional use)
        />
      );

    case "professionals":
      return (
        <ProfessionalProfile
          user={user}
          accountType={accountType}
          offers={offers}
        />
      );

    case "business":
      return (
        <BusinessProfile
          user={user}
          accountType={accountType}
          offers={offers}   // 🔥 IMPORTANT
        />
      );

    case "event":
      return (
        <EventProfile
          user={user}
          accountType={accountType}
          offers={offers}
        />
      );

    default:
      return (
        <OpenNetworkProfile
          user={user}
          accountType={accountType}
          offers={offers}
        />
      );
  }
}