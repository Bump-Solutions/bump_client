import {
  privateRoutes,
  publicRoutes,
  errorRoutes,
  modalRoutes,
} from "./routes/Routing";

import { Suspense } from "react";
import { Routes, useLocation } from "react-router";

import Fallback from "./components/Fallback";

const App = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <Suspense fallback={<Fallback />}>
      {/* Main Routes */}
      <Routes location={background || location}>
        {/* Public Routes */}
        {publicRoutes()}

        {/* Private Routes */}
        {privateRoutes()}

        {/* Catch all */}
        {errorRoutes()}
      </Routes>

      {/* Modal Routes */}
      {background && <Routes>{modalRoutes(background)}</Routes>}
    </Suspense>
  );
};

export default App;
