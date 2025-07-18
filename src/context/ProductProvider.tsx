import { ROUTES } from "../routes/routes";
import { ProductModel } from "../models/productModel";
import { QUERY_KEY } from "../utils/queryKeys";
import { useGetProduct } from "../hooks/product/useGetProduct";

import { createContext, ReactNode, useCallback, useMemo } from "react";
import { Navigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

interface ProductContextType {
  product: ProductModel | undefined;
  setProduct: (data: Partial<ProductModel>) => void;
  isLoading: boolean;
}

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

interface ProductProviderProps {
  children: ReactNode;
}

const ProductProvider = ({ children }: ProductProviderProps) => {
  const { pid } = useParams();
  const productId = Number(pid);
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProduct([productId], { pid: productId });

  const setProduct = useCallback(
    (data: Partial<ProductModel>) => {
      queryClient.setQueryData(
        [QUERY_KEY.getProduct, productId],
        (prev: ProductModel | undefined) => ({
          ...prev,
          ...data,
        })
      );
    },
    [queryClient, productId]
  );

  const contextValue = useMemo<ProductContextType>(
    () => ({
      product,
      setProduct,
      isLoading,
    }),
    [product, setProduct, isLoading]
  );

  if (isError) {
    return (
      <Navigate
        to={ROUTES.NOTFOUND}
        replace
        state={{
          error: {
            code: 404,
            title: "Hibás termékazonosító",
            message: `Sajnáljuk, a(z) '${productId}' azonosítójú termék nem található. Megeshet, hogy elírás van az azonosítóban, vagy a termék törölve lett.`,
          },
        }}
      />
    );
  }

  return <ProductContext value={contextValue}>{children}</ProductContext>;
};

export default ProductProvider;
