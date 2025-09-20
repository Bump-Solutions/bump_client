import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useClickOutside } from "../hooks/useClickOutside";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Fragment, ReactNode, useEffect, useRef, useState } from "react";

import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
} from "lucide-react";

interface DataTableProps<T extends object> {
  /** Adatsorozat a megjelenítéshez (kliens oldali mód) */
  data: T[];
  /** Oszlopdefiníciók TanStack Table formátumban */
  columns: ColumnDef<T, any>[];

  /** Kezdeti elemszám oldalanként (default: 10) */
  initialPageSize?: number;
  /** Választható elemszám opciók oldalanként */
  // pageSizeOptions?: number[];

  /** Globális keresőmező engedélyezése */
  enableGlobalFilter?: boolean;
  /** Ha megadott: csak ezekben az oszlopokban kerül végrehajtásra a globális keresés */
  globalFilterColumns?: (keyof T)[];
  globalFilterPlaceholder?: string;

  /** Kinyitható sorokhoz tetszőleges tartalom */
  renderRowExpanded?: (row: T) => ReactNode;

  /** Sorok kiválasztását engedélyező checkbox */
  enableRowSelection?: boolean;

  /** Oszlopok elrejtésének engedélyezése */
  enableHiding?: boolean;

  footerVisible?: boolean;

  /** Egyedi CSS osztály a táblázathoz */
  className?: string;
  /** Egyedi HTML id a containerre */
  tableId?: string;
}

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 0,
    scale: 0.95,
    transformOrigin: "top right",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transformOrigin: "top right",
    transition: {
      duration: 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const DataTable = <T extends object>({
  data,
  columns,
  initialPageSize = 10,
  // pageSizeOptions = [10, 20, 50, -1], // -1 jelenti az összes elem megjelenítését
  enableGlobalFilter = false,
  globalFilterColumns,
  globalFilterPlaceholder = "Keresés...",
  renderRowExpanded,
  enableRowSelection = false,
  enableHiding = false,
  footerVisible = true,
  className = "",
  tableId,
}: DataTableProps<T>) => {
  // ---------- Állapotok ----------
  const [globalFilter, setGlobalFilter] = useState("");

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    // Disable scroll on body when column menu is open
    if (showColumnMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [showColumnMenu]);

  useClickOutside({
    ref: menuRef,
    callback: () => {
      setShowColumnMenu(false);
    },
  });

  // ---------- Oszlopok módosítása globális szűréshez ----------
  const mappedColumns = columns.map((column) => {
    if (enableGlobalFilter) {
      // Kiterjesztjük ColumDef típust, hogy elérjük az accessorKey-et is
      const columnDef = column as ColumnDef<T, any> & {
        accessorKey?: string;
      };
      // Meghatározzuk az oszlop azonosítóját (id vagy accessorKey)
      const columnId = column.id ?? columnDef.accessorKey;
      if (!columnId) return column;

      // Ellenőrizzük, hogy ez az oszlop engedélyezett-e a globális szűrésben
      const allow =
        !globalFilterColumns ||
        globalFilterColumns.includes(columnId as keyof T);
      return {
        ...column,
        enableGlobalFilter: allow,
      };
    }
    return column;
  });

  // ---------- Sor kiválasztás és expand oszlop hozzáadása ----------
  const tableColumns: ColumnDef<T, any>[] = [];

  if (enableRowSelection) {
    tableColumns.push({
      id: "selection",
      header: ({ table }) => (
        <input
          type='checkbox'
          {...{
            checked:
              table.getState().rowSelection?.["all"] ||
              table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <input
          type='checkbox'
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
      enableHiding: false,
    });
  }

  if (renderRowExpanded) {
    tableColumns.push({
      id: "expander",
      header: () => null,
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <button
            type='button'
            className='dtable__expander'
            onClick={row.getToggleExpandedHandler()}
            aria-label={row.getIsExpanded() ? "Bezárás" : "Részletek mutatása"}>
            {row.getIsExpanded() ? <ArrowUp /> : <CornerDownRight />}
          </button>
        ) : null,
      enableHiding: false,
    });
  }

  tableColumns.push(...mappedColumns);

  // ---------- useReactTable inicializálás ----------
  const table = useReactTable({
    data,
    columns: tableColumns,
    defaultColumn: {
      enableSorting: false,
    },

    state: {
      globalFilter,
      sorting,
      pagination,
      expanded,
      rowSelection,
      columnVisibility,
    },

    enableGlobalFilter,
    enableRowSelection,
    enableHiding,
    enableExpanding: Boolean(renderRowExpanded),

    getRowCanExpand: () => Boolean(renderRowExpanded),

    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div id={tableId} className={`dtable__wrapper ${className}`}>
      {/* Globális keresőmező */}
      <div className='dtable__header'>
        {enableGlobalFilter && (
          <input
            type='text'
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={globalFilterPlaceholder}
          />
        )}

        {enableHiding && (
          <div className='dtable__dropdown'>
            <button
              type='button'
              onClick={() => setShowColumnMenu((prev) => !prev)}>
              Oszlopok {showColumnMenu ? <ChevronUp /> : <ChevronDown />}
            </button>

            <AnimatePresence mode='wait'>
              {showColumnMenu && (
                <motion.div
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  variants={dropdownVariants}>
                  <ul ref={menuRef} className='dtable__dropdown-menu'>
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        const label =
                          typeof column.columnDef.header === "string"
                            ? column.columnDef.header
                            : null;

                        return (
                          <li
                            key={column.id}
                            onClick={() => column.toggleVisibility()}>
                            {column.getIsVisible() && <Check />}
                            {label}
                          </li>
                        );
                      })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Táblázat */}
      <table className='dtable'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortState = header.column.getIsSorted(); // 'asc' | 'desc' | false

                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {canSort ? (
                      <button
                        type='button'
                        onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {sortState === "asc" ? (
                          <ArrowUp />
                        ) : sortState === "desc" ? (
                          <ArrowDown />
                        ) : (
                          <ArrowDownUp />
                        )}
                      </button>
                    ) : (
                      // ha nem rendezhető, csak sima szöveg
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <tr>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {/* Kinyitható sorok tartalma */}
                {row.getIsExpanded() && renderRowExpanded && (
                  <tr className='dtable__row-expanded'>
                    <td colSpan={row.getVisibleCells().length}>
                      {renderRowExpanded(row.original)}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  table.getHeaderGroups()[0]?.headers.length ||
                  tableColumns.length
                }
                className='empty'>
                Nincs megjeleníthető adat.
              </td>
            </tr>
          )}
        </tbody>

        {footerVisible && (
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortState = header.column.getIsSorted(); // 'asc' | 'desc' | false

                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {canSort ? (
                        <button
                          type='button'
                          onClick={header.column.getToggleSortingHandler()}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sortState === "asc" ? (
                            <ArrowUp />
                          ) : sortState === "desc" ? (
                            <ArrowDown />
                          ) : (
                            <ArrowDownUp />
                          )}
                        </button>
                      ) : (
                        // ha nem rendezhető, csak sima szöveg
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default DataTable;

// EXAMPLE USAGE
/*

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
  { accessorKey: "firstName", header: "Keresztnév", enableSorting: true },
  { accessorKey: "lastName", header: "Vezetéknév", enableSorting: true },
  { accessorKey: "age", header: "Életkor" },
];

<DataTable
  data={sampleData}
  columns={sampleColumns}
  enableHiding
  enableGlobalFilter
  globalFilterColumns={["firstName", "lastName"]}
  globalFilterPlaceholder='Keresés név szerint ...'
  renderRowExpanded={(row) => (
    <div>
      <p>
        <strong>Keresztnév:</strong> {row.firstName}
      </p>
      <p>
        <strong>Vezetéknév:</strong> {row.lastName}
      </p>
    </div>
  )}
  footerVisible={true}
/>;

*/
