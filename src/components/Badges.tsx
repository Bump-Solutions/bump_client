import { Badge, BadgeCollection } from "../models/productModel";
import { useToggle } from "../hooks/useToggle";

import { X } from "lucide-react";

interface BadgeProps {
  badge: Badge;
}

const BadgeComponent = ({ badge }: BadgeProps) => {
  return (
    <span className={`badge ${badge.type}`}>
      {badge.type === "discount" && "-"}
      {badge.text}
    </span>
  );
};

interface BadgesProps {
  badges: BadgeCollection;
  initialToggle?: boolean;
  showToggle?: boolean;
}

const Badges = ({
  badges,
  initialToggle = false,
  showToggle = true,
}: BadgesProps) => {
  const [showAll, toggleShowAll] = useToggle(initialToggle);

  const badgeArray: Badge[] = Object.values(badges)
    .filter(Boolean)
    .sort((a, b) => b.priority - a.priority); // filter out undefined values

  if (badgeArray.length === 0) return null;

  return (
    <div className='product__item-badges'>
      {showAll ? (
        <>
          {badgeArray.map((badge, index) => (
            <BadgeComponent key={index} badge={badge} />
          ))}

          {showToggle && badgeArray.length > 1 && (
            <span
              className='badge icon-only'
              onClick={(e) => {
                e.preventDefault();
                toggleShowAll(false);
              }}>
              <X />
            </span>
          )}
        </>
      ) : (
        <>
          {badgeArray[0] && <BadgeComponent badge={badgeArray[0]} />}

          {showToggle && badgeArray.length > 1 && (
            <span
              className='badge'
              onClick={(e) => {
                e.preventDefault();
                toggleShowAll(true);
              }}>
              +{badgeArray.length - 1}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default Badges;
