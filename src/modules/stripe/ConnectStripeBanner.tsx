import { MouseEvent } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import "../../assets/css/stripe.css";
import { useAuthWithMeta } from "../../hooks/auth/useAuthWithMeta";
import { useStripeConnect } from "../../hooks/stripe/useStripeConnect";
import { ROUTES } from "../../routes/routes";

import Button from "../../components/Button";
import StripeGradient from "./StripeGradient";

import { ArrowUpRight, MoveRight } from "lucide-react";

const ConnectStripeBanner = () => {
  const { meta } = useAuthWithMeta();
  const { refetch, isFetching } = useStripeConnect();

  const handleConnect = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const popup = window.open("about:blank", "_blank"); // TODO: /redirecting instead of about:blank with a loading spinner
    if (popup) popup.opener = null;

    try {
      const result = await refetch({ throwOnError: true });
      const url = result.data;

      if (!url) throw new Error("Missing Stripe redirect URL");

      if (popup) {
        popup.location.assign(url);
        popup.focus();
      } else {
        window.location.assign(url);
      }
    } catch (error) {
      popup?.close();
      toast.error(
        "Nem sikerült csatlakozni a Stripe-hoz. Kérlek, próbáld újra később.",
      );
    }
  };

  // If Stripe is already connected, do not show the banner
  if (meta?.accountCapabilities?.stripe.connected) return null;

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
            loading={isFetching}
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
