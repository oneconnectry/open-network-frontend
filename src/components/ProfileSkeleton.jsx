import React from "react";

export default function ProfileSkeleton({ type = "default" }) {
  return (
    <div className={`profile-card-wrapper profile-${type}`}>
      <div className="skeleton-cover shimmer"></div>

      <div className="skeleton-header">
        <div className="skeleton-avatar shimmer"></div>
        <div className="skeleton-lines">
          <div className="skeleton-line shimmer"></div>
          <div className="skeleton-line short shimmer"></div>
        </div>
      </div>

      {[1,2,3,4,5].map(i => (
        <div key={i} className="skeleton-card shimmer"></div>
      ))}
    </div>
  );
}
