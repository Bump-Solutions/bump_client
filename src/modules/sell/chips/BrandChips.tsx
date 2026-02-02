import { useStore } from "@tanstack/react-form";
import { Fragment, useEffect, useState } from "react";
import { useToggle } from "react-use";
import { withForm } from "../../../hooks/form/hooks";
import { useListAvailableBrands } from "../../../hooks/product/useListAvailableBrands";
import { BrandModel, BrandsPageModel } from "../../../models/productModel";
import { sellFormOptions } from "../../../utils/formOptions";

import Chip from "../../../components/Chip";
import Spinner from "../../../components/Spinner";
import SearchChip from "./SearchChip";

import { X } from "lucide-react";
import { sellDetailsSchema } from "../../../schemas/sellSchema";

const BrandChips = withForm({
  ...sellFormOptions,
  render: function Render({ form }) {
    const isCatalog = useStore(
      form.store,
      (state) => state.values.select.isCatalog as boolean,
    );

    const selectedBrand = useStore(
      form.store,
      (state) => state.values.details.product.brand as string,
    );

    const brandError = useStore(form.store, (state) => {
      const meta = state.fieldMeta["details.product.brand"];
      if (!meta || !meta.isTouched || meta.isValid) return undefined;

      const errorMap = meta.errorMap ?? {};
      const fromSubmit = errorMap.onSubmit ?? [];

      const allErrors = [
        ...(Array.isArray(fromSubmit) ? fromSubmit : [fromSubmit]),
      ].filter(Boolean);

      const first = allErrors[0];
      if (!first) return undefined;

      return typeof first === "string" ? first : first.message;
    });

    const [q, setQ] = useState<string>("");
    const [pages, setPages] = useState<BrandsPageModel[]>([]);
    const [showAll, toggleShowAll] = useToggle(false);

    const {
      isLoading,
      hasNextPage,
      isFetchingNextPage,
      isError,
      fetchNextPage,
      data: resp,
    } = useListAvailableBrands([q], {
      isCatalogProduct: isCatalog,
      searchKey: q,
    });

    // Ensure selected brand is visible
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
            ],
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
      if (brand === selectedBrand) {
        // unselect – mindent tisztítunk
        form.setFieldValue("details.product.brand", "");
        form.setFieldValue("details.product.model", "");
        form.setFieldValue("details.product.colorWay", "");
        form.setFieldValue("details.product.id", null);

        form.resetField("details.product.brand");

        return;
      }
      // új brand – cascade reset
      form.setFieldValue("details.product.brand", brand);
      form.setFieldValue("details.product.model", "");
      form.setFieldValue("details.product.colorWay", "");
      form.setFieldValue("details.product.id", null);

      form.setFieldMeta("details.product.brand", (prev: any) => ({
        ...prev,
        errorMap: {},
        errors: [],
      }));
    };

    return (
      <div className='my-0_5'>
        <form.AppField
          name='details.product.brand'
          validators={{
            onChange: sellDetailsSchema.shape.details.shape.product.shape.brand,
          }}>
          {() => null}
        </form.AppField>

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
                searchKeyDebounced={q}
                onSearchDebounced={(debouncedValue) => {
                  setQ(debouncedValue);
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

        {brandError && <em className='fc-red-500'>{brandError}</em>}
      </div>
    );
  },
});

export default BrandChips;
