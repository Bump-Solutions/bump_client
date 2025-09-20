import { Search } from "lucide-react";
import { Link, useLocation } from "react-router";
import { ROUTES } from "../../routes/routes";

const NavSearch = () => {
  const location = useLocation();

  return (
    <div className='navbar__search'>
      <Link to={ROUTES.SEARCH} state={{ background: location }}>
        <Search />
        <span className='fw-400 truncate'>
          Találd meg legújabb sneakered...
        </span>
      </Link>
    </div>
  );
};

export default NavSearch;
