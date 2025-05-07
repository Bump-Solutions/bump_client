import { ROUTES } from "../../routes/routes";
import { Link } from "react-router";

const NavMenuMobile = () => {
  return (
    <div className='navbar__menu--mobile'>
      <Link to={ROUTES.HOME} className='fw-800'>
        bump.
      </Link>
    </div>
  );
};

export default NavMenuMobile;
