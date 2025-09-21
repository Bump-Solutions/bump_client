import { useDeferredValue } from "react";
import { useCartSearch } from "../../hooks/cart/useSearchCart";

import PackageList from "./PackageList";

interface CartContentProps {
  searchKey: string;
}

const CartContent = ({ searchKey }: CartContentProps) => {
  const deferred = useDeferredValue(searchKey);
  const { filteredPackages, highlightIndex } = useCartSearch(deferred);

  return (
    <div className='cart__content'>
      <p className='fc-gray-700 mb-2'>
        <strong>Fontos!</strong> A kosárban lévő tételek nincsenek lefoglalva, a
        készlet változhat. <strong>Az árak tájékoztató jellegűek.</strong> Lépj
        kapcsolatba az eladóval most, és pontosítsátok a részleteket!
      </p>

      <PackageList
        filteredPackages={filteredPackages}
        highlightIndex={highlightIndex}
      />

      {/*
      <ul className='package__list'>
        {packages.map((pkg) => {
          const sid = pkg.seller.id;
          const expanded = open.has(sid);
          const btnId = `pkg-btn-${sid}`;
          const panelId = `pkg-panel-${sid}`;
          const subtotal = sellerSubtotal(pkg);

          return (
            <li key={sid} className={`pkg ${expanded ? "open" : ""}`}>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    id={panelId}
                    role='region'
                    aria-labelledby={btnId}
                    className='pkg__panel'
                    key='panel'
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    layout // finomítja a belső elrendezés animját
                  >
                    {Object.values(pkg.products).map(
                      (prod: CartProductModel) => (
                        <section className='pkg__product' key={prod.product.id}>
                          <Image
                            src={prod.product.image}
                            alt={prod.product.title}
                            placeholderColor='#212529'
                          />

                          <div className='pkg__product__meta'>
                            <div>
                              <Link
                                className='link black'
                                to={ROUTES.PRODUCT(prod.product.id).ROOT}
                                target='_blank'>
                                {prod.product.title}
                              </Link>
                              <span className='small'>
                                összesen {prod.items.length} tétel
                              </span>
                            </div>
                          </div>

                        </section>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
      */}
    </div>
  );
};

export default CartContent;
