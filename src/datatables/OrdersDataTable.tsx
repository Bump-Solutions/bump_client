import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import { OrderModel, OrdersPageModel } from "../models/orderModel";
import { ROUTES } from "../routes/routes";
import { displayUuid } from "../utils/functions";
import { isToday, MS, pad } from "../utils/time";
import { useState } from "react";
import { useHarmonicIntervalFn } from "react-use";
import { ORDER_STATE_LABELS, ORDER_STATE_VARIANTS } from "../utils/mappers";

import DataTable from "../components/DataTable";
import Image from "../components/Image";
import Tooltip from "../components/Tooltip";

import { EllipsisVertical, Gem } from "lucide-react";

interface RemainingTimeCellProps {
  expiresAt: string;
}

interface OrdersDataTableProps {
  data: OrdersPageModel;
  pageSize: number;
  pageIndex0: number; // 0-based index
  onPageChange: (pi0: number, ps: number) => void; // pageIndex0: 0-based index
}

const RemainingTimeCell = ({ expiresAt }: RemainingTimeCellProps) => {
  // NOTE(perf / future):
  // Jelenleg soronként fut egy saját másodperces tick (useHarmonicIntervalFn, 1000 ms).
  // Ez tipikusan rendben van ~20–30 sornál. Ha a rendeléslista mérete nő (pl. 100+ sor),
  // vagy CPU/akku terhelés látszik, érdemes egy közös, megosztott “global tick”-re váltani
  // (Context + Provider), és a sorok csak a context.now-t olvassák. Előnye: 1 timer az
  // egész táblára, kevesebb render és jobb erőforrás-használat. Inaktív böngészőfülnél
  // a frissítést célszerű szüneteltetni (Page Visibility API).
  //
  // TODO(perf, ha szükséges lesz):
  //  1) Készíts <TimeProvider> komponenst (harmonikus 1000 ms tick, visibility-aware).
  //  2) Vezess be useNow() hookot, ami a context.now-t adja vissza.
  //  3) Cseréld le a soronkénti useHarmonicIntervalFn-t a context.now használatára.
  //  4) Nagy listáknál fontold meg a virtualizációt (pl. @tanstack/react-virtual).

  const [now, setNow] = useState(() => Date.now());

  // diff a render pillanatában – ennek alapján döntjük el az ütemet is
  const exp = new Date(expiresAt).getTime();
  const diff = Math.max(0, exp - now);

  // ≥1h: percenként frissítünk; <1h: másodpercenként (drift-mentes)
  useHarmonicIntervalFn(
    () => setNow(Date.now()),
    diff >= MS.hour ? 60_000 : 1_000
  );

  const days = Math.floor(diff / MS.day);
  const hours = Math.floor((diff % MS.day) / MS.hour);
  const minutes = Math.floor((diff % MS.hour) / MS.min);
  const seconds = Math.floor((diff % MS.min) / MS.sec);

  let label = "-";
  let className = "";
  if (diff > 0) {
    if (days >= 2) {
      label = `${days} nap`;
      className = "fc-grey-900 fw-600";
    } else if (days === 1) {
      // 24–48h: "1 nap Y óra"
      label = `1 nap ${hours} óra`;
      className = "fc-yellow-500 fw-700";
    } else if (diff >= MS.hour) {
      // 1–24h: "H óra M perc"
      label = `${hours} óra ${minutes} perc`;
      className = "fc-orange-500 fw-700";
    } else {
      // <1h: "MM:SS" (óra elhagyva)
      label = `${pad(minutes)}:${pad(seconds)}`;
      className = "fc-red-500 fw-700";
    }
  }

  return (
    <time
      dateTime={new Date(expiresAt).toISOString()}
      aria-live='polite'
      className={className}>
      {label}
    </time>
  );
};

const OrdersDataTable = ({
  data,
  pageSize,
  pageIndex0,
  onPageChange,
}: OrdersDataTableProps) => {
  const orders = data.orders;
  console.log(data);

  const columns: ColumnDef<OrderModel, any>[] = [
    {
      id: "uuid",
      accessorFn: (row) => displayUuid(row.uuid), // a globális szűréshez
      header: "Rendelés #",
      enableSorting: false,
      cell: ({ row, getValue }) => {
        const uuid = row.original.uuid;
        const pretty = getValue<string>();

        return (
          <Link to={ROUTES.ORDER(uuid)} className='link blue'>
            {pretty}
          </Link>
        );
      },
    },
    {
      id: "createdAt",
      accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(), // a globális szűréshez
      header: "Létrehozva",
      enableSorting: true,
      cell: ({ getValue }) => {
        const d = new Date(getValue<string>());

        return (
          <div>
            <time dateTime={d.toISOString()}>{d.toLocaleDateString()}</time>
            {isToday(d) && <span>Új</span>}
          </div>
        );
      },
    },
    {
      id: "party",
      accessorFn: (row) => row.party.username, // a globális szűréshez
      header: "Partner",
      enableSorting: false,
      cell: ({ row }) => {
        const party = row.original.party;
        const isSeller = row.original.isSeller; // If the current user is the seller in this order

        return (
          <Link
            className='dt-party'
            to={ROUTES.PROFILE(party.username).ROOT}
            target='_blank'>
            <div className='dt-party-inner'>
              {party.profilePicture && (
                <Image
                  src={party.profilePicture}
                  alt={party.username.slice(0, 2).toUpperCase()}
                />
              )}
              <div className='dt-party-info'>
                <span>{party.username}</span>
                {isSeller ? <span>Vevő</span> : <span>Eladó</span>}
              </div>
            </div>

            {isSeller && (
              <Tooltip
                content='Te vagy az eladó'
                showDelay={250}
                placement='top'>
                <Gem className='svg-16 fc-green-500' />
              </Tooltip>
            )}
          </Link>
        );
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Lejár",
      enableSorting: true,
      cell: ({ row }) => {
        const expiresAt = row.original.expiresAt;
        const hasTodo = row.original.validActions.length > 0;

        return (
          <>
            <RemainingTimeCell expiresAt={expiresAt} />
            {hasTodo && (
              <>
                <br />
                <span className='fc-pink-500 fw-600 fs-12'>
                  Teendő elérhető
                </span>
              </>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "state",
      header: "Státusz",
      enableSorting: false,
      cell: ({ row, getValue }) => {
        const state = Number(getValue<string>());
        const isSeller = row.original.isSeller;

        return (
          <span className={`badge ${ORDER_STATE_VARIANTS(isSeller)[state]}`}>
            {ORDER_STATE_LABELS[state]}
          </span>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Részletek",
      cell: ({ row }) => (
        <Link
          to={ROUTES.ORDER(row.original.uuid)}
          className='button secondary sm w-fc'>
          <EllipsisVertical />
          Részletek
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      // szerver oldali lapozás
      manualPagination
      pageCount={data.totalPages}
      rowCount={data.count}
      pageIndex0={pageIndex0} // 0-based index
      pageSize={pageSize}
      onPageChange={onPageChange} // Orders: setPage(pageIndex + 1)
      // Global filter
      enableGlobalFilter
      globalFilterColumns={["uuid", "party", "createdAt"]}
      globalFilterPlaceholder='Keresés: rendelés #, partner, létrehozva...'
      className='dt-orders'
      footerVisible={false}
    />
  );
};

export default OrdersDataTable;
