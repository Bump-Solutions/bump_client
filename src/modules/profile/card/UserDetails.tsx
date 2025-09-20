import { useProfile } from "../../../hooks/profile/useProfile";

import UserInteractionsOwn from "./UserInteractionsOwn";
import UserInteractions from "./UserInteractions";

import { MapPin } from "lucide-react";

const UserDetails = () => {
  const { isOwnProfile } = useProfile();

  return (
    <div className='user__details__wrapper'>
      <div className='user__details'>
        <p className='fc-gray-700 fs-15'>CONTRIBUTOR</p>

        <p className='fc-gray-700 fs-15 my-1'>
          <MapPin className='va-middle' /> Szentes, Magyarország
        </p>
      </div>

      {isOwnProfile ? <UserInteractionsOwn /> : <UserInteractions />}
    </div>
  );
};

export default UserDetails;
