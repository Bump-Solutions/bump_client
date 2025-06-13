import { FacetProps } from "../../hooks/product/useFacetedSearch";

import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";

import { Bookmark, Mail, ShoppingBag } from "lucide-react";

const ProductActions = ({ quantity, filtered, filteredCount }: FacetProps) => {
  const isDisabled = quantity < 1 || filteredCount === 0;

  return (
    <div className='product__actions'>
      <div className='product__action--save'>
        <Tooltip content='Mentés' showDelay={750} placement='top'>
          <Button className='secondary'>
            <Bookmark />
          </Button>
        </Tooltip>
      </div>

      <div className='product__action--cart'>
        <Button className='primary' text='Kosárba' disabled={isDisabled}>
          <ShoppingBag />
        </Button>
      </div>

      <div className='product__action--contact'>
        <Button
          className='secondary'
          text='Kapcsolatfelvétel'
          disabled={isDisabled}>
          <Mail />
        </Button>
      </div>
    </div>
  );
};

export default ProductActions;
