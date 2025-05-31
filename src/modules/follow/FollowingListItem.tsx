import { Link, useOutletContext } from "react-router";
import { ROUTES } from "../../routes/routes";
import { QUERY_KEY } from "../../utils/queryKeys";
import { MouseEvent } from "react";
import { useFollow } from "../../hooks/user/useFollow";
import { Following, FollowingsPage } from "../../types/user";
import { useAuth } from "../../hooks/auth/useAuth";
import { useProfile } from "../../hooks/profile/useProfile";
import { useQueryClient } from "@tanstack/react-query";

import Image from "../../components/Image";
import Button from "../../components/Button";

interface FollowingListItemProps {
  following: Following;
}

interface OutletContextType {
  toggleConfirmUnfollow: () => void;
  setUserToUnfollow: (user: Following) => void;
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
          pages: prev.pages.map((page: FollowingsPage) => {
            return {
              ...page,
              followings: page.followings.map((following: Following) => {
                if (following.following_user_id === followingId) {
                  return {
                    ...following,
                    my_following: true,
                  };
                }
                return following;
              }),
            };
          }),
        };
      }
    );
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
          src={following.profile_picture}
          alt={following.username?.slice(0, 2)}
        />

        <div className='user__text'>
          <Link
            to={ROUTES.PROFILE(following.username!).ROOT}
            className='username fs-18 link black'>
            {following.username}
          </Link>
          <p className='fc-light fs-14 truncate'>{following.role}</p>
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
                {following.my_following ? (
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
                    onClick={(e) =>
                      handleFollow(e, following.following_user_id)
                    }
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
