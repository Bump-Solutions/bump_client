import { ENUM } from "../utils/enum";

interface HelmetProps {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  schemaMarkup?: Record<string, any>;
  keywords?: string;
}

const DEFAULT = {
  title: `${ENUM.BRAND.NAME} - Online Sneaker Adok-Veszek`,
  description: "",
  canonical: ENUM.BRAND.URL,
  keywords:
    "sneaker, cipő, piac, piactér, eladás, vásárlás, adok-veszek, streetwear, hypebeast, sneakerhead, bump",
};

const Helmet = ({
  title = DEFAULT.title,
  description = DEFAULT.description,
  canonical = DEFAULT.canonical,
  image,
  schemaMarkup,
  keywords = DEFAULT.keywords,
}: HelmetProps) => {
  return (
    <>
      <title>{title}</title>

      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      {image && <meta property='og:image' content={image} />}
      <meta property='og:url' content={canonical} />
      <meta property='og:type' content='website' />

      {/* Twitter */}
      <meta property='twitter:title' content={title} />
      <meta property='twitter:description' content={description} />
      {image && <meta property='twitter:image' content={image} />}

      {schemaMarkup && (
        <script type='application/ld+json'>
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </>
  );
};

export default Helmet;
