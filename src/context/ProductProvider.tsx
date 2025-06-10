import { ROUTES } from "../routes/routes";
import { ProductModel } from "../models/productModel";
import { ApiError } from "../types/api";
import { QUERY_KEY } from "../utils/queryKeys";
import { useGetProduct } from "../hooks/product/useGetProduct";

import { createContext, ReactNode, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

interface ProductContextType {
  product: ProductModel | undefined;
  setProduct: (data: Partial<ProductModel>) => void;
  isLoading: boolean;
  error?: ApiError | null;
  isError: boolean;
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProduct([productId], { pid: productId });

  useEffect(() => {
    if (isError) {
      navigate(ROUTES.NOTFOUND, {
        replace: true,
        state: {
          error: {
            code: 404,
            title: "Hibás termékazonosító",
            message: `Sajnáljuk, a(z) '${productId}' azonosítójú termék nem található. Megeshet, hogy elírás van az azonosítóban, vagy a termék törölve lett.`,
          },
        },
      });
    }
  }, [isError]);

  const setProduct = (data: Partial<ProductModel>) => {
    queryClient.setQueryData(
      [QUERY_KEY.getProduct, productId],
      (prev: ProductModel | undefined) => ({
        ...prev,
        ...data,
      })
    );
  };

  return (
    <ProductContext value={{ product, setProduct, isLoading, error, isError }}>
      {children}
    </ProductContext>
  );
};

export default ProductProvider;
