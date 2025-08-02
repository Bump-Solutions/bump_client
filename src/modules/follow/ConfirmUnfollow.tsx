import { QUERY_KEY } from "../../utils/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "../../hooks/profile/useProfile";
import { useUnfollow } from "../../hooks/user/useUnfollow";
import { Dispatch, MouseEvent, SetStateAction } from "react";
import { FollowerModel, FollowingModel } from "../../models/userModel";
import { toast } from "sonner";

import Modal from "../../components/Modal";
import Button from "../../components/Button";
import StateButton from "../../components/StateButton";
import Image from "../../components/Image";

import { UserX } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";

interface ConfirmUnfollowProps {
  userToUnfollow: FollowerModel | FollowingModel | null;
  setUserToUnfollow: Dispatch<
    SetStateAction<FollowerModel | FollowingModel | null>
  >;
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
    // Adott felhasználó (user) követői és követései listáját frissítjük
    queryClient.invalidateQueries({
      predicate(query) {
        const key = query.queryKey[0];
        switch (key) {
          case QUERY_KEY.listFollowers:
          case QUERY_KEY.listFollowings:
            return query.queryKey[1] === user?.id;
          default:
            return false;
        }
      },
      refetchType: "all",
    });

    // A kikövetett felhasználó követőinek listáját is frissítjük
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.listFollowers, userToUnfollow?.userId],
      exact: false,
      refetchType: "all",
    });

    if (isOwnProfile) {
      setUser({ followingsCount: user?.followingsCount! - 1 });
    }

    setUserToUnfollow(null);
    close();
  });

  const handleUnfollow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (unfollowMutation.isPending || !userToUnfollow) return;

    const unfollowPromise = unfollowMutation.mutateAsync(userToUnfollow.userId);

    toast.promise(unfollowPromise, {
      loading: "Követés leállítása folyamatban...",
      success: () => (
        <span>
          <Link
            target='_blank'
            className='link fc-green-600 underline fw-700'
            to={
              ROUTES.PROFILE(userToUnfollow.username).ROOT
            }>{`@${userToUnfollow.username}`}</Link>{" "}
          követése leállítva.
        </span>
      ),
      error: (err) =>
        (err?.response?.data?.message as string) ||
        "Hiba a követés leállítása közben.",
    });

    return unfollowPromise;
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
              <Image
                src={userToUnfollow.profilePicture || ""}
                alt={userToUnfollow.username!}
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
