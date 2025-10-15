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
import {
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CornerDownRight,
  Ellipsis,
  MoveRight,
} from "lucide-react";

type PagerItem = number | "start-ellipsis" | "end-ellipsis";

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPagerItems(
  page: number, // 0-based current
  totalPages: number, // total pages
  siblingCount = 1, // hány szomszéd látszik
  boundaryCount = 1 // hány kezdő/záró látszik
): PagerItem[] {
  const last = totalPages - 1; // 0-based utolsó index

  // 1) Kevés oldal -> minden szám, ellipszis nélkül
  const maxButtons = boundaryCount * 2 + siblingCount * 2 + 3; // first..last + current + 2 ellipszis
  if (totalPages <= maxButtons) return range(0, last);

  // 2) Kezdő és záró blokkok
  const startPages = range(0, boundaryCount - 1);
  const endPages = range(Math.max(totalPages - boundaryCount, 0), last);

  // 3) Középső "siblings" ablak (MUI-féle clamp)
  const siblingsStart = Math.max(
    boundaryCount,
    Math.min(
      page - siblingCount,
      totalPages - boundaryCount - siblingCount * 2 - 1
    )
  );
  const siblingsEnd = Math.min(
    totalPages - boundaryCount - 1,
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2)
  );

  const items: PagerItem[] = [...startPages];

  // 4) Kezdő ellipszis, ha kell
  if (siblingsStart > boundaryCount) items.push("start-ellipsis");

  // 5) Középső számok
  items.push(...range(siblingsStart, siblingsEnd));

  // 6) Záró ellipszis, ha kell
  if (siblingsEnd < totalPages - boundaryCount - 1) items.push("end-ellipsis");

  // 7) Záró blokkok
  items.push(...endPages);

  return items;
}

interface DataTableProps<T extends object> {
  /** Adatsorozat a megjelenítéshez (kliens oldali mód) */
  data: T[];
  /** Oszlopdefiníciók TanStack Table formátumban */
  columns: ColumnDef<T, any>[];

  /** Szerver oldali lapozás */
  manualPagination: true;
  /** Összes oldal száma VAGY (alternatívaként) összes sor száma */
  pageCount?: number;
  rowCount?: number;

  /** Jelzés a szülőnek: pageIndex (0-based), pageSize */
  pageIndex0: number;
  pageSize: number;
  onPageChange: (pi0: number, ps: number) => void;

  /** Később bővíthető: lapméret választó */
  pageSizeOptions?: number[];

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

  manualPagination,
  pageCount,
  rowCount,
  pageSize,
  pageIndex0,
  onPageChange,
  // pageSizeOptions = [], // [10, 20, 50, -1], // -1 jelenti az összes elem megjelenítését

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
    pageIndex: pageIndex0,
    pageSize: pageSize,
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

  // ha a szülő megváltoztatja, szinkronizáljuk
  useEffect(() => {
    setPagination((prev) =>
      prev.pageIndex !== pageIndex0 || prev.pageSize !== pageSize
        ? { pageIndex: pageIndex0, pageSize }
        : prev
    );
  }, [pageIndex0, pageSize]);

  useClickOutside({
    ref: menuRef,
    callback: () => {
      setShowColumnMenu(false);
    },
  });

  // ---------- Sor kiválasztás és expand oszlop hozzáadása ----------
  const displayColumns: ColumnDef<T, any>[] = [];

  if (enableRowSelection) {
    displayColumns.push({
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
    displayColumns.push({
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

  const tableColumns = useMemo<ColumnDef<T, any>[]>(() => {
    return [...displayColumns, ...columns];
  }, [displayColumns.length, columns]);

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

    getColumnCanGlobalFilter: (column) =>
      !!enableGlobalFilter &&
      (!globalFilterColumns ||
        globalFilterColumns.includes(column.id as keyof T)),

    enableRowSelection,
    enableHiding,
    enableExpanding: Boolean(renderRowExpanded),

    getRowCanExpand: () => Boolean(renderRowExpanded),

    manualPagination: manualPagination,
    pageCount: pageCount,
    autoResetPageIndex: false,

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

  // amikor a belső pagination változik, jelezzük a szülőnek
  useEffect(() => {
    onPageChange(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize, onPageChange]);

  const totalPages = pageCount || table.getPageCount() || 1;
  const pageIndex = table.getState().pagination.pageIndex;
  const canPrev = pageIndex > 0;
  const canNext = pageIndex + 1 < totalPages;
  const items = buildPagerItems(pageIndex, totalPages, 1, 1);

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
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`th-${header.column.id}`}>
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
                    <td key={cell.id} className={`td-${cell.column.id}`}>
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
                className='empty ta-center'>
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

      <div className={`dtable__pagination ${!footerVisible && "hasborder"}`}>
        <nav className='pager' aria-label='Táblázat lapozás'>
          {rowCount && (
            <div className='pager__total'>{rowCount} sor összesen</div>
          )}

          <div className='pager__nav'>
            <button
              type='button'
              onClick={() => table.previousPage()}
              disabled={!canPrev}
              aria-label='Előző oldal'>
              <ChevronLeft />
            </button>

            {items.map((it, idx) =>
              typeof it === "number" ? (
                <button
                  key={idx}
                  type='button'
                  className={it === pageIndex ? "is-active" : ""}
                  aria-current={it === pageIndex ? "page" : undefined}
                  onClick={() => table.setPageIndex(it)}>
                  {it + 1}
                </button>
              ) : (
                <span key={idx} className='pager__ellipsis' aria-hidden='true'>
                  <Ellipsis />
                </span>
              )
            )}

            <button
              type='button'
              onClick={() => table.nextPage()}
              disabled={!canNext}
              aria-label='Következő oldal'>
              <ChevronRight />
            </button>
          </div>

          <form
            className='pager__goto'
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const n = Number(fd.get("p"));
              if (!Number.isNaN(n) && n >= 1 && n <= totalPages) {
                table.setPageIndex(n - 1);
              }
            }}>
            <label className='sr-only' htmlFor='goto-page'>
              Ugrás oldalra
            </label>
            <input
              id='goto-page'
              placeholder={String(totalPages)}
              name='p'
              type='number'
              min={1}
              max={totalPages}
              defaultValue={pageIndex + 1}
              disabled={totalPages === 1}
            />
            <button type='submit' title='Ugrás'>
              Ugrás
            </button>
          </form>
        </nav>
      </div>
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
