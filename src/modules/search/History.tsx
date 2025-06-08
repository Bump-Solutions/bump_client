import { Dispatch, JSX, SetStateAction } from "react";
import { useListSearchHistory } from "../../hooks/search/useListSearchHistory";
import { useDeleteHistory } from "../../hooks/search/useDeleteHistory";
import { SearchHistoryItemModel } from "../../models/searchModel";

import Chip from "../../components/Chip";

import { Footprints, Search, User } from "lucide-react";

const SVG_MAP: Record<number, JSX.Element> = {
  0: <Footprints />,
  1: <User />,
};

interface HistoryProps {
  searchKey: string;
  setSearchKey: Dispatch<SetStateAction<string>>;
}

const History = ({ searchKey, setSearchKey }: HistoryProps) => {
  const { data: history = [], isLoading, isError } = useListSearchHistory();

  const deleteHistoryMutation = useDeleteHistory();

  const handleClick = (item: SearchHistoryItemModel) => () => {
    if (!item.query) return;

    if (item.query === searchKey) {
      return;
    }

    var query = item.query;
    if (item.type === 1) {
      query = `@${item.query}`;
    }

    setSearchKey(query);
  };

  const handleDelete = (id: SearchHistoryItemModel["id"]) => () => {
    if (!id) return;

    deleteHistoryMutation.mutateAsync(id);
  };

  if (isError) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  return (
    history.length > 0 && (
      <section className='search__history'>
        {history.map((item: SearchHistoryItemModel) => (
          <Chip
            key={item.id}
            label={item.query}
            svg={SVG_MAP[item.type] || <Search />}
            onClick={handleClick(item)}
            onDelete={handleDelete(item.id)}
          />
        ))}
      </section>
    )
  );
};

export default History;
