import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import { OrderModel, OrdersPageModel } from "../models/orderModel";
import { ROUTES } from "../routes/routes";
import { displayUuid } from "../utils/functions";

import DataTable from "../components/DataTable";

interface OrdersDataTableProps {
  data: OrdersPageModel;
}

const OrdersDataTable = ({ data }: OrdersDataTableProps) => {
  console.log("OrdersDataTable data:", data);

  const orders = data.orders;

  const columns: ColumnDef<OrderModel, any>[] = [
    {
      accessorKey: "uuid",
      header: "Rendelés #",
      enableSorting: true,
      cell: ({ getValue }) => (
        <Link to={ROUTES.ORDER(getValue<string>())}>
          {displayUuid(getValue<string>())}
        </Link>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Létrehozva",
      enableSorting: true,
      cell: ({ getValue }) => {
        const d = new Date(getValue<string>());
        return <time dateTime={d.toISOString()}>{d.toLocaleDateString()}</time>;
      },
    },
    {
      accessorKey: "party",
      header: "Partner",
      enableSorting: false,
      cell: ({ row }) => {
        const party = row.original.party;
        return (
          <div>
            {party.profilePicture && (
              <img
                src={party.profilePicture}
                alt={party.username.slice(0, 2).toUpperCase()}
              />
            )}
            <span>{party.username}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "state",
      header: "Státusz",
      enableSorting: false,
      cell: ({ getValue }) => {
        const state = getValue<string>();
        return <span>{state}</span>;
      },
    },
    {
      accessorKey: "acttion",
      header: "",
      cell: ({ row }) => (
        <Link to={ROUTES.ORDER(row.original.uuid)}>Részletek</Link>
      ),
    },
  ];

  return <DataTable data={orders} columns={columns} className='dt-orders' />;
};

export default OrdersDataTable;
