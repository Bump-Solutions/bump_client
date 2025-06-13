import { ROUTES } from "../../routes/routes";
import { Link } from "react-router";
import { FacetProps } from "../../hooks/product/useFacetedSearch";
import { CONDITION_LABELS, GENDER_LABELS } from "../../utils/mappers";

import Chip from "../../components/Chip";

const FacetedSearch = ({
  genders,
  sizes,
  conditions,
  selectedGender,
  selectedSize,
  selectedCondition,
  setGender,
  setSize,
  setCondition,
}: FacetProps) => {
  return (
    <div className='product__filters'>
      <div className='filter'>
        <h4>Elérhető nemek</h4>
        <div className='chips__wrapper'>
          {genders.map((gender) => (
            <Chip
              key={gender}
              label={GENDER_LABELS[gender]}
              selected={selectedGender === gender}
              onClick={() => setGender(gender)}
            />
          ))}
        </div>
      </div>

      <div className='filter'>
        {selectedGender ? (
          <>
            <h4>
              Elérhető méretek{" "}
              {selectedGender && (
                <span className='fc-light'>
                  - {GENDER_LABELS[selectedGender]}
                </span>
              )}
            </h4>
            <div className='chips__wrapper'>
              {sizes.map((size) => (
                <Chip
                  key={size}
                  label={`EU ${size}`}
                  selected={selectedSize === size}
                  onClick={() => setSize(size)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <h4>Elérhető méretek</h4>
            <p className='fc-light fs-14'>Válassz nemet a szűréshez ...</p>
          </>
        )}
      </div>

      <div className='filter'>
        {selectedSize ? (
          <>
            <h4>
              Elérhető állapotok{" "}
              {selectedSize && (
                <span className='fc-light'>- EU {selectedSize}</span>
              )}
            </h4>
            <div className='chips__wrapper'>
              {conditions.map((condition) => (
                <Chip
                  key={condition}
                  label={CONDITION_LABELS[condition]}
                  selected={selectedCondition === condition}
                  onClick={() => setCondition(condition)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <h4>
              Elérhető állapotok{" "}
              <Link to={ROUTES.HOME} target='_blank' className='link blue p-0'>
                - Tudj meg többet
              </Link>
            </h4>
            <p className='fc-light fs-14'>Válassz méretet a szűréshez ...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FacetedSearch;
