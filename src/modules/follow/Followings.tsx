import { QUERY_KEY } from "../../utils/queryKeys";
import { ROUTES } from "../../routes/routes";
import { User } from "../../types/user";
import { useQueryClient } from "@tanstack/react-query";
import { useTitle } from "react-use";
import { useProfile } from "../../hooks/profile/useProfile";
import { useAuth } from "../../hooks/auth/useAuth";
import { useListFollowings } from "../../hooks/user/useListFollowings";
import { useFollow } from "../../hooks/user/useFollow";

import { Link, useOutletContext } from "react-router";
import { FormEvent, Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import Image from "../../components/Image";
import Spinner from "../../components/Spinner";
import Button from "../../components/Button";
import SearchBar from "./SearchBar";

interface FollowingUser extends Partial<User> {
  role: string;
  following_user_id: number;
  my_following: boolean;
}

interface FollowingsPage {
  followings: FollowingUser[];
}

interface OutletContextType {
  toggleConfirmUnfollow: () => void;
  setUserToUnfollow: (user: FollowingUser) => void;
}

const Followings = () => {
  const { user, isOwnProfile } = useProfile();
  useTitle(`@${user?.username} követései - Bump`);

  const queryClient = useQueryClient();

  const { auth } = useAuth();

  const { toggleConfirmUnfollow, setUserToUnfollow } =
    useOutletContext<OutletContextType>();

  const [searchKeyDebounced, setSearchKeyDebounced] = useState("");
  const [pages, setPages] = useState<FollowingsPage[] | null>(null);

  const { ref, inView } = useInView();

  const { isLoading, isFetchingNextPage, isError, fetchNextPage, data } =
    useListFollowings([user!.id, searchKeyDebounced], {
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

  const followMutation = useFollow((response, followingId) => {
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
              followings: page.followings.map((following: FollowingUser) => {
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

  const handleFollow = (e: FormEvent, followingId: number) => {
    e.preventDefault();

    if (followMutation.isPending) return;

    followMutation.mutateAsync(followingId);
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

          {pages[0].followings.length > 0 ? (
            <ul className='user__list'>
              {pages.map((page, index) => (
                <Fragment key={index}>
                  {page.followings.map((following, idx) => (
                    <li key={idx} className='user__list-item'>
                      <div className='item__user-info'>
                        <Image
                          src={following.profile_picture!}
                          alt={following.username?.slice(0, 2)!}
                          placeholderColor='#212529'
                        />

                        <div className='user__text'>
                          <Link
                            to={ROUTES.PROFILE(following.username!).ROOT}
                            className='username fs-18 link black'>
                            {following.username}
                          </Link>
                          <p className='fc-light fs-14 truncate'>
                            {following.role}
                          </p>
                        </div>
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
                              {/* Egyébként gomb státusz alapján */}
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
            <p className='fc-light ta-center py-5'>Nincs találat.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Followings;
