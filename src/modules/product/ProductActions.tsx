import { ROUTES } from "../../routes/routes";
import { useAuth } from "../../hooks/auth/useAuth";
import { FacetProps } from "../../hooks/product/useFacetedSearch";
import { useProduct } from "../../hooks/product/useProduct";
import { useSaveProduct } from "../../hooks/product/useSaveProduct";
import { useUnsaveProduct } from "../../hooks/product/useUnsaveProduct";
import { MouseEvent } from "react";
import { useCart } from "../../hooks/cart/useCart";
import { Link } from "react-router";
import { toast } from "sonner";

import Button from "../../components/Button";
import StateButton from "../../components/StateButton";
import Tooltip from "../../components/Tooltip";

import { Bookmark, Send, ShoppingBag } from "lucide-react";
import { CreateOrderModel } from "../../models/orderModel";
import { useCreateOrder } from "../../hooks/order/useCreateOrder";

const ProductActions = ({
  quantity,
  filtered,
  filteredCount,
  reset,
}: FacetProps) => {
  const { auth } = useAuth();

  const { product, setProduct } = useProduct();
  const { actions } = useCart();

  if (!product) return null;

  const isDisabled = quantity < 1 || filteredCount === 0;

  const createOrderMutation = useCreateOrder((response) => {});

  const saveMutation = useSaveProduct((response) => {
    setProduct({ saved: true, saves: product.saves + 1 });
  });

  const unsaveMutation = useUnsaveProduct((response) => {
    setProduct({ saved: false, saves: product.saves - 1 });
  });

  const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!product.saved) {
      if (saveMutation.isPending) return;
      const savePromise = saveMutation.mutateAsync({
        product,
        ownerId: product.user.id,
      });

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
      unsaveMutation.mutateAsync({ product, userId: product.user.id });
    }
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!actions) return;
    if (actions.addItems.isPending) return;
    if (isDisabled) return;
    if (!filtered || filtered.length === 0) return;

    const maxToAdd = Math.min(quantity, filtered.length);

    const addPromise = actions.addItems.mutateAsync(
      filtered.slice(0, maxToAdd).map((item) => item.id)
    );

    toast.promise(addPromise, {
      loading: "Kosárba helyezés...",
      success: (
        <span>
          A tétel bekerült a kosaradba. A kosarad megtekintheted{" "}
          <Link to={ROUTES.CART} className='link fc-green-600 underline fw-700'>
            itt.
          </Link>
        </span>
      ),
      error: (err) => "Hiba a termék kosárba helyezése során.",
    });

    reset();

    return addPromise;
  };

  const handleCreateOrder = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (createOrderMutation.isPending) return Promise.reject();
    if (isDisabled) return Promise.reject();
    if (!filtered || filtered.length === 0) return Promise.reject();

    const sellerId = product.user.id;

    const maxToAdd = Math.min(quantity, filtered.length);
    const itemIds = filtered.slice(0, maxToAdd).map((item) => item.id);

    const newOrder: CreateOrderModel = {
      source: "product",
      sellerId,
      itemIds,
    };

    const createOrderPromise = createOrderMutation.mutateAsync({ newOrder });

    toast.promise(createOrderPromise, {
      loading: "Rendelés létrehozása...",
      success: (
        <span>
          A rendelés létrehozva. Rendelésed nyomon követheted{" "}
          <Link
            to={ROUTES.ORDERS}
            target='_blank'
            className='link fc-green-600 underline fw-700'>
            itt.
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
          <Button className='secondary' onClick={handleSave}>
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
          text='Üzenet az eladónak'
          disabled={isDisabled}
          onClick={handleCreateOrder}>
          <Send />
        </StateButton>
      </div>
    </div>
  );
};

export default ProductActions;
