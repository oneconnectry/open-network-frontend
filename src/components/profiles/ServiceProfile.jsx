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
import ServiceExpertise from "../ServiceExpertise";
import CallChatButtons from "../CallChatButtons";
import GalleryImages from "../GalleryImages";
import ServicesOffered from "../ServicesOffered";
import ProfileAvailabilityPreview from "../ProfileAvailabilityPreview";




export default function ServiceProfile({ user, accountType }) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <BaseProfileLayout
      user={user}
      header={<ProfileHeader user={user} accountType={accountType} />}
      cover={
        <CoverImage
          url={user.cover_image}
          gender={user.gender}
          birthYear={Number(user.birth_year)}
        />
      }
      info={
        <ProfileAgeAndGender
          name={user.name}
          namelocation={user.namelocation}
          bio={user.bio}
          profileUrl={user.profile_image}
        />
      }
      sections={
        <>
        
          <BasicInfo statusType={user.status_type} fillOne={user.fillone} fillTwo={user.filltwo} />
          <ServiceExpertise selected_skills={user.selected_skills || []} year_of_experience={user.year_of_experience}/>
          <CallChatButtons phone={user.phone_number} />
          <SelectedLanguage languages={user.selected_languages || []} />
          <ProfileAvailabilityPreview availability={user.availability} />
          <GalleryImages images={user.gallery_images || []} />
          <Document documents={user.documents || []} />
          <ServicesOffered services={user.services || []} />
          
          <UPIPaymentButton upiId={user.upi_id} />
          <AddressSection address={user.address} lat={user.lat} lng={user.lng} />
          <ContactInfo phone={user.phone_number} email={user.email} emergency={user.emergency_number} />
          <CustomLinks links={user.custom_links} />
          <SocialSection socials={user.social_accounts || {}} />


          <ShareContact userId={user.id} onToggle={setIsShareOpen} />
    
  
          <SaveContactButton user={user} hidden={isShareOpen} />
        </>
      }
    />
  );
}
