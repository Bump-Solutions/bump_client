import { ENUM } from "../../utils/enum";
import { useNavigate } from "react-router";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";

import History from "./History";
import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import Results from "./Results";
import Brands from "./Brands";

import { Info, Search } from "lucide-react";

const SearchContent = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({
    query: `(max-width: ${ENUM.MEDIA_MOBILE}px)`,
  });

  const [searchKey, setSearchKey] = useState<string>("");

  return (
    <>
      <section className='search__header'>
        <div className='search-input'>
          <Search className='svg-20' />
          <input
            type='text'
            autoFocus
            tabIndex={0}
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder={
              isMobile
                ? `Böngéssz a ${ENUM.BRAND.WHERE}...`
                : `Böngéssz sneakerek, márkák, @felhasználók között...`
            }
          />

          <Tooltip
            content='Felhasználók kereséséhez írj egy "@" szimbólumot a név elejére ( @felhasználónév ).'
            placement='top'>
            <Info style={{ cursor: "pointer" }} />
          </Tooltip>
        </div>
        <Button
          className='tertiary'
          text='Mégsem'
          onClick={() => navigate(-1)}
        />
      </section>

      {searchKey && searchKey != "" ? (
        <Results searchKey={searchKey} setSearchKey={setSearchKey} />
      ) : (
        <>
          <History searchKey={searchKey} setSearchKey={setSearchKey} />

          <Brands setSearchKey={setSearchKey} />
        </>
      )}
    </>
  );
};

export default SearchContent;
