import "../../assets/css/chat.css";
import { ENUM } from "../../utils/enum";
import { useTitle } from "react-use";
import { Outlet, useParams } from "react-router";
import { useMediaQuery } from "react-responsive";

import Inbox from "./Inbox";

import { MessageSquareDashed } from "lucide-react";

const Chat = () => {
  useTitle(`Üzenetek - ${ENUM.BRAND.NAME}`);

  const { chat } = useParams();

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  if (isMobile) {
    return (
      <section className='chat'>
        {chat ? <Outlet context={{ chat }} /> : <Inbox />}
      </section>
    );
  }

  return (
    <>
      <div className='border' />
      <section className='chat'>
        <Inbox />
        {chat ? (
          <Outlet key={chat} context={{ chat }} />
        ) : (
          <div className='messages__panel no-selection'>
            <MessageSquareDashed className='svg-40' />
            <div className='ta-center'>
              <h4 className='fw-600 mb-0_25 fs-18'>Nincs kiválasztva chat</h4>
              <p className='fc-light fs-16'>
                Válassz az üzeneteid közül vagy indíts új beszélgetést.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Chat;
