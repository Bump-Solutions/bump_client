import { User } from "../../types/user";
import { useTitle } from "react-use";
import { useProfile } from "../../hooks/profile/useProfile";
import { useListFollowings } from "../../hooks/user/useListFollowings";

import { useEffect, useState } from "react";

import Spinner from "../../components/Spinner";
import SearchBar from "./SearchBar";
import FollowingList from "./FollowingList";

interface FollowingUser extends Partial<User> {
  role: string;
  following_user_id: number;
  my_following: boolean;
}

interface FollowingsPage {
  followings: FollowingUser[];
}

const Followings = () => {
  const { user } = useProfile();
  useTitle(`@${user?.username} követései - Bump`);

  const [searchKeyDebounced, setSearchKeyDebounced] = useState("");
  const [pages, setPages] = useState<FollowingsPage[] | null>(null);

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
            <FollowingList
              pages={pages}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : (
            <p className='fc-light ta-center py-5'>Nincs találat.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Followings;
