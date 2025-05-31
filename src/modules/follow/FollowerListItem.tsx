import { ROUTES } from "../../routes/routes";
import { QUERY_KEY } from "../../utils/queryKeys";
import { Follower, FollowersPage } from "../../types/user";
import { Link, useOutletContext } from "react-router";
import { useProfile } from "../../hooks/profile/useProfile";
import { useFollow } from "../../hooks/user/useFollow";
import { useDeleteFollower } from "../../hooks/user/useDeleteFollower";
import { useAuth } from "../../hooks/auth/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { MouseEvent } from "react";

import Image from "../../components/Image";
import Button from "../../components/Button";

interface FollowerListItemProps {
  follower: Follower;
}

interface OutletContextType {
  toggleConfirmUnfollow: () => void;
  setUserToUnfollow: (user: Follower) => void;
}

const FollowerListItem = ({ follower }: FollowerListItemProps) => {
  const { auth } = useAuth();
  const { user, setUser, isOwnProfile } = useProfile();

  const queryClient = useQueryClient();

  const { toggleConfirmUnfollow, setUserToUnfollow } =
    useOutletContext<OutletContextType>();

  const followMutation = useFollow((response, followerId: number) => {
    // Frissítjük a user-hez tartozó követők listáját
    queryClient.setQueriesData(
      {
        queryKey: [QUERY_KEY.listFollowers, user?.id],
        exact: false,
      },
      (prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page: FollowersPage) => {
            return {
              ...page,
              followers: page.followers.map((follower: Follower) => {
                if (follower.user_id === followerId) {
                  return {
                    ...follower,
                    my_following: true,
                  };
                }
                return follower;
              }),
            };
          }),
        };
      }
    );

    // Frissítjük a követők számlálóját, ha sa saját profil oldal
    if (isOwnProfile) {
      setUser({
        ...user,
        followers_count: user?.followers_count! + 1,
      });
    }
  });

  const deleteFollowerMutation = useDeleteFollower(
    (response, followerId: number) => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEY.listFollowers, user!.id],
          exact: false,
        },
        (prev: any) => {
          if (!prev) return prev;

          return {
            ...prev,
            pages: prev.pages.map((page: FollowersPage) => {
              return {
                ...page,
                followers: page.followers.filter(
                  (follower: Follower) => follower.user_id !== followerId
                ),
              };
            }),
          };
        }
      );

      // Ez mindig csak a saját profil oldalon történik
      setUser({
        ...user,
        followers_count: user?.followers_count! - 1,
      });
    }
  );

  const handleFollow = (
    e: MouseEvent<HTMLSpanElement | HTMLButtonElement>,
    followerId: number
  ) => {
    e.preventDefault();

    if (followMutation.isPending) return;

    followMutation.mutateAsync(followerId);
  };

  const handleDeleteFollower = (
    e: MouseEvent<HTMLButtonElement>,
    followerId: number
  ) => {
    e.preventDefault();

    if (deleteFollowerMutation.isPending) return;

    deleteFollowerMutation.mutateAsync(followerId);
  };

  return (
    <li className='user__list-item'>
      <div className='item__user-info'>
        <Image
          src={follower.profile_picture}
          alt={follower.username?.slice(0, 2)}
        />

        <div className='user__text'>
          <Link
            to={ROUTES.PROFILE(follower.username!).ROOT}
            className='username fs-18 link black'>
            {follower.username}
          </Link>

          {/* Ha a session user a sajat oldalan van, es nem koveti */}
          {isOwnProfile && !follower.my_following && (
            <span
              onClick={(e) => handleFollow(e, follower.user_id)}
              className='link fs-15 ml-0_5'>
              Követés
            </span>
          )}

          <p className='fc-light fs-14 truncate'>{follower.role}</p>
        </div>

        {/* Gomb: ha saját profilon vagyunk, Eltávolítás */}
        {isOwnProfile ? (
          <Button
            className='secondary red'
            text='Eltávolítás'
            onClick={(e) => handleDeleteFollower(e, follower.user_id)}
            loading={deleteFollowerMutation.isPending}
          />
        ) : (
          <>
            {/* Ha nem saját oldalon vagyunk, magunkat nem vesszük figyelembe */}
            {auth?.user?.username !== follower.username && (
              <>
                {/* Egyébként gomb státusz alapján: már követjük? */}
                {follower.my_following ? (
                  <Button
                    className='primary'
                    text='Követed'
                    onClick={(e) => {
                      e.preventDefault();
                      setUserToUnfollow(follower);
                      toggleConfirmUnfollow();
                    }}
                  />
                ) : (
                  <Button
                    className='secondary blue'
                    text='Követés'
                    onClick={(e) => handleFollow(e, follower.user_id)}
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

export default FollowerListItem;
