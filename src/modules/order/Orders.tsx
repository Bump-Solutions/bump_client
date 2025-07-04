import "../../assets/css/order.css";
import { useTitle } from "react-use";
import { ENUM } from "../../utils/enum";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components/DataTable";

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}

const sampleData: Person[] = [
  { id: 1, firstName: "Anna", lastName: "Nagy", age: 28 },
  { id: 2, firstName: "Béla", lastName: "Kovács", age: 34 },
  { id: 3, firstName: "Csaba", lastName: "Tóth", age: 22 },
];

const sampleColumns: ColumnDef<Person, any>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "firstName", header: "Keresztnév" },
  { accessorKey: "lastName", header: "Vezetéknév" },
  { accessorKey: "age", header: "Életkor" },
];

const Orders = () => {
  useTitle(`Rendelések - ${ENUM.BRAND.NAME}`);

  return (
    <section className='orders'>
      <DataTable
        data={sampleData}
        columns={sampleColumns}
        enableGlobalFilter
        renderRowExpanded={(row) => (
          <div style={{ padding: "1rem" }}>
            <strong>Részletek:</strong>
            <p>{`Név: ${row.firstName} ${row.lastName}`}</p>
            <p>{`Kor: ${row.age} év`}</p>
          </div>
        )}
        footerVisible={false}
      />
    </section>
  );
};

export default Orders;
