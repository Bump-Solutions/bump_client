import { useStore } from "@tanstack/react-form";
import { Fragment, useEffect, useState } from "react";
import { useToggle } from "react-use";
import { withForm } from "../../../hooks/form/hooks";
import { useListAvailableColorways } from "../../../hooks/product/useListAvailableColorways";
import {
  ColorwayModel,
  ColorwaysPageModel,
} from "../../../models/productModel";
import { sellFormOptions } from "../../../utils/formOptions";

import { X } from "lucide-react";
import Chip from "../../../components/Chip";
import Spinner from "../../../components/Spinner";
import { sellDetailsSchema } from "../../../schemas/sellSchema";
import SearchChip from "./SearchChip";

const ColorwayChips = withForm({
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
    const selectedModel = useStore(
      form.store,
      (state) => state.values.details.product.model as string,
    );
    const selectedColorway = useStore(
      form.store,
      (state) => state.values.details.product.colorWay as string,
    );
    const colorwayError = useStore(form.store, (state) => {
      const meta = state.fieldMeta["details.product.colorWay"];
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
    const [pages, setPages] = useState<ColorwaysPageModel[]>([]);
    const [showAll, toggleShowAll] = useToggle(false);

    const {
      isLoading,
      hasNextPage,
      isFetchingNextPage,
      isError,
      fetchNextPage,
      data: resp,
    } = useListAvailableColorways([q, selectedBrand, selectedModel], {
      isCatalogProduct: isCatalog,
      brand: selectedBrand || "",
      model: selectedModel || "",
      searchKey: q,
    });

    // Reset pages if brand or model changes to null
    useEffect(() => {
      if (!selectedBrand || !selectedModel) {
        setPages([]);
      }
    }, [selectedBrand, selectedModel]);

    useEffect(() => {
      if (isLoading || !resp?.pages) return;

      const firstPage = resp.pages[0];

      if (
        !selectedColorway ||
        firstPage.products.some(
          (c: ColorwayModel) => c.colorWay === selectedColorway,
        )
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
            ],
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
      selectedBrand,
      selectedModel,
    ]);

    const remainingCount =
      pages.length > 0
        ? pages[0].count -
          pages.reduce((sum, page) => sum + page.products.length, 0)
        : 0;

    const handleSelect = (id: number, colorway: string) => {
      if (colorway === selectedColorway) {
        // unselect – mindent tisztítunk
        form.setFieldValue("details.product.brand", selectedBrand);
        form.setFieldValue("details.product.model", selectedModel);
        form.setFieldValue("details.product.colorWay", "");
        form.setFieldValue("details.product.id", null);

        form.resetField("details.product.colorWay");

        return;
      }
      // új model – cascade reset
      form.setFieldValue("details.product.brand", selectedBrand);
      form.setFieldValue("details.product.model", selectedModel);
      form.setFieldValue("details.product.colorWay", colorway);
      form.setFieldValue("details.product.id", id);

      form.setFieldMeta("details.product.colorWay", (prev: any) => ({
        ...prev,
        errorMap: {},
        errors: [],
      }));
    };

    return (
      <div className='my-0_5'>
        <form.AppField
          name='details.product.colorWay'
          validators={{
            onChange:
              sellDetailsSchema.shape.details.shape.product.shape.colorWay,
          }}>
          {() => null}
        </form.AppField>

        <label className='fs-18'>
          Színállás{" "}
          <span
            className={`transition-clr ${
              selectedColorway ? "fc-red-500" : "fc-red-200"
            }`}>
            *
          </span>
        </label>
        <p className='fs-14 fc-gray-600'>
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
                searchKeyDebounced={q}
                onSearchDebounced={(debouncedValue) => {
                  setQ(debouncedValue);
                }}
              />
            </li>

            {pages.map((page, index) => (
              <Fragment key={index}>
                {page.products.map((clr, idx) => (
                  <li key={clr.colorWay}>
                    <Chip
                      label={clr.colorWay}
                      selected={selectedColorway === clr.colorWay}
                      onClick={() => handleSelect(clr.id, clr.colorWay)}
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

        {colorwayError && <em className='fc-red-500'>{colorwayError}</em>}
      </div>
    );
  },
});

export default ColorwayChips;
