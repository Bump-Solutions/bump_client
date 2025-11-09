import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useParams } from "react-router";
import { ROUTES } from "../../routes/routes";
import { ReportType } from "../../types/report";
import { ENUM } from "../../utils/enum";

import Button from "../../components/Button";
import Drawer from "../../components/Drawer";
import ReportForm from "./ReportForm";

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

  if (type === undefined || !REPORT_TYPES.includes(type)) {
    navigate(ROUTES.NOTFOUND, { replace: true });
    return null;
  }

  return (
    <AnimatePresence mode='wait'>
      {isMobile ? (
        <Drawer className='report' close={() => navigate(-1)}>
          <ReportForm id={id} type={type} />
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

            <ReportForm id={id} type={type} />
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default Report;
