import { API } from "../../utils/api";
import { ROUTES } from "../../routes/routes";
import { Link } from "react-router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSearch } from "../../hooks/search/useSearch";
import { useInView } from "react-intersection-observer";

import Image from "../../components/Image";
import Spinner from "../../components/Spinner";
import Button from "../../components/Button";

import { Footprints, Search, User } from "lucide-react";

interface ResultsProps {
  searchKey: string;
  setSearchKey: Dispatch<SetStateAction<string>>;
}

const Results = ({ searchKey, setSearchKey }: ResultsProps) => {
  const [pages, setPages] = useState<any[] | null>(null);
  const [displayedSearchKey, setDisplayedSearchKey] = useState(searchKey);

  const isUserSearch = searchKey.startsWith("@");

  const { ref, inView } = useInView();

  const {
    isLoading,
    isDebouncing,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    data,
  } = useSearch([], {
    searchKey,
    delay: 250,
  });

  useEffect(() => {
    if (data?.pages) {
      setPages(data.pages);
      setDisplayedSearchKey(searchKey);
    }
  }, [data]);

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const handleUserSearch = () => {
    if (!searchKey || isUserSearch) return;
    setSearchKey(`@${searchKey}`);
  };

  const handleProductSearch = () => {
    setSearchKey(searchKey.replace(/^@/, ""));
  };

  const noResultConfig = isUserSearch
    ? {
        message:
          'Nem találod? Ha inkább terméket vagy más tartalmat keresel, próbáld meg a "@" nélkül!',
        buttonText: "Tartalom keresése",
        onClick: handleProductSearch,
        icon: <Footprints />,
      }
    : {
        message:
          'Nem találod? Felhasználók kereséséhez használd a "@" jelet a név előtt, például: @felhasználónév',
        buttonText: "Felhasználó keresése",
        onClick: handleUserSearch,
        icon: <User />,
      };

  if (isError) {
    return (
      <h4 className='fc-red-300 ta-center py-3'>
        Hiba történt a keresés közben.
      </h4>
    );
  }

  if (isLoading || isDebouncing) {
    return (
      <div className='relative py-3'>
        <Spinner />
      </div>
    );
  }

  return (
    pages && (
      <section className='search__result'>
        {pages[0].search_result.length > 0 ? (
          <div className='result__list'>
            <ul>
              <li className='result'>
                <div className='result__img'>
                  <Search className='svg-20' />
                </div>
                <div className='result__text'>
                  <span className='fw-700 truncate'>{displayedSearchKey}</span>
                </div>
              </li>
            </ul>

            {pages.map((page, index) => (
              <ul key={index}>
                {page.search_result.map((result: any, index: number) => {
                  if (isUserSearch) {
                    const { username, profile_picture, followers_count } =
                      result;

                    const label =
                      followers_count > 0
                        ? followers_count >= 1000
                          ? `${Math.floor(followers_count / 1000)}k követő`
                          : `${followers_count} követő`
                        : null;

                    return (
                      <Link
                        key={index}
                        to={ROUTES.PROFILE(username).ROOT}
                        className='result'>
                        <div className='result__img user'>
                          {profile_picture ? (
                            <Image
                              src={API.BASE_URL + profile_picture}
                              alt={username.slice(0, 2)}
                            />
                          ) : (
                            <User className='svg-20' />
                          )}
                        </div>
                        <div className='result__text'>
                          <span className='fw-700 truncate'>
                            {result.username}
                          </span>
                          {label && (
                            <span className='truncate fc-dark-500 fs-14'>
                              {label}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  } else {
                    const { id, title, label, image } = result;
                    return (
                      <Link
                        to={ROUTES.PRODUCT(id).ROOT}
                        key={index}
                        className='result'>
                        <div className='result__img'>
                          {image ? (
                            <Image src={API.BASE_URL + image} alt={title} />
                          ) : (
                            <Footprints className='svg-20' />
                          )}
                        </div>
                        <div className='result__text'>
                          <span className='fw-700 truncate'>{title}</span>
                          <span className='truncate fc-dark-500 fs-14'>
                            {label}
                          </span>
                        </div>
                      </Link>
                    );
                  }
                })}
              </ul>
            ))}

            <div ref={ref}>
              {isFetchingNextPage && (
                <div className='relative py-3'>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='no-result'>
            <h3>
              Úgy tűnik, a(z) "{displayedSearchKey}" még nem szerepel nálunk
            </h3>
            <p>{noResultConfig.message}</p>
            <Button
              className='secondary fill md'
              text={noResultConfig.buttonText}
              onClick={noResultConfig.onClick}>
              {noResultConfig.icon}
            </Button>
          </div>
        )}
      </section>
    )
  );
};

export default Results;
