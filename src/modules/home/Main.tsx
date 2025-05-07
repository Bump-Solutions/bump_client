import "../../assets/css/main.css";

import { Outlet } from "react-router";

import Navbar from "../navigation/Navbar";

const Main = () => {
  return (
    <div className='main'>
      <Navbar />
      <main className='main__body'>
        <Outlet />
      </main>
    </div>
  );
};

export default Main;
