import { ROUTES } from "../../routes/routes";
import { ENUM } from "../../utils/enum";
import { useNavigate, useParams } from "react-router";
import { ReportType } from "../../types/report";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ReportForm from "./ReportForm";
import Drawer from "../../components/Drawer";
import Button from "../../components/Button";

import { X } from "lucide-react";

const REPORT_TYPES: ReportType[] = ["product", "user"];

const Report = () => {
  const { type, id } = useParams<{ type: ReportType; id: string }>();

  const navigate = useNavigate();
  const isMobile = useMediaQuery({
    query: `(max-width: ${ENUM.MEDIA_MOBILE}px)`,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!REPORT_TYPES.includes(type)) {
    navigate(ROUTES.NOTFOUND, {
      replace: true,
    });
    return null;
  }

  return (
    <AnimatePresence mode='wait'>
      {isMobile ? (
        <Drawer className='report' close={() => navigate(-1)}>
          <ReportForm type={type} id={id} />
        </Drawer>
      ) : (
        <motion.section
          className='modal__wrapper'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}>
          <motion.div className='modal report'>
            <Button className={`secondary close`} onClick={() => navigate(-1)}>
              <X />
            </Button>

            <ReportForm type={type} id={id} />
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default Report;
