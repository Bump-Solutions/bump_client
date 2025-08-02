import { MouseEvent } from "react";
import { ROUTES } from "../../../routes/routes";
import { QUERY_KEY } from "../../../utils/queryKeys";
import { useCreateChatGroup } from "../../../hooks/chat/useCreateChatGroup";
import { useNavigate } from "react-router";
import { useProfile } from "../../../hooks/profile/useProfile";
import { useFollow } from "../../../hooks/user/useFollow";
import { useUnfollow } from "../../../hooks/user/useUnfollow";
import { useQueryClient } from "@tanstack/react-query";

import Button from "../../../components/Button";

import { UserPlus, Bell, Mail, UserX } from "lucide-react";
import Tooltip from "../../../components/Tooltip";

const UserInteractions = () => {
  const navigate = useNavigate();
  const { user, setUser } = useProfile();

  const queryClient = useQueryClient();

  const followMutation = useFollow((response) => {
    setUser({
      ...user,
      following: true,
      followersCount: user?.followersCount! + 1,
    });

    // Ha bekövetünk valakit, akkor az összes listFollowers és listFollowings-et frissiteni kell
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.listFollowers],
      exact: false,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.listFollowings],
      exact: false,
      refetchType: "all",
    });
  });

  const unfollowMutation = useUnfollow((response) => {
    setUser({
      ...user,
      following: false,
      followersCount: user?.followersCount! - 1,
    });

    // Ha kikövetünk valakit, akkor az összes listFollowers és listFollowings-et frissiteni kell
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.listFollowers],
      exact: false,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.listFollowings],
      exact: false,
      refetchType: "all",
    });
  });

  const createChatGroupMutation = useCreateChatGroup((response) => {
    navigate(ROUTES.INBOX.CHAT(response.data.message), {
      state: {
        partner: {
          id: user?.id,
          username: user?.username,
          profilePicture: user?.profilePicture,
        },
      },
    });
  });

  const handleFollow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (followMutation.isPending) return;

    return followMutation.mutateAsync(user?.id!);
  };

  const handleUnfollow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (unfollowMutation.isPending) return;

    return unfollowMutation.mutateAsync(user?.id!);
  };

  const handleSendMessage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (user?.chatName) {
      navigate(ROUTES.INBOX.CHAT(user.chatName), {
        state: {
          partner: {
            id: user.id,
            username: user.username,
            profilePicture: user.profilePicture,
          },
        },
      });
    } else {
      if (createChatGroupMutation.isPending) return;

      createChatGroupMutation.mutateAsync(user?.id!);
    }
  };

  return (
    <div className='user__interactions '>
      {/* IF FOLLOWING DISPLAY TOOLTIP */}
      <div className='user__interaction--tooltip'>
        <Tooltip content='Értesíts' showDelay={750} placement='top'>
          <Button className='secondary'>
            <Bell />
          </Button>
        </Tooltip>
      </div>

      <div className='user__interaction--follow'>
        {user && user.following ? (
          <Button
            className='secondary red'
            text='Követés leállítása'
            onClick={handleUnfollow}
            loading={unfollowMutation.isPending}>
            <UserX />
          </Button>
        ) : (
          <Button
            className='primary'
            text='Követés'
            onClick={handleFollow}
            loading={followMutation.isPending}>
            <UserPlus />
          </Button>
        )}
      </div>

      <div className='user__interaction--message'>
        <Button
          className='secondary blue'
          text='Üzenet'
          onClick={handleSendMessage}
          loading={createChatGroupMutation.isPending}>
          <Mail />
        </Button>
      </div>
    </div>
  );
};

export default UserInteractions;
