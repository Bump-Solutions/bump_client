import { ROUTES } from "../../routes/routes";
import { AnimatePresence } from "framer-motion";
import { ProductListModel } from "../../models/productModel";
import { useProfile } from "../../hooks/profile/useProfile";
import { useLikeProduct } from "../../hooks/product/useLikeProduct";
import { useUnlikeProduct } from "../../hooks/product/useUnlikeProduct";
import { useSaveProduct } from "../../hooks/product/useSaveProduct";
import { useUnsaveProduct } from "../../hooks/product/useUnsaveProduct";
import { useToggle } from "../../hooks/useToggle";
import { useLongPress } from "react-use";
import { toast } from "sonner";
import { buildListPriceLabels } from "../../utils/pricing";

import { MouseEvent, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import Carousel from "./Carousel";
import Badges from "../../components/Badges";
import ProductContextMenu from "./ProductContextMenu";
import Delete from "./Delete";

import {
  Bookmark,
  EllipsisVertical,
  Heart,
  Images,
  Percent,
} from "lucide-react";

interface ProductListItemProps {
  product: ProductListModel;
}

const ProductListItem = ({ product }: ProductListItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isOwnProfile } = useProfile();

  const [isContextMenuOpen, toggleContextMenu] = useToggle(false);
  const [isDeleteOpen, toggleDelete] = useToggle(false);

  useEffect(() => {
    document.body.style.overflow = isContextMenuOpen ? "hidden" : "auto";
    document.body.style.pointerEvents = isContextMenuOpen ? "none" : "auto";

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.pointerEvents = "auto";
    };
  }, [isContextMenuOpen]);

  const onLongPress = () => {
    toggleContextMenu(true);
  };

  const longPressEvent = useLongPress(onLongPress, {
    isPreventDefault: true,
    delay: 500,
  });

  const likeMutation = useLikeProduct();
  const unlikeMutation = useUnlikeProduct();

  const saveMutation = useSaveProduct();
  const unsaveMutation = useUnsaveProduct();

  const handleLike = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();

    if (!product.liked) {
      if (likeMutation.isPending) return;
      const likePromise = likeMutation.mutateAsync({
        product,
        ownerId: product.userId, // TODO
      });

      toast.promise(likePromise, {
        loading: "Kedvelés...",
        success: () => (
          <span>
            Kedveltél egy{" "}
            <Link
              target='_blank'
              className='link fc-green-600 underline fw-700'
              to={ROUTES.PRODUCT(product.id).ROOT}>
              terméket.
            </Link>
          </span>
        ),
        error: (err) => "Hiba történt a termék kedvelése során.",
      });
    } else {
      if (unlikeMutation.isPending) return;
      unlikeMutation.mutateAsync({ product, ownerId: product.userId });
    }
  };

  const handleSave = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();

    if (!product.saved) {
      if (saveMutation.isPending) return;
      const savePromise = saveMutation.mutateAsync({
        product,
        ownerId: product.userId,
      });

      toast.promise(savePromise, {
        loading: "Mentés...",
        success: () => (
          <span>
            Elmentettél egy{" "}
            <Link
              target='_blank'
              className='link fc-green-600 underline fw-700'
              to={ROUTES.PRODUCT(product.id).ROOT}>
              terméket.
            </Link>
          </span>
        ),
        error: (err) => "Hiba történt a termék mentése során.",
      });
    } else {
      if (unsaveMutation.isPending) return;
      unsaveMutation.mutateAsync({ product, userId: product.userId });
    }
  };

  return (
    <>
      <Delete
        product={product}
        isOpen={isDeleteOpen}
        close={() => toggleDelete(false)}
      />

      <li className='product__item'>
        <AnimatePresence mode='wait'>
          {isContextMenuOpen && (
            <ProductContextMenu
              product={product}
              toggleContextMenu={toggleContextMenu}
              toggleDelete={toggleDelete}
            />
          )}
        </AnimatePresence>

        <Link to={ROUTES.PRODUCT(product.id).ROOT} {...longPressEvent}>
          <div className='product__item-header'>
            <span
              className='product__item-actions'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleContextMenu(true);
              }}>
              <EllipsisVertical strokeWidth={3} />
            </span>

            {isOwnProfile && !product.discountedPrice && (
              <span
                className='product__item-actions discount'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(ROUTES.PRODUCT(product.id).DISCOUNT, {
                    state: { background: location },
                  });
                }}>
                <Percent />
              </span>
            )}

            {Object.keys(product.badges).length > 0 && (
              <Badges badges={product.badges} />
            )}

            {product.images.length > 0 ? (
              <Carousel images={product.images} />
            ) : (
              <Images className='svg-48 fc-gray-600' />
            )}
          </div>

          <div className='product__item-content'>
            <div className='item__title'>
              <h3>{product.title}</h3>

              <span
                onClick={handleLike}
                className={`${product.liked ? "liked" : ""}`}>
                <Heart className='svg-18' />
                {product.likes >= 1000
                  ? `${Math.floor(product.likes / 1000)}k`
                  : product.likes}
              </span>

              <span
                onClick={handleSave}
                className={`${product.saved ? "saved" : ""}`}>
                <Bookmark className='svg-18' />
                {product.saves >= 1000
                  ? `${Math.floor(product.saves / 1000)}k`
                  : product.saves}
              </span>
            </div>

            <div className='item__desc'>
              <p>{product.condition}</p>
            </div>

            <div className='item__size'>
              <span>{product.size || "Több méretben"}</span>
            </div>

            <div className='item__price'>
              {(() => {
                const { origLabel, discLabel } = buildListPriceLabels({
                  minPrice: product.minPrice ?? null,
                  price: product.price ?? null,
                  discountedMinPrice: product.discountedPrice ?? null, // ha a backend már adta
                  // Ha a listában nincs percent, hagyd null-on — a util a discountedPrice-t fogja előnyben részesíteni.
                  discountPercent: null,
                  hasMultipleSizes: product.itemsCount > 1,
                });

                return (
                  <>
                    {discLabel && <span className='discount'>{discLabel}</span>}
                    <span className='price__original'>{origLabel}</span>
                  </>
                );
              })()}
            </div>
          </div>
        </Link>
      </li>
    </>
  );
};

export default ProductListItem;
