import "../../assets/css/search.css";
import { ENUM } from "../../utils/enum";
import { useRef } from "react";
import { useTitle } from "react-use";
import { useNavigate } from "react-router";
import { useMediaQuery } from "react-responsive";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../../hooks/useClickOutside";

import Drawer from "../../components/Drawer";
import SearcContent from "./SearchContent";

const Search = () => {
  useTitle(`Találd meg legújabb sneakered - ${ENUM.BRAND.NAME}`);

  const navigate = useNavigate();
  const isMobile = useMediaQuery({
    query: `(max-width: ${ENUM.MEDIA_MOBILE}px)`,
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: modalRef,
    callback: () => navigate(-1),
  });

  return (
    <AnimatePresence mode='wait'>
      {isMobile ? (
        <Drawer
          className='search'
          close={() => navigate(-1)}
          dragVisible={false}>
          <SearcContent />
        </Drawer>
      ) : (
        <motion.section
          className='modal__wrapper dark'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}>
          <motion.div ref={modalRef} className='modal search'>
            <SearcContent />
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default Search;
