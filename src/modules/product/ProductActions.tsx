import { QUERY_KEY } from "../../utils/queryKeys";
import { ROUTES } from "../../routes/routes";
import { useAuth } from "../../hooks/auth/useAuth";
import { CartItemModel, SellerModel } from "../../models/cartModel";
import { InventoryModel, ProductListModel } from "../../models/productModel";
import { FacetProps } from "../../hooks/product/useFacetedSearch";
import { useProduct } from "../../hooks/product/useProduct";
import { useSaveProduct } from "../../hooks/product/useSaveProduct";
import { useUnsaveProduct } from "../../hooks/product/useUnsaveProduct";
import { useQueryClient } from "@tanstack/react-query";
import { MouseEvent } from "react";
import { useCart } from "../../hooks/trade/useCart";
import { Link } from "react-router";
import { toast } from "sonner";

import Button from "../../components/Button";
import StateButton from "../../components/StateButton";
import Tooltip from "../../components/Tooltip";

import { Bookmark, Mail, ShoppingBag } from "lucide-react";
import { CreateOrderModel } from "../../models/orderModel";
import { useCreateOrder } from "../../hooks/order/useCreateOrder";

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
  const { auth } = useAuth();

  const queryClient = useQueryClient();
  const { product, setProduct } = useProduct();
  const { cart, addItem } = useCart();

  if (!product) return null;

  const isDisabled = quantity < 1 || filteredCount === 0;

  const createOrderMutation = useCreateOrder((response) => {});

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
      const savePromise = saveMutation.mutateAsync(pid);

      toast.promise(savePromise, {
        loading: "Mentés...",
        success: () => (
          <span>
            Elmentettél egy{" "}
            <Link
              target='_blank'
              className='link fc-green-600 underline fw-700'
              to={ROUTES.PROFILE(auth?.user?.username!).SAVED}>
              terméket.
            </Link>
          </span>
        ),
        error: (err) =>
          (err?.response?.data?.message as string) ||
          "Hiba történt a termék mentése során.",
      });
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

    const maxToAdd = Math.min(quantity, filtered.length);
    filtered.slice(0, maxToAdd).forEach((item) => {
      console.log(item);

      const cartItem: CartItemModel = {
        id: item.id,
        label: [
          product.product.brand,
          product.product.model,
          product.product.colorWay,
        ].join(" "),
        image: product.images[0],
      };

      // TODO: Group by product?
      /*
      if (cart[seller.id].items.some((i) => i.id === cartItem.id)) {
        toast.info(
          <span>
            A termék már a kosárban van: {cartItem.label}.{" "}
            <Link
              to={ROUTES.CART}
              className='link fc-blue-700 underline fw-700'>
              Tovább a kosárra.
            </Link>
          </span>
        );
        return; // Item already exists in the cart for this seller
      }
      */

      addItem(seller, cartItem);
    });

    console.log("Add to cart clicked", {
      quantity,
      product,
      filtered,
      filteredCount,
      seller,
    });

    reset();

    return Promise.resolve();
  };

  const handleCreateOrder = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (createOrderMutation.isPending) return;
    if (isDisabled) return;
    if (!filtered || filtered.length === 0) return;

    const sellerId = product.user.id;

    const maxToAdd = Math.min(quantity, filtered.length);
    const itemIds = filtered.slice(0, maxToAdd).map((item) => item.id);

    const newOrder: CreateOrderModel = {
      sellerId,
      itemIds,
    };

    const createOrderPromise = createOrderMutation.mutateAsync(newOrder);

    toast.promise(createOrderPromise, {
      loading: "Rendelés létrehozása...",
      success: (
        <span>
          A rendelés létrehozva. Rendelésed nyomon követheted{" "}
          <Link to={ROUTES.ORDERS} target='_blank'>
            itt
          </Link>
        </span>
      ),
      error: (err) =>
        // (err?.response?.data?.message as string) ||
        "Hiba a rendelés létrehozása során.",
    });

    reset();

    return createOrderPromise;
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
        <StateButton
          className='secondary'
          text='Kapcsolatfelvétel'
          disabled={isDisabled}
          onClick={handleCreateOrder}>
          <Mail />
        </StateButton>
      </div>
    </div>
  );
};

export default ProductActions;
