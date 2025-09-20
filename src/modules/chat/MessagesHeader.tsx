import { ROUTES } from "../../routes/routes";
import { UserModel } from "../../models/userModel";
import { Link, useLocation } from "react-router";
import { useMediaQuery } from "react-responsive";

import Image from "../../components/Image";

import { ArrowLeft, MoveRight } from "lucide-react";

const MessagesHeader = () => {
  const location = useLocation();
  const partner = location.state?.partner as UserModel;

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
          src={partner.profilePicture || ""}
          alt={partner.username.slice(0, 2)}
          placeholderColor='#212529'
        />
        <div className='messages__header__details__info'>
          <h4>{partner.username}</h4>
          {false && <div className='fc-gray-600 fs-14'>valami</div>}
        </div>

        <MoveRight />
      </div>
    </header>
  );
};

export default MessagesHeader;
