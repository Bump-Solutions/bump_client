import { QUERY_KEY } from "../../utils/queryKeys";
import { CartItemModel, SellerModel } from "../../models/cartModel";
import { InventoryModel, ProductListModel } from "../../models/productModel";
import { FacetProps } from "../../hooks/product/useFacetedSearch";
import { useProduct } from "../../hooks/product/useProduct";
import { useSaveProduct } from "../../hooks/product/useSaveProduct";
import { useUnsaveProduct } from "../../hooks/product/useUnsaveProduct";
import { useQueryClient } from "@tanstack/react-query";
import { MouseEvent } from "react";
import { useCart } from "../../hooks/trade/useCart";
import { useToast } from "../../hooks/useToast";

import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";

import { Bookmark, Mail, ShoppingBag } from "lucide-react";
import StateButton from "../../components/StateButton";

interface ProductActionsProps extends FacetProps {
  discount: number | null;
}

const ProductActions = ({
  quantity,
  discount,
  filtered,
  filteredCount,
  reset,
}: ProductActionsProps) => {
  const queryClient = useQueryClient();
  const { product, setProduct } = useProduct();
  const { cart, addItem } = useCart();

  const { addToast } = useToast();

  if (!product) return null;

  const isDisabled = quantity < 1 || filteredCount === 0;

  const saveMutation = useSaveProduct((response) => {
    setProduct({ saved: true, saves: product.saves + 1 });

    queryClient.setQueryData(
      [QUERY_KEY.listProducts, product.user.id],
      (prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page: InventoryModel) => ({
            ...page,
            products: page.products.map((p: ProductListModel) => {
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
        pages: prev.pages.map((page: InventoryModel) => ({
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
      [QUERY_KEY.listProducts, product?.user.id],
      (prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page: InventoryModel) => ({
            ...page,
            products: page.products.map((p: ProductListModel) => {
              if (p.id === product?.id) {
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
        pages: prev.pages.map((page: InventoryModel) => ({
          ...page,
          products: page.products.filter(
            (p: ProductListModel) => p.id !== product.id
          ),
        })),
      };
    });
  });

  const handleSave = (
    e: MouseEvent<HTMLButtonElement>,
    pid: number,
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

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isDisabled) return;
    if (!filtered || filtered.length === 0) return;

    // Seller
    const seller: SellerModel = {
      id: product.user.id,
      username: product.user.username,
      profilePicture: product.user.profilePicture || null,
    };

    filtered.forEach((item) => {
      const cartItem: CartItemModel = {
        id: item.id,
        label: [
          product.product.brand,
          product.product.model,
          product.product.colorWay,
        ].join(" "),
        image: product.images[0],
      };

      /*
      if (cart[seller.id].items.some((i) => i.id === cartItem.id)) {
        addToast("info", `A termék már a kosárban van: ${cartItem.label}`);
        return; // Item already exists in the cart for this seller
      }
      */

      addItem(seller, cartItem);
    });

    console.log("Add to cart clicked", {
      quantity,
      filtered,
      filteredCount,
      seller,
    });

    reset();

    return Promise.resolve();
  };

  return (
    <div className='product__actions'>
      <div className={`product__action--save ${product.saved ? "active" : ""}`}>
        <Tooltip
          content={product.saved ? "Mentve" : "Mentés"}
          showDelay={750}
          placement='top'>
          <Button
            className='secondary'
            onClick={(e) => handleSave(e, product.id, product.saved)}>
            <Bookmark />
          </Button>
        </Tooltip>
      </div>

      <div className='product__action--cart'>
        <StateButton
          className='primary'
          text='Kosárba'
          disabled={isDisabled}
          onClick={handleAddToCart}>
          <ShoppingBag />
        </StateButton>
      </div>

      <div className='product__action--contact'>
        <Button
          className='secondary'
          text='Kapcsolatfelvétel'
          disabled={isDisabled}>
          <Mail />
        </Button>
      </div>
    </div>
  );
};

export default ProductActions;
