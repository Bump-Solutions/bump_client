import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../utils/queryKeys";

import { Inventory, IProduct } from "../../types/product";
import { useProduct } from "../../hooks/product/useProduct";
import { useSaveProduct } from "../../hooks/product/useSaveProduct";
import { useUnsaveProduct } from "../../hooks/product/useUnsaveProduct";

import { MouseEvent } from "react";

import Button from "../../components/Button";

import { Bookmark, Share2 } from "lucide-react";

const ProductHeader = () => {
  const queryClient = useQueryClient();
  const { product, setProduct } = useProduct();

  const saveMutation = useSaveProduct((response) => {
    setProduct({ saved: true, saves: product.saves + 1 });

    queryClient.setQueryData(
      [QUERY_KEY.listProducts, product.user.id],
      (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page: Inventory) => ({
            ...page,
            products: page.products.map((p: IProduct) => {
              if (p.id === product.id) {
                return {
                  ...p,
                  saved: true,
                  saves: p.saves + 1,
                };
              }
              return p;
            }),
          })),
        };
      }
    );

    queryClient.setQueryData([QUERY_KEY.listSavedProducts], (prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: prev.pages.map((page: Inventory) => ({
          ...page,
          products: [
            { ...product, saved: true, saves: product.saves + 1 },
            ...page.products,
          ],
        })),
      };
    });
  });

  const unsaveMutation = useUnsaveProduct((response) => {
    setProduct({ saved: false, saves: product.saves - 1 });

    queryClient.setQueryData(
      [QUERY_KEY.listProducts, product.user.id],
      (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page: Inventory) => ({
            ...page,
            products: page.products.map((p: IProduct) => {
              if (p.id === product.id) {
                return {
                  ...p,
                  saved: false,
                  saves: p.saves - 1,
                };
              }
              return p;
            }),
          })),
        };
      }
    );

    queryClient.setQueryData([QUERY_KEY.listSavedProducts], (prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: prev.pages.map((page: Inventory) => ({
          ...page,
          products: page.products.filter((p: IProduct) => p.id !== product.id),
        })),
      };
    });
  });

  const handleSave = (
    e: MouseEvent<HTMLSpanElement>,
    pid: IProduct["id"],
    isSaved: boolean
  ) => {
    e.preventDefault();

    if (!isSaved) {
      if (saveMutation.isPending) return;
      saveMutation.mutateAsync(pid);
    } else {
      if (unsaveMutation.isPending) return;
      unsaveMutation.mutateAsync(pid);
    }
  };

  return (
    <div className='product__header'>
      <h1>{product.title}</h1>

      <div>
        <Button className='tertiary no-anim' text='Megosztás'>
          <Share2 className='svg-16' />
        </Button>

        <Button
          className={`tertiary ${
            product.saved ? "fill fc-yellow-500" : ""
          } no-anim`}
          text={`${product.saved ? "Mentve" : "Mentés"}`}
          onClick={(e) => handleSave(e, product.id, product.saved)}>
          <Bookmark className='svg-16 ' />
        </Button>
      </div>
    </div>
  );
};

export default ProductHeader;
