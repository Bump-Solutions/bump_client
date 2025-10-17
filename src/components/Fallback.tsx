import Spinner from "./Spinner";

const Fallback = () => {
  console.log("Rendering Fallback");

  return (
    <section className='fallback'>
      <Spinner />
    </section>
  );
};

export default Fallback;
