import React from "react";
import ProfileSkeleton from "../ProfileSkeleton";

export default function BaseProfileLayout({ user, accountType, header, cover, info, sections }) {
  if (!user) return <ProfileSkeleton />;

  const type = accountType || user.profile_type || "open";

  return (
    <div className={`profile-card-wrapper profile-${type}`}>
      {header}
      {cover}
      {info}

      <div className="profile-sections">
        {sections}
      </div>
    </div>
  );
}
