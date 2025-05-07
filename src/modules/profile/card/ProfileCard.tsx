import ProfileCardHeader from "./ProfileCardHeader";
import UserInfo from "./UserInfo";

const ProfileCard = () => {
  return (
    <aside className='profile__card'>
      <ProfileCardHeader />
      <UserInfo />
    </aside>
  );
};

export default ProfileCard;
