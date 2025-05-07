import { API } from "../../utils/api";
import { useLocation } from "react-router";

import Image from "../../components/Image";

import { MoveRight } from "lucide-react";

const MessagesHeader = () => {
  const location = useLocation();
  const partner = location.state?.partner;

  return (
    <header className='messages__header'>
      <div className='messages__header__details'>
        <Image
          src={API.BASE_URL + partner.profile_picture}
          alt={partner.username.slice(0, 2)}
          placeholderColor='#212529'
        />
        <div className='messages__header__details__info'>
          <h4>{partner.username}</h4>
          {false && <div className='fc-light fs-14'>valami</div>}
        </div>

        <MoveRight className='svg-18' />
      </div>
    </header>
  );
};

export default MessagesHeader;
