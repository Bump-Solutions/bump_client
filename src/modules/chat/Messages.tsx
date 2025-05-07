import { API } from "../../utils/api";
import { useOutletContext } from "react-router";
import { useAuth } from "../../hooks/auth/useAuth";
import useWebSocket from "react-use-websocket";

import MessagesHeader from "./MessagesHeader";
import MessagesContent from "./MessagesContent";

interface OutletContextType {
  chat: string;
}

const Messages = () => {
  const { chat } = useOutletContext<OutletContextType>();
  const { auth } = useAuth();

  const URL = `${API.WS_BASE_URL}/chat/${chat}/`;
  const { readyState } = useWebSocket(URL, {
    queryParams: {
      token: auth?.accessToken,
    },
  });

  return (
    <div className='messages__panel'>
      <MessagesHeader />
      <div className='messages__content'>
        <MessagesContent chat={chat} />
      </div>
    </div>
  );
};

export default Messages;
