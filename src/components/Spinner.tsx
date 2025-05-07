import { Loader } from "lucide-react";

type SpinnerProps = {
  size?: number;
};

const Spinner = ({ size = 32 }: SpinnerProps) => {
  return (
    <span className='spinner'>
      <Loader className={`svg-${size}`} />
    </span>
  );
};

export default Spinner;
