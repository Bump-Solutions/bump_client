import { FollowersPage } from "../../types/user";
import { useProfile } from "../../hooks/profile/useProfile";
import { useListFollowers } from "../../hooks/user/useListFollowers";

import { useTitle } from "react-use";
import { useEffect, useState } from "react";

import SearchBar from "./SearchBar";
import Spinner from "../../components/Spinner";
import FollowerList from "./FollowerList";

const Followers = () => {
  const { user } = useProfile();
  useTitle(`@${user?.username} követői - Bump`);

  const [searchKeyDebounced, setSearchKeyDebounced] = useState<string>("");
  const [pages, setPages] = useState<FollowersPage[] | null>(null);

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
            <FollowerList
              pages={pages}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
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
