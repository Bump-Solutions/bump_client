import { JSX } from "react";

import PackageList from "./PackageList";

interface CartNote {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string | JSX.Element;
}

const NOTES: CartNote[] = [
  {
    type: "info",
    title: "Hogyan működik a kosár? 🛒",
    message: (
      <>
        Itt látod az eladónként létrehozott termékcsomagjaidat. A vásárlás
        eladónként, <b>közvetlen kapcsolatfelvétellel</b> történik.
      </>
    ),
  },
  {
    type: "success",
    title: "Tipp: 💡",
    message:
      "A végösszeg tájékoztató; a szállítás és az árak eladónként egyeztetendők.",
  },
  {
    type: "warning",
    title: "Fontos! ⚠️",
    message: (
      <>
        A kosárban lévő tételek nincsenek lefoglalva, a készlet változhat.{" "}
        <b>Az árak tájékoztató jellegűek.</b>
      </>
    ),
  },
];

interface CartContentProps {
  searchKey: string;
}

const CartContent = ({ searchKey }: CartContentProps) => {
  return (
    <div className='cart__content'>
      <div className='notes'>
        {NOTES.map((note, index) => (
          <blockquote key={index} className={`note ${note.type}`}>
            <strong>{note.title}</strong>
            <p>{note.message}</p>
          </blockquote>
        ))}
      </div>

      {/*
      <p className='fc-gray-700 mb-2'>
        <strong>Fontos!</strong> A kosárban lévő tételek nincsenek lefoglalva, a
        készlet változhat. <strong>Az árak tájékoztató jellegűek.</strong>{" "}
        <br />
        Lépj kapcsolatba az eladóval most, és pontosítsátok a részleteket!
      </p>
        */}

      <PackageList searchKey={searchKey} />
    </div>
  );
};

export default CartContent;
