import { QUERY_KEY } from "../../utils/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "../../hooks/profile/useProfile";
import { useUnfollow } from "../../hooks/user/useUnfollow";
import { MouseEvent } from "react";

import Modal from "../../components/Modal";
import Button from "../../components/Button";
import StateButton from "../../components/StateButton";

import { UserX } from "lucide-react";

interface UserToUnfollow {
  user_id?: number;
  following_user_id?: number;
  username?: string;
  profile_picture: string;
}

interface ConfirmUnfollowProps {
  userToUnfollow: UserToUnfollow | null;
  setUserToUnfollow: (user: UserToUnfollow | null) => void;
  isOpen: boolean;
  close: () => void;
}

const ConfirmUnfollow = ({
  userToUnfollow,
  setUserToUnfollow,
  isOpen,
  close,
}: ConfirmUnfollowProps) => {
  const { user, setUser, isOwnProfile } = useProfile();

  const queryClient = useQueryClient();

  const unfollowMutation = useUnfollow(() => {
    queryClient.invalidateQueries({
      predicate(query) {
        const key = query.queryKey[0];
        switch (key) {
          case QUERY_KEY.listFollowers:
          case QUERY_KEY.listFollowings:
            return query.queryKey[1] === user.id;
          default:
            return false;
        }
      },
      refetchType: "all",
    });

    if (isOwnProfile) {
      setUser({ followings_count: user.followings_count - 1 });
    }

    setUserToUnfollow(null);
    close();
  });

  const handleUnfollow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (unfollowMutation.isPending || !userToUnfollow) return;

    return unfollowMutation.mutateAsync(
      userToUnfollow.user_id || userToUnfollow.following_user_id
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      close={close}
      size='xsm'
      className='confirm-unfollow'>
      {userToUnfollow && (
        <>
          <div className='modal__content'>
            <div>
              <img
                src={userToUnfollow.profile_picture}
                alt={userToUnfollow.username}
              />
            </div>
            <p>
              Biztosan leállítod{" "}
              <b className='fc-blue-500'>@{userToUnfollow.username}</b>{" "}
              követését?
            </p>
          </div>
          <div className='modal__actions'>
            <Button
              className='secondary'
              text='Mégsem'
              disabled={unfollowMutation.isPending}
              onClick={close}
            />
            <StateButton
              className='secondary red'
              text='Igen, leállítom'
              onClick={handleUnfollow}>
              <UserX />
            </StateButton>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ConfirmUnfollow;
