import { ROUTES } from "../../routes/routes";
import { IProduct, Inventory } from "../../types/product";
import { AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../utils/queryKeys";

import { useProfile } from "../../hooks/profile/useProfile";
import { useLikeProduct } from "../../hooks/product/useLikeProduct";
import { useUnlikeProduct } from "../../hooks/product/useUnlikeProduct";
import { useSaveProduct } from "../../hooks/product/useSaveProduct";
import { useUnsaveProduct } from "../../hooks/product/useUnsaveProduct";
import { useToggle } from "../../hooks/useToggle";
import { useLongPress } from "react-use";

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
  product: IProduct;
}

const ProductListItem = ({ product }: ProductListItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isOwnProfile } = useProfile();
  const queryClient = useQueryClient();

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

  const likeMutation = useLikeProduct((response, productId) => {
    queryClient.setQueriesData(
      {
        predicate(query) {
          const key = query.queryKey[0];
          switch (key) {
            case QUERY_KEY.listProducts:
              return query.queryKey[1] === user?.id;
            case QUERY_KEY.listSavedProducts:
              return true;
            default:
              return false;
          }
        },
      },
      (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page: Inventory) => ({
            ...page,
            products: page.products.map((product: IProduct) => {
              if (product.id === productId) {
                return {
                  ...product,
                  liked: true,
                  likes: product.likes + 1,
                };
              }
              return product;
            }),
          })),
        };
      }
    );
  });

  const unlikeMutation = useUnlikeProduct((response, productId) => {
    queryClient.setQueriesData(
      {
        predicate(query) {
          const key = query.queryKey[0];
          switch (key) {
            case QUERY_KEY.listProducts:
              return query.queryKey[1] === user?.id;
            case QUERY_KEY.listSavedProducts:
              return true;
            default:
              return false;
          }
        },
      },
      (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page: Inventory) => ({
            ...page,
            products: page.products.map((product: IProduct) => {
              if (product.id === productId) {
                return {
                  ...product,
                  liked: false,
                  likes: product.likes - 1,
                };
              }
              return product;
            }),
          })),
        };
      }
    );
  });

  const saveMutation = useSaveProduct((response, productId) => {
    queryClient.setQueryData(
      [QUERY_KEY.listProducts, user?.id],
      (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page: Inventory) => ({
            ...page,
            products: page.products.map((product: IProduct) => {
              if (product.id === productId) {
                return {
                  ...product,
                  saved: true,
                  saves: product.saves + 1,
                };
              }
              return product;
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

  const unsaveMutation = useUnsaveProduct((response, productId) => {
    queryClient.setQueryData(
      [QUERY_KEY.listProducts, user?.id],
      (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page: Inventory) => ({
            ...page,
            products: page.products.map((product: IProduct) => {
              if (product.id === productId) {
                return {
                  ...product,
                  saved: false,
                  saves: product.saves - 1,
                };
              }
              return product;
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
          products: page.products.filter(
            (product: IProduct) => product.id !== productId
          ),
        })),
      };
    });
  });

  const handleLike = (
    e: MouseEvent<HTMLSpanElement>,
    pid: IProduct["id"],
    isLiked: boolean
  ) => {
    e.preventDefault();

    if (!isLiked) {
      if (likeMutation.isPending) return;
      likeMutation.mutateAsync(pid);
    } else {
      if (unlikeMutation.isPending) return;
      unlikeMutation.mutateAsync(pid);
    }
  };

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

            {isOwnProfile && !product.discounted_price && (
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
              <Images className='svg-48 fc-light' />
            )}
          </div>

          <div className='product__item-content'>
            <div className='item__title'>
              <h3>{product.title}</h3>

              <span
                onClick={(e) => handleLike(e, product.id, product.liked)}
                className={`${product.liked ? "liked" : ""}`}>
                <Heart className='svg-18' />
                {product.likes >= 1000
                  ? `${Math.floor(product.likes / 1000)}k`
                  : product.likes}
              </span>

              <span
                onClick={(e) => handleSave(e, product.id, product.saved)}
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
              {product.discounted_price && (
                <span className='discount'>
                  {product.discounted_price} Ft
                  {product?.items_count! > 1 && "-tól"}
                </span>
              )}
              <span className='price__original'>
                {product.min_price || product.price} Ft
                {product?.items_count! > 1 && "-tól"}
              </span>
            </div>
          </div>
        </Link>
      </li>
    </>
  );
};

export default ProductListItem;
