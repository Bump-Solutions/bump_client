import { ROUTES } from "../../../routes/routes";
import { Link } from "react-router";

import Button from "../../../components/Button";

import { Pencil, WandSparkles } from "lucide-react";

const UserInteractionsOwn = () => {
  return (
    <div className='user__interactions own'>
      <div className='user__interaction--edit'>
        <Link className='button primary' to={ROUTES.SETTINGS.ROOT}>
          <Pencil />
          Szerkesztés
        </Link>
      </div>
      {/* IF USER IS NOT PRO */}
      <div className='user__interaction--pro'>
        <Button className='secondary blue' text='Próbáld ki a Pro-t'>
          <WandSparkles />
        </Button>
      </div>
    </div>
  );
};

export default UserInteractionsOwn;
