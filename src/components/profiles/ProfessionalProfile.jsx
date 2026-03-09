import React, { useState } from "react";
import BaseProfileLayout from "./BaseProfileLayout";

import ProfileHeader from "../ProfileHeader";
import CoverImage from "../CoverImage";
import ProfileAgeAndGender from "../ProfileAgeAndGender";
import BasicInfo from "../BasicInfo";
import SelectedLanguage from "../SelectedLanguages";
import CustomLinks from "../CustomLinks";
import Document from "../Documents";
import SocialSection from "../SocialSection";
import AddressSection from "../AddressSection";
import UPIPaymentButton from "../UPIPaymentButton";
import ContactInfo from "../ContactInfo";
import SaveContactButton from "../saveContact/SaveContactButton";
import ShareContact from "../ShareContact";
import GalleryImages from "../GalleryImages";
import ServiceExpertise from "../ServiceExpertise";
import ProfileProfessionalCard from "../ProfessionalDetails";
import ProfileAvailabilityPreview from "../ProfileAvailabilityPreview";
import ProfileServices from "../ProfileServices";

export default function ProfessionalProfile({ user, accountType }) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <BaseProfileLayout
      user={user}
      header={<ProfileHeader user={user} accountType={accountType} />}
      cover={
        <CoverImage
          url={user.cover_image}

        />
      }
      info={
        <ProfileAgeAndGender
          name={user.name}
          namelocation={user.namelocation}
          bio={user.bio}
          tagline={user.tagline}
          profileUrl={user.profile_image}
          phone={user.phone_number}     // ✅ add this
          upiId={user.upi_id}           // ✅ add this
          showPayButton={true}
        />
      }
      sections={
        <>
         <ProfileProfessionalCard
              company_name={user.company_name}
              year_of_experience={user.year_of_experience}
              selected_skills={user.selected_skills}
              selected_certifications={user.selected_certifications}
            />
          <SelectedLanguage languages={user.selected_languages || []} />

          <ProfileAvailabilityPreview
            availability={user.availability}
          />

          <Document documents={user.documents || []} />

          <ProfileServices services={user.services} />

          <GalleryImages gallery_images={user.gallery_images || []} />


           <ShareContact userId={user.id} onToggle={setIsShareOpen} />
          
          <CustomLinks links={user.custom_links} />
          <AddressSection address={user.address} lat={user.lat} lng={user.lng} />
          

          <ContactInfo phone={user.phone_number} email={user.email}/>

          <SocialSection socials={user.social_accounts || {}} />
          <SaveContactButton user={user} hidden={isShareOpen} />
        </>
      }
    />
  );
}
