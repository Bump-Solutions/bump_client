import { ENUM } from "../../utils/enum";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import Gallery from "./Gallery";

interface FooterLink {
  label: string;
  href: string;
}

const FOOTER_LINKS: FooterLink[] = [
  {
    label: "Alkalmazás",
    href: "",
  },
  {
    label: "Adatvédelem",
    href: "",
  },
  {
    label: "Feltételek",
    href: "",
  },
  {
    label: "Kapcsolat",
    href: "",
  },
];

const Hero = () => {
  const [shuffledBackgroundImages, setShuffledBackgroundImages] = useState<
    string[]
  >([]);
  const currentYear = new Date().getFullYear();

  const shuffleArray = (array: string[]): string[] => {
    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
  };

  useEffect(() => {
    // Dynamically import all .jpg files in the specified folder
    const images = import.meta.glob(
      "../../assets/images/background/small/*.jpg",
      { eager: true }
    );

    // Convert the imported files to an array of paths
    const backgroundImages = Object.values(images).map(
      (mod: any) => mod.default || mod
    );

    // Shuffle and update the state
    const shuffledImages = shuffleArray(backgroundImages);
    setShuffledBackgroundImages(shuffledImages);
  }, []);

  return (
    <div className='hero'>
      <Gallery images={shuffledBackgroundImages} columns={9} />

      <div className='hero__wrapper'>
        <h1 className='hero__title'>{ENUM.BRAND.NAME}</h1>
        <p className='hero__subtitle'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
          repellat quam dicta at necessitatibus ipsa enim, consequatur
          dignissimos veniam reiciendis?
        </p>
        <footer className='hero__footer'>
          <h4>
            &copy;{currentYear}&ensp;<span>Magyarország</span>
          </h4>
          <div className='hero__links'>
            {FOOTER_LINKS.map((link, index) => (
              <Link key={index} to={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Hero;
