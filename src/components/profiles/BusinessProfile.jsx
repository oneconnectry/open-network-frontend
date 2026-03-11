import React, { useState } from "react";
import BaseProfileLayout from "./BaseProfileLayout";
import ProfileHeader from "../ProfileHeader";
import CoverImage from "../CoverImage";
import ProfileAgeAndGender from "../ProfileAgeAndGender";
import ContactInfo from "../ContactInfo";
import AddressSection from "../AddressSection";
import SocialSection from "../SocialSection";
import ProfileProfessionalCard from "../ProfessionalDetails";
import ProfileAvailabilityPreview from "../ProfileAvailabilityPreview";
import SelectedLanguage from "../SelectedLanguages";
import GalleryImages from "../GalleryImages";
import CustomLinks from "../CustomLinks";
import ShareContact from "../ShareContact";
import SaveContactButton from "../saveContact/SaveContactButton";




export default function BusinessProfile({ user, accountType }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  return (
    <BaseProfileLayout
      user={user}
      header={<ProfileHeader user={user} accountType={accountType} />}
      cover={<CoverImage url={user.cover_image} />}
      info={
         <>
          <ProfileAgeAndGender
            name={user.name}
            tagline={user.tagline}
            namelocation={user.namelocation}
  
            profileUrl={user.profile_image}
            selected_skills={user.selected_skills}
            birth_year={user.birth_year}
            phone={user.phone_number}     // ✅ add this
            upiId={user.upi_id}  
            bio={user.bio}         // ✅ add this
            showPayButton={true}

          />
          
        </>
        
        
      }
      sections={
        <>
          <ProfileAvailabilityPreview availability={user.availability} />
          <SelectedLanguage languages={user.selected_languages || []} />
          <GalleryImages gallery_images={user.gallery_images || []} />
           <ShareContact userId={user.id} onToggle={setIsShareOpen} />
          <CustomLinks links={user.custom_links} />
          <AddressSection address={user.address} lat={user.lat} lng={user.lng} />


          <ContactInfo phone={user.phone_number} email={user.email} />
          <SocialSection socials={user.social_accounts || {}} />
          <SaveContactButton user={user} hidden={isShareOpen} />
        </>
      }
    />
  );
}
