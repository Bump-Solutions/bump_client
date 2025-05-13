import { API } from "../../utils/api";
import { ROUTES } from "../../routes/routes";
import { Link, useLocation } from "react-router";
import { useMediaQuery } from "react-responsive";

import Image from "../../components/Image";

import { ArrowLeft, MoveRight } from "lucide-react";

const MessagesHeader = () => {
  const location = useLocation();
  const partner = location.state?.partner;

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  return (
    <header className='messages__header'>
      <div className='messages__header__details'>
        {isMobile && (
          <Link
            to={ROUTES.INBOX.ROOT}
            className='messages__header__details__back'>
            <ArrowLeft />
          </Link>
        )}
        <Image
          src={API.BASE_URL + partner.profile_picture}
          alt={partner.username.slice(0, 2)}
          placeholderColor='#212529'
        />
        <div className='messages__header__details__info'>
          <h4>{partner.username}</h4>
          {false && <div className='fc-light fs-14'>valami</div>}
        </div>

        <MoveRight />
      </div>
    </header>
  );
};

export default MessagesHeader;
