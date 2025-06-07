import { Fragment, useEffect, useState } from "react";
import { useSell } from "../../../hooks/product/useSell";
import { useListAvailableModels } from "../../../hooks/product/useListAvailableModels";
import { useToggle } from "../../../hooks/useToggle";

import Spinner from "../../../components/Spinner";
import Chip from "../../../components/Chip";
import SearchChip from "./SearchChip";

import { X } from "lucide-react";

interface Model {
  model: string;
}

interface ModelsPage {
  count: number;
  products: Model[];
}

const ModelChips = () => {
  const { data, updateData, errors } = useSell();

  const [searchKeyDebounced, setSearchKeyDebounced] = useState<string>("");
  const [pages, setPages] = useState<ModelsPage[]>([]);
  const [showAll, toggleShowAll] = useToggle(false);

  const {
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    data: resp,
  } = useListAvailableModels([searchKeyDebounced, data.product?.brand], {
    isCatalogProduct: data.isCatalogProduct,
    brand: data.product?.brand || "",
    searchKey: searchKeyDebounced,
  });

  const selectedBrand = data.product?.brand;
  const selectedModel = data.product?.model;

  useEffect(() => {
    // Reset pages if brandchanges to null
    if (!selectedBrand) {
      setPages([]);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (isLoading || !resp?.pages) return;

    const firstPage = resp.pages[0];

    if (
      !selectedModel ||
      firstPage.products.some((m: Model) => m.model === selectedModel)
    ) {
      setPages(showAll ? resp.pages : [firstPage]);
      return;
    }

    setPages(
      showAll
        ? resp.pages
        : [
            {
              ...firstPage,
              products: [{ model: selectedModel }, ...firstPage.products],
            },
          ]
    );
  }, [resp, showAll, selectedModel]);

  useEffect(() => {
    if (showAll && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [showAll, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const remainingCount =
    pages.length > 0
      ? pages[0].count -
        pages.reduce((sum, page) => sum + page.products.length, 0)
      : 0;

  const handleSelect = (model: string) => {
    updateData({
      product: {
        ...data.product,
        id: null,
        model: selectedModel === model ? "" : model,
        color_way: "",
      },
    });
  };

  return (
    <div className='my-0_5'>
      <label className='fs-18'>
        Modell{" "}
        <span
          className={`transition-clr ${
            selectedModel ? "fc-red-500" : "fc-red-200"
          }`}>
          *
        </span>
      </label>
      <p className='fs-14 fc-light'>
        {selectedBrand
          ? "Válassz az alábbiak közül"
          : "Először válassz márkát!"}
      </p>

      {isError && (
        <h4 className='fc-red-500 ta-center py-2'>
          Hiba történt a modellek betöltése közben.
        </h4>
      )}

      {isLoading && (
        <div className='relative py-2'>
          <Spinner />
        </div>
      )}

      {!isError && !isLoading && pages.length > 0 && (
        <ul className='chips__wrapper'>
          <li>
            <SearchChip
              searchKeyDebounced={searchKeyDebounced}
              onSearchDebounced={(debouncedValue) => {
                setSearchKeyDebounced(debouncedValue);
              }}
            />
          </li>

          {pages.map((page, index) => (
            <Fragment key={index}>
              {page.products.map((model) => (
                <li key={model.model}>
                  <Chip
                    label={model.model}
                    selected={selectedModel === model.model}
                    onClick={() => handleSelect(model.model)}
                  />
                </li>
              ))}
            </Fragment>
          ))}
          <li>
            {showAll ? (
              <Chip svg={<X />} onClick={() => toggleShowAll(false)} />
            ) : (
              remainingCount > 0 && (
                <Chip
                  label={`+${remainingCount}`}
                  onClick={() => toggleShowAll(true)}
                />
              )
            )}
          </li>
        </ul>
      )}

      {errors.model && <p className='fc-red-500'>{errors.model}</p>}
    </div>
  );
};

export default ModelChips;
