import React from "react";

import OpenNetworkProfile from "./OpenNetworkProfile";
import ServiceProfile from "./ServiceProfile";
import ProfessionalProfile from "./ProfessionalProfile";
import BusinessProfile from "./BusinessProfile";


export default function ProfileRenderer({ user, accountType }) {
  if (!user) return null;
  console.log("ProfileRenderer active, type =", user?.profile_type);


  switch (user.profile_type) {
    case "service":
      return <ServiceProfile user={user} accountType={accountType} />;

    case "professionals":
      return <ProfessionalProfile user={user} accountType={accountType} />;

    case "business":
      return <BusinessProfile user={user} accountType={accountType} />;

    default:
      return <OpenNetworkProfile user={user} accountType={accountType} />;
  }
  
}
