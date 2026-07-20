import React, { useState } from "react";
import BaseProfileLayout from "./BaseProfileLayout";
import ProfileHeader from "../ProfileHeader";
import CoverImage from "../CoverImage";
import ProfileAgeAndGender from "../ProfileAgeAndGender";
import ContactInfo from "../ContactInfo";
import AddressSection from "../AddressSection";
import SocialSection from "../SocialSection";
import ProfileAvailabilityPreview from "../ProfileAvailabilityPreview";
import SelectedLanguage from "../SelectedLanguages";
import GalleryImages from "../GalleryImages";
import CustomLinks from "../CustomLinks";
import ShareContact from "../ShareContact";
import SaveContactButton from "../saveContact/SaveContactButton";
import BusinessReviews from "../BusinessReviews";
import EventVideo from "../EventVideo";

export default function EventProfile({ user, accountType }) {
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
            birth_year={user.birth_year}
            phone={user.phone_number}
            bio={user.bio}
            showPayButton={true}
          />
        </>
      }

      sections={
        <>
          {/* Event Availability */}
          <ProfileAvailabilityPreview availability={user.availability} />

          {/* Languages */}
          <SelectedLanguage languages={user.selected_languages || []} />

          {/* Event Gallery */}
          <GalleryImages gallery_images={user.gallery_images || []} />

          {/* Share Contact */}
          <ShareContact userId={user.id} onToggle={setIsShareOpen} />

          {/* Custom Links */}
          <CustomLinks links={user.custom_links} />

          {/* Event Video */}
          <EventVideo eventVideo={user.event_video} />

          {/* Event Location */}
          <AddressSection
            address={user.address}
            lat={user.lat}
            lng={user.lng}
          />

          {/* Contact Details */}
          <ContactInfo
            phone={user.phone_number}
            email={user.email}
          />

          {/* Social Links */}
          <SocialSection socials={user.social_accounts || {}} />

          {/* Reviews */}
          <BusinessReviews reviews={user.reviews} />

          {/* Save Contact */}
          <SaveContactButton user={user} hidden={isShareOpen} />
        </>
      }
    />
  );
}