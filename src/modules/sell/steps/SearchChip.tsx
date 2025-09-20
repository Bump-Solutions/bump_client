import { ChangeEvent, useRef, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";

import { Search } from "lucide-react";

interface SearchChipProps {
  searchKeyDebounced: string;
  onSearchDebounced: (value: string) => void;
}

const SearchChip = ({
  searchKeyDebounced,
  onSearchDebounced,
}: SearchChipProps) => {
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
    250,
    [searchKey]
  );

  return (
    <div className='search-box' onClick={() => searchRef.current?.focus()}>
      <Search />
      <input
        className='form-control'
        onChange={onSearch}
        value={searchKey}
        ref={searchRef}
        placeholder='Keresés...'
      />
    </div>
  );
};

export default SearchChip;
