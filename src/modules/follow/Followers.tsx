import { QUERY_KEY } from "../../utils/queryKeys";
import { ROUTES } from "../../routes/routes";
import { User } from "../../types/user";
import { useProfile } from "../../hooks/profile/useProfile";
import { useListFollowers } from "../../hooks/user/useListFollowers";
import { useDeleteFollower } from "../../hooks/user/useDeleteFollower";
import { useFollow } from "../../hooks/user/useFollow";
import { useAuth } from "../../hooks/auth/useAuth";
import { useQueryClient } from "@tanstack/react-query";

import { useTitle } from "react-use";
import { Link, useOutletContext } from "react-router";
import { FormEvent, Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import SearchBar from "./SearchBar";
import Image from "../../components/Image";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";

interface Follower extends Partial<User> {
  user_id: number;
  my_following: boolean;
  role: string;
}

interface FollowersPage {
  followers: Follower[];
}

interface OutletContextType {
  toggleConfirmUnfollow: () => void;
  setUserToUnfollow: (user: Follower) => void;
}

const Followers = () => {
  const { user, setUser, isOwnProfile } = useProfile();
  useTitle(`@${user?.username} követői - Bump`);

  const queryClient = useQueryClient();

  const { auth } = useAuth();
  const { toggleConfirmUnfollow, setUserToUnfollow } =
    useOutletContext<OutletContextType>();

  const [searchKeyDebounced, setSearchKeyDebounced] = useState<string>("");
  const [pages, setPages] = useState<FollowersPage[] | null>(null);

  const { ref, inView } = useInView();

  const { isLoading, isFetchingNextPage, isError, fetchNextPage, data } =
    useListFollowers([user!.id, searchKeyDebounced], {
      uid: user!.id,
      searchKey: searchKeyDebounced,
    });

  useEffect(() => {
    if (data?.pages) {
      setPages(data.pages);
    }
  }, [data]);

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const followMutation = useFollow((response, followerId: number) => {
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

    setUser({
      ...user,
      following: true,
      followings_count: user?.followings_count! + 1,
    });
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

      setUser({
        ...user,
        following: false,
        followers_count: user?.followers_count! - 1,
      });
    }
  );

  const handleFollow = (e: FormEvent, followerId: number) => {
    e.preventDefault();

    if (followMutation.isPending) return;

    followMutation.mutateAsync(followerId);
  };

  const handleDeleteFollower = (e: FormEvent, followerId: number) => {
    e.preventDefault();

    if (deleteFollowerMutation.isPending) return;

    deleteFollowerMutation.mutateAsync(followerId);
  };

  if (isError) {
    return (
      <h4 className='fc-red-500 ta-center py-5'>
        Hiba történt a követések betöltése közben.
      </h4>
    );
  }

  if (isLoading) {
    return (
      <div className='relative py-5'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='modal__content'>
      {pages && (
        <>
          <SearchBar
            searchKeyDebounced={searchKeyDebounced}
            onSearchDebounced={(debouncedValue) => {
              setSearchKeyDebounced(debouncedValue);
            }}
          />

          {pages[0].followers.length > 0 ? (
            <ul className='user__list'>
              {pages.map((page, index) => (
                <Fragment key={index}>
                  {page.followers.map((follower, idx) => (
                    <li key={idx} className='user__list-item'>
                      <div className='item__user-info'>
                        <Image
                          src={follower.profile_picture!}
                          alt={follower.username?.slice(0, 2)!}
                          placeholderColor='#212529'
                        />

                        <div className='user__text'>
                          <Link
                            to={ROUTES.PROFILE(follower.username!).ROOT}
                            className='username fs-18 link black'>
                            {follower.username}
                          </Link>

                          {isOwnProfile && !follower.my_following && (
                            <>
                              &nbsp;&nbsp;
                              {!follower.my_following && (
                                <span
                                  onClick={(e) =>
                                    handleFollow(e, follower.user_id)
                                  }
                                  className='link fs-15'>
                                  Követés
                                </span>
                              )}
                            </>
                          )}
                          <p className='fc-light fs-14 truncate'>
                            {follower.role}
                          </p>
                        </div>
                      </div>

                      {/* Ha saját profilon vagyunk */}
                      {isOwnProfile ? (
                        <Button
                          className='secondary red'
                          text='Eltávolítás'
                          onClick={(e) =>
                            handleDeleteFollower(e, follower.user_id)
                          }
                          loading={deleteFollowerMutation.isPending}
                        />
                      ) : (
                        <>
                          {/* Ha nem saját oldalon vagyunk, magunkat nem vesszük figyelembe */}
                          {auth?.user?.username !== follower.username && (
                            <>
                              {/* Egyébként gomb státusz alapján */}
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
                                  onClick={(e) =>
                                    handleFollow(e, follower.user_id)
                                  }
                                  loading={followMutation.isPending}
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </Fragment>
              ))}

              <div ref={ref}>
                {isFetchingNextPage && (
                  <div className='relative py-3'>
                    <Spinner />
                  </div>
                )}
              </div>
            </ul>
          ) : (
            <>
              {searchKeyDebounced ? (
                <p className='fc-light ta-center py-5'>Nincs találat.</p>
              ) : (
                <p className='fc-light ta-center py-5'>
                  {user?.username} még nem rendelkezik követőkkel.
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Followers;
