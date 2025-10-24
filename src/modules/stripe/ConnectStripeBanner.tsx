import "../../assets/css/stripe.css";
import { ROUTES } from "../../routes/routes";
import { useAuthWithMeta } from "../../hooks/auth/useAuthWithMeta";
import { Link } from "react-router";
import { useState, MouseEvent } from "react";

import StripeGradient from "./StripeGradient";
import Button from "../../components/Button";

import { ArrowUpRight, MoveRight } from "lucide-react";

const ConnectStripeBanner = () => {
  const { meta } = useAuthWithMeta();
  const [loading, setLoading] = useState(false);

  // If Stripe is already connected, do not show the banner
  if (meta?.accountCapabilities?.stripe.connected) return null;

  const handleConnect = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      window.open(ROUTES.HOME, "_blank");
      setLoading(false);
    }, 1000);
  };

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
          <Button
            className='primary'
            onClick={handleConnect}
            loading={loading}
            text=' Csatlakozás most'>
            <MoveRight />
          </Button>
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
