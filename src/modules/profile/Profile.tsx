import "../../assets/css/profile.css";

import { useNavbarTheme } from "../../hooks/useNavbarTheme";
import { useProfile } from "../../hooks/profile/useProfile";
import { Outlet } from "react-router";

import Spinner from "../../components/Spinner";
import ProfileBanner from "./ProfileBanner";
import ProfileCard from "./card/ProfileCard";
import ProfileTabs from "./ProfileTabs";

const Profile = () => {
  const { isLoading, isError } = useProfile();

  if (isError) return null;

  useNavbarTheme(isLoading || isError ? true : false);

  return isLoading ? (
    <Spinner />
  ) : (
    <section className='profile'>
      <ProfileBanner />
      <div className='profile__wrapper'>
        <ProfileCard />
        <div className='profile__content'>
          <ProfileTabs />
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Profile;
