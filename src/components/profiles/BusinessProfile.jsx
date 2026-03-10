import React from "react";
import BaseProfileLayout from "./BaseProfileLayout";
import ProfileHeader from "../ProfileHeader";
import CoverImage from "../CoverImage";
import ProfileAgeAndGender from "../ProfileAgeAndGender";
import ContactInfo from "../ContactInfo";
import AddressSection from "../AddressSection";
import SocialSection from "../SocialSection";
import ProfileProfessionalCard from "../ProfessionalDetails";

export default function BusinessProfile({ user }) {
  return (
    <BaseProfileLayout
      user={user}
      header={<ProfileHeader user={user} accountType="business" />}
      cover={<CoverImage url={user.cover_image} />}
      info={
         <>
          <ProfileAgeAndGender
            name={user.name}
            tagline={user.tagline}
            namelocation={user.namelocation}
            bio={user.bio}
            profileUrl={user.profile_image}
          />

          {/* Under tagline */}
          {user.selected_skills?.length > 0 && (
            <ProfileProfessionalCard
              selected_skills={user.selected_skills}
              // company_name={user.company_name}
              // year_of_experience={user.year_of_experience}
              // selected_certifications={user.selected_certifications}
            />
          )}
        </>
        
        
      }
      sections={
        <>
          <ContactInfo phone={user.phone_number} email={user.email} />
          <AddressSection address={user.address} lat={user.lat} lng={user.lng} />
          <SocialSection socials={user.social_accounts || {}} />
        </>
      }
    />
  );
}
