import { Fragment, useEffect, useState } from "react";
import { useSell } from "../../../hooks/product/useSell";
import { CatalogProduct } from "../../../types/product";
import { useListAvailableColorways } from "../../../hooks/product/listAvailableColorways";
import { useToggle } from "../../../hooks/useToggle";

import Spinner from "../../../components/Spinner";
import SearchChip from "./SearchChip";
import Chip from "../../../components/Chip";

import { X } from "lucide-react";

interface Colorway {
  id: CatalogProduct["id"]; // IMPORTANT: This is the ID of the catalog product
  color_way: string;
}

interface ColorwaysPage {
  count: number;
  products: Colorway[];
}

const ColorwayChips = () => {
  const { data, updateData, errors } = useSell();

  const [searchKeyDebounced, setSearchKeyDebounced] = useState<string>("");
  const [pages, setPages] = useState<ColorwaysPage[]>([]);
  const [showAll, toggleShowAll] = useToggle(false);

  const {
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    data: resp,
  } = useListAvailableColorways(
    [searchKeyDebounced, data.product?.brand, data.product?.model],
    {
      isCatalogProduct: data.isCatalogProduct,
      brand: data.product?.brand || "",
      model: data.product?.model || "",
      searchKey: searchKeyDebounced,
    }
  );

  const selectedBrand = data.product?.brand;
  const selectedModel = data.product?.model;
  const selectedColorway = data.product?.colorway;

  useEffect(() => {
    // Reset pages if brand or model changes to null
    if (!selectedBrand || !selectedModel) {
      setPages([]);
    }
  }, [selectedBrand, selectedModel]);

  useEffect(() => {
    if (isLoading || !resp?.pages) return;

    const firstPage = resp.pages[0];

    if (
      !selectedColorway ||
      firstPage.products.some((c: Colorway) => c.color_way === selectedColorway)
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
              products: [
                { color_way: selectedColorway },
                ...firstPage.products,
              ],
            },
          ]
    );
  }, [resp, showAll, selectedColorway]);

  useEffect(() => {
    if (showAll && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    showAll,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    data.product?.brand,
    data.product?.model,
  ]);

  const remainingCount =
    pages.length > 0
      ? pages[0].count -
        pages.reduce((sum, page) => sum + page.products.length, 0)
      : 0;

  const handleSelect = (id: Colorway["id"], colorway: string) => {
    updateData({
      product: {
        ...data.product,
        id: selectedColorway === colorway ? null : id,
        colorway: selectedColorway === colorway ? "" : colorway,
      },
    });
  };

  return (
    <div className='my-0_5'>
      <label className='fs-18'>
        Színállás{" "}
        <span
          className={`transition-clr ${
            selectedColorway ? "fc-red-500" : "fc-red-200"
          }`}>
          *
        </span>
      </label>
      <p className='fs-14 fc-light'>
        {selectedBrand && selectedModel
          ? "Válassz az alábbiak közül"
          : "Először válassz márkát és modellt!"}
      </p>

      {isError && (
        <h4 className='fc-red-500 ta-center py-2'>
          Hiba történt a színállások betöltése közben.
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
              {page.products.map((clr) => (
                <li key={clr.color_way}>
                  <Chip
                    label={clr.color_way}
                    selected={selectedColorway === clr.color_way}
                    onClick={() => handleSelect(clr.id, clr.color_way)}
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

      {errors.colorway && <p className='fc-red-500'>{errors.colorway}</p>}
    </div>
  );
};

export default ColorwayChips;
