import "../../assets/css/follow.css";
import { ENUM } from "../../utils/enum";
import { ROUTES } from "../../routes/routes";
import { useMediaQuery } from "react-responsive";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useProfile } from "../../hooks/profile/useProfile";
import { useState, useEffect } from "react";
import { useToggle } from "../../hooks/useToggle";
import { AnimatePresence, motion } from "framer-motion";

import Drawer from "../../components/Drawer";
import Button from "../../components/Button";
import ConfirmUnfollow from "./ConfirmUnfollow";

import { X } from "lucide-react";

interface FollowProps {
  background: Location;
}

const Follow = ({ background }: FollowProps) => {
  const isMobile = useMediaQuery({
    query: `(max-width: ${ENUM.MEDIA_MOBILE}px)`,
  });
  const navigate = useNavigate();

  const { user } = useProfile();

  const [userToUnfollow, setUserToUnfollow] = useState(null);
  const [confirmUnfollow, toggleConfirmUnfollow] = useToggle(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [confirmUnfollow]);

  return (
    user && (
      <>
        <AnimatePresence mode='wait'>
          {isMobile ? (
            <Drawer
              close={() => navigate(background.pathname)}
              className='follow'>
              <h1 className='modal__title'>
                <NavLink
                  to={ROUTES.PROFILE(user.username).FOLLOWERS}
                  state={{ background: background }}
                  className='link black'>
                  Követők
                </NavLink>
                <NavLink
                  to={ROUTES.PROFILE(user.username).FOLLOWINGS}
                  state={{ background: background }}
                  className='link black'>
                  Követések
                </NavLink>
              </h1>

              <Outlet context={{ toggleConfirmUnfollow, setUserToUnfollow }} />
            </Drawer>
          ) : (
            <motion.section
              className='modal__wrapper'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <motion.div className='modal follow'>
                <Button
                  className={`secondary close`}
                  onClick={() => navigate(background.pathname)}>
                  <X />
                </Button>

                <h1 className='modal__title'>
                  <NavLink
                    to={ROUTES.PROFILE(user.username).FOLLOWERS}
                    state={{ background: background }}
                    className='link black mr-2'>
                    Követők
                  </NavLink>
                  <NavLink
                    to={ROUTES.PROFILE(user.username).FOLLOWINGS}
                    state={{ background: background }}
                    className='link black'>
                    Követések
                  </NavLink>
                </h1>

                <Outlet
                  context={{ toggleConfirmUnfollow, setUserToUnfollow }}
                />
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        <ConfirmUnfollow
          userToUnfollow={userToUnfollow}
          setUserToUnfollow={setUserToUnfollow}
          isOpen={confirmUnfollow}
          close={toggleConfirmUnfollow}
        />
      </>
    )
  );
};

export default Follow;
