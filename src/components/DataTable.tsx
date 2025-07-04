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
} from "@tanstack/react-table";
import { Fragment, ReactNode, useState } from "react";

interface DataTableProps<T extends object> {
  /** Adatsorozat a megjelenítéshez (kliens oldali mód) */
  data: T[];
  /** Oszlopdefiníciók TanStack Table formátumban */
  columns: ColumnDef<T, any>[];

  /** Kezdeti elemszám oldalanként (default: 10) */
  initialPageSize?: number;
  /** Választható elemszám opciók oldalanként */
  pageSizeOptions?: number[];

  /** Globális keresőmező engedélyezése */
  enableGlobalFilter?: boolean;
  /** Ha megadott: csak ezekben az oszlopokban kerül végrehajtásra a globális keresés */
  globalFilterColumns?: (keyof T)[];

  /** Kinyitható sorokhoz tetszőleges tartalom */
  renderRowExpanded?: (row: T) => ReactNode;

  /** Sorok kiválasztását engedélyező checkbox */
  enableRowSelection?: boolean;

  footerVisible?: boolean;

  /** Egyedi CSS osztály a táblázathoz */
  className?: string;
  /** Egyedi HTML id a containerre */
  tableId?: string;
}

const DataTable = <T extends object>({
  data,
  columns,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 50],
  enableGlobalFilter = false,
  globalFilterColumns,
  renderRowExpanded,
  enableRowSelection = false,
  footerVisible = true,
  className = "",
  tableId,
}: DataTableProps<T>) => {
  // ---------- Állapotok ----------
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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
    });
  }

  if (renderRowExpanded) {
    tableColumns.push({
      id: "expander",
      header: () => null,
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <button type='button' onClick={row.getToggleExpandedHandler()}>
            {row.getIsExpanded() ? "▼" : "▶"}
          </button>
        ) : null,
    });
  }

  tableColumns.push(...mappedColumns);

  // ---------- useReactTable inicializálás ----------
  const table = useReactTable({
    data,
    columns: tableColumns,

    state: {
      globalFilter,
      sorting,
      pagination,
      expanded,
      rowSelection,
    },

    enableGlobalFilter,
    enableRowSelection,

    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div id={tableId} className={`dtable__wrapper ${className}`}>
      {/* Globális keresőmező */}
      {enableGlobalFilter && (
        <div className='dtable__global-filter'>
          <input
            type='text'
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder='Keresés ...'
          />
        </div>
      )}

      {/* Táblázat */}
      <table className='dtable'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                    userSelect: "none",
                  }}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{ asc: " 🔼", desc: " 🔽" }[
                    header.column.getIsSorted() as string
                  ] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <tr>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: "0.5rem",
                        borderBottom: "1px solid #eee",
                      }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && renderRowExpanded && (
                  <tr>
                    <td
                      colSpan={row.getVisibleCells().length}
                      style={{ padding: "1rem", background: "#fafafa" }}>
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
                style={{ padding: "1rem", textAlign: "center" }}>
                Nincs megjeleníthető adat.
              </td>
            </tr>
          )}
        </tbody>

        {footerVisible && (
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default DataTable;
