import { forwardRef } from "react";

import { MoveRight } from "lucide-react";

interface MenuCommunityProps {
  onHoverOrTouch: (menu?: "browse" | "community") => void;
}

const MenuBrowse = forwardRef<HTMLDivElement, MenuCommunityProps>(
  ({ onHoverOrTouch }, ref) => {
    return (
      <div className='navbar__dropdown__wrapper'>
        <div
          ref={ref}
          className='navbar__dropdown'
          onMouseLeave={() => {
            onHoverOrTouch();
          }}>
          <h1 className='mb-1'>
            Légy a közösség tagja&nbsp;&nbsp;
            <MoveRight className='svg-26' />
          </h1>
        </div>
      </div>
    );
  }
);

export default MenuBrowse;
