import "../../assets/css/authentication.css";

import { ENUM } from "../../utils/enum";
import { Outlet } from "react-router";

import Hero from "./Hero";

const Authentication = () => {
  return (
    <>
      <section className='authentication'>
        <Hero />
        <div className='authentication__wrapper'>
          <h1 className='title--brand'>{ENUM.BRAND.NAME}</h1>
          <Outlet />
        </div>
      </section>
    </>
  );
};

export default Authentication;
