import { ChangeEvent, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

import { Search } from "lucide-react";

interface SearchBarProps {
  searchKeyDebounced: string;
  onSearchDebounced: (value: string) => void;
}

const SearchBar = ({
  searchKeyDebounced,
  onSearchDebounced,
}: SearchBarProps) => {
  const [searchKey, setSearchKey] = useState<string>(searchKeyDebounced);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  };

  useDebounce(
    () => {
      if (onSearchDebounced) {
        onSearchDebounced(searchKey);
      }
    },
    750,
    [searchKey]
  );

  return (
    <div className='search-box'>
      <Search />
      <input
        className='form-control'
        onChange={onSearch}
        value={searchKey}
        ref={searchRef}
        placeholder='Keresés ...'
      />
    </div>
  );
};

export default SearchBar;
