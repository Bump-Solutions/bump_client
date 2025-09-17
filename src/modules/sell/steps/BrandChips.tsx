import { Fragment, useEffect, useState } from "react";
import { useSell } from "../../../hooks/product/useSell";
import { useListAvailableBrands } from "../../../hooks/product/useListAvailableBrands";
import { useToggle } from "../../../hooks/useToggle";
import { BrandModel, BrandsPageModel } from "../../../models/productModel";

import Spinner from "../../../components/Spinner";
import Chip from "../../../components/Chip";
import SearchChip from "./SearchChip";

import { X } from "lucide-react";

const BrandChips = () => {
  const { data, updateData, errors } = useSell();

  const [searchKeyDebounced, setSearchKeyDebounced] = useState<string>("");
  const [pages, setPages] = useState<BrandsPageModel[]>([]);
  const [showAll, toggleShowAll] = useToggle(false);

  const {
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    data: resp,
  } = useListAvailableBrands([searchKeyDebounced], {
    isCatalogProduct: data.product.isCatalog,
    searchKey: searchKeyDebounced,
  });

  const selectedBrand = data.product?.brand;

  useEffect(() => {
    if (isLoading || !resp?.pages) return;

    const firstPage = resp.pages[0];

    if (
      !selectedBrand ||
      firstPage.products.some((b: BrandModel) => b.brand === selectedBrand)
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
              products: [{ brand: selectedBrand }, ...firstPage.products],
            },
          ]
    );
  }, [resp, showAll, selectedBrand]);

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

  const handleSelect = (brand: string) => {
    updateData({
      product: {
        ...data.product,
        brand: selectedBrand === brand ? "" : brand,
        id: null,
        model: "",
        colorWay: "",
      },
    });
  };

  return (
    <div className='my-0_5'>
      <label className='fs-18'>
        Márka{" "}
        <span
          className={`transition-clr ${
            selectedBrand ? "fc-red-500" : "fc-red-200"
          }`}>
          *
        </span>
      </label>
      <p className='fs-14 fc-gray-600'>Válassz az alábbiak közül</p>

      {isError && (
        <h4 className='fc-red-500 ta-center py-2'>
          Hiba történt a márkák betöltése közben.
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
              {page.products.map((brand) => (
                <li key={brand.brand}>
                  <Chip
                    label={brand.brand}
                    selected={selectedBrand === brand.brand}
                    onClick={() => handleSelect(brand.brand)}
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

      {errors.brand && <p className='fc-red-500'>{errors.brand}</p>}
    </div>
  );
};

export default BrandChips;
