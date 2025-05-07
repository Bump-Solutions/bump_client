import { API } from "../../../utils/api";
import { useProfile } from "../../../hooks/profile/useProfile";

import UserDetails from "./UserDetails";
import Image from "../../../components/Image";

const ProfileCardHeader = () => {
  const { user } = useProfile();

  return (
    <div className='profile__card__header'>
      <div className='avatar__wrapper'>
        <Image
          src={API.BASE_URL + user?.profile_picture}
          alt={user?.username.slice(0, 2)}
          placeholderColor='#212529'
        />
      </div>

      <h1>{user?.username}</h1>

      {/* TODO: BADGES, BIO, ETC */}

      <UserDetails />
    </div>
  );
};

export default ProfileCardHeader;
