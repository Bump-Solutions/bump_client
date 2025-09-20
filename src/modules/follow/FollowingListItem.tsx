import { Link, useOutletContext } from "react-router";
import { ROUTES } from "../../routes/routes";
import { QUERY_KEY } from "../../utils/queryKeys";
import { MouseEvent } from "react";
import { useFollow } from "../../hooks/user/useFollow";
import { FollowingModel, FollowingsPageModel } from "../../models/userModel";
import { useAuth } from "../../hooks/auth/useAuth";
import { useProfile } from "../../hooks/profile/useProfile";
import { useQueryClient } from "@tanstack/react-query";

import Image from "../../components/Image";
import Button from "../../components/Button";

interface FollowingListItemProps {
  following: FollowingModel;
}

interface OutletContextType {
  toggleConfirmUnfollow: () => void;
  setUserToUnfollow: (user: FollowingModel) => void;
}

const FollowingListItem = ({ following }: FollowingListItemProps) => {
  const { auth } = useAuth();
  const { user, setUser, isOwnProfile } = useProfile();

  const queryClient = useQueryClient();

  const { toggleConfirmUnfollow, setUserToUnfollow } =
    useOutletContext<OutletContextType>();

  const followMutation = useFollow((response, followingId: number) => {
    // Frissítjük a user-hez tartozó követők listáját
    queryClient.setQueriesData(
      {
        queryKey: [QUERY_KEY.listFollowings, user!.id],
        exact: false,
      },
      (prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page: FollowingsPageModel) => {
            return {
              ...page,
              followings: page.followings.map((following: FollowingModel) => {
                if (following.userId === followingId) {
                  return {
                    ...following,
                    myFollowing: true,
                  };
                }
                return following;
              }),
            };
          }),
        };
      }
    );

    // A bekövetett user követőinek frissítése, hogy a session user megjelenjen
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.listFollowers, followingId],
      exact: false,
      refetchType: "all",
    });

    // Frissítjük a saját követéseket
    if (isOwnProfile) {
      setUser({
        ...user,
        followingsCount: user?.followingsCount! + 1,
      });
    }

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.listFollowings, auth?.user?.id],
      exact: false,
      refetchType: "all",
    });
  });

  const handleFollow = (
    e: MouseEvent<HTMLButtonElement>,
    followingId: number
  ) => {
    e.preventDefault();

    if (followMutation.isPending) return;

    followMutation.mutateAsync(followingId);
  };

  return (
    <li className='user__list-item'>
      <div className='item__user-info'>
        <Image
          src={following.profilePicture ?? ""}
          alt={following.username?.slice(0, 2)}
        />

        <div className='user__text'>
          <Link
            to={ROUTES.PROFILE(following.username!).ROOT}
            className='username fs-18 link black'>
            {following.username}
          </Link>
          <p className='fc-gray-600 fs-14 truncate'>{following.role}</p>
        </div>

        {isOwnProfile ? (
          <Button
            className='primary'
            text='Követed'
            onClick={(e) => {
              e.preventDefault();
              setUserToUnfollow(following);
              toggleConfirmUnfollow();
            }}
          />
        ) : (
          <>
            {/* Ha nem saját oldalon vagyunk, magunkat nem vesszük figyelembe */}
            {auth?.user?.username !== following.username && (
              <>
                {/* Egyébként gomb státusz alapján: már követjük? */}
                {following.myFollowing ? (
                  <Button
                    className='primary'
                    text='Követed'
                    onClick={(e) => {
                      e.preventDefault();
                      setUserToUnfollow(following);
                      toggleConfirmUnfollow();
                    }}
                  />
                ) : (
                  <Button
                    className='secondary blue'
                    text='Követés'
                    onClick={(e) => handleFollow(e, following.userId)}
                    loading={followMutation.isPending}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </li>
  );
};

export default FollowingListItem;
