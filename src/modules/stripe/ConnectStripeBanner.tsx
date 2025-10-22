import "../../assets/css/stripe.css";
import { ROUTES } from "../../routes/routes";
import { useAuth } from "../../hooks/auth/useAuth";
import { Link } from "react-router";

import StripeGradient from "./StripeGradient";

import { ArrowUpRight, MoveRight } from "lucide-react";

const ConnectStripeBanner = () => {
  const { auth } = useAuth();

  // If Stripe is already connected, do not show the banner
  if (auth?.accountCapabilities?.stripe.connected) return null;

  return (
    <section
      className='stripe-banner'
      role='region'
      aria-label='Csatlakozz a Stripe-hoz'>
      <div className='gradient__wrapper'>
        <StripeGradient />
      </div>

      <article>
        <h4>Indítsd el a kifizetéseket még ma!</h4>
        <p>
          Csatlakozz a <strong>Stripe Connecthez</strong>, hogy a kifizetések
          közvetlenül a bankszámládra érkezzenek, jogszabálykövető KYC (Know
          Your Customer) folyamat mellett. A Stripe végzi az azonosítást és a
          dokumentumkéréseket – gyors, biztonságos indulás.
        </p>
        <p>
          <strong>Figyelem!</strong> Ahhoz, hogy eladóként üzleteket tudj
          folytatni másokkal, össze kell kapcsolnod a fiókodat a Stripe
          Connecttel.
        </p>

        <div className='btngroup'>
          <Link to={ROUTES.HOME} className='button primary'>
            <MoveRight />
            Csatlakozás most
          </Link>
        </div>

        <div className='more'>
          <Link to={ROUTES.HOME} className='link black no-anim mb-0'>
            Tudj meg többet <ArrowUpRight />
          </Link>
        </div>
      </article>
    </section>
  );
};

export default ConnectStripeBanner;
