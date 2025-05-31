import { FormEvent } from "react";
import { useNavigate } from "react-router";
import { useProfile } from "../../../hooks/profile/useProfile";
import { useFollow } from "../../../hooks/user/useFollow";
import { useUnfollow } from "../../../hooks/user/useUnfollow";

import Button from "../../../components/Button";

import { UserPlus, Bell, Mail, UserX } from "lucide-react";
import { ROUTES } from "../../../routes/routes";
import { useCreateChatGroup } from "../../../hooks/chat/useCreateChatGroup";

const UserInteractions = () => {
  const navigate = useNavigate();
  const { user, setUser } = useProfile();

  const followMutation = useFollow((response) => {
    setUser({
      ...user,
      following: true,
      followers_count: user?.followers_count! + 1,
    });
  });

  const unfollowMutation = useUnfollow((response) => {
    setUser({
      ...user,
      following: false,
      followers_count: user?.followers_count! - 1,
    });
  });

  const createChatGroupMutation = useCreateChatGroup((response) => {
    navigate(ROUTES.INBOX.CHAT(response.data.message), {
      state: {
        partner: {
          id: user?.id,
          username: user?.username,
          profile_picture: user?.profile_picture,
        },
      },
    });
  });

  const handleFollow = (e: FormEvent) => {
    e.preventDefault();

    if (followMutation.isPending) return;

    followMutation.mutateAsync(user?.id!);
  };

  const handleUnfollow = (e: FormEvent) => {
    e.preventDefault();

    if (unfollowMutation.isPending) return;

    unfollowMutation.mutateAsync(user?.id!);
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();

    if (user?.chat_name) {
      navigate(ROUTES.INBOX.CHAT(user.chat_name), {
        state: {
          partner: {
            id: user.id,
            username: user.username,
            profile_picture: user.profile_picture,
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
        <Button className='secondary'>
          <Bell />
        </Button>
      </div>

      <div className='user__interaction--follow'>
        {user && user.following ? (
          <Button
            className='secondary red'
            text='Követés leállítása'
            onClick={(e) => handleUnfollow(e)}
            loading={unfollowMutation.isPending}>
            <UserX />
          </Button>
        ) : (
          <Button
            className='primary'
            text='Követés'
            onClick={(e) => handleFollow(e)}
            loading={followMutation.isPending}>
            <UserPlus />
          </Button>
        )}
      </div>

      <div className='user__interaction--message'>
        <Button
          className='secondary blue'
          text='Üzenet'
          onClick={(e) => handleSendMessage(e)}
          loading={createChatGroupMutation.isPending}>
          <Mail />
        </Button>
      </div>
    </div>
  );
};

export default UserInteractions;
