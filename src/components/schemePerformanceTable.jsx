"use client";
 
import * as React from "react";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CaretSortIcon } from "@radix-ui/react-icons";
 
const SchemePerformanceTable = ({ data, title }) => {
 
  console.log(data)
  const [loading, setLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
 
  const columns = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invested Type
          <CaretSortIcon className="ml-2 h-4 w-28" />
        </Button>
      ),
      cell: ({ row }) => <div>{row?.getValue("title")}</div>,
    },
    {
      accessorKey: "investedAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invested Amount
          <CaretSortIcon className="ml-2 h-4 w-1" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row?.getValue("investedAmount")}</div>,
    },
    {
      accessorKey: "buyRate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Buy Rate
          <CaretSortIcon className="ml-2 h-4 w-1" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("buyRate")}</div>,
    },
    {
      accessorKey: "buyUnit",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Buy Units
          <CaretSortIcon className="ml-2 h-4 w-1" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("buyUnit")}</div>,
    },
    {
      accessorKey: "maturityDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Maturity Date
          <CaretSortIcon className="ml-2 h-4 w-1" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("maturityDate")}</div>,
    },
    {
      accessorKey: "RateAtMaturity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Maturity Rate
          <CaretSortIcon className="ml-2 h-4 w-1" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("RateAtMaturity")}</div>,
    },
    {
      accessorKey: "maturityValue",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Maturity Value
          <CaretSortIcon className="ml-2 h-4 w-1" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("maturityValue")}</div>,
    },
    {
      accessorKey: "absoluteReturns",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Absolute Return
          <CaretSortIcon className="ml-2 h-4 w-1" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("absoluteReturns")}%</div>,
    },
    {
      accessorKey: "xirrRate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          XIRR (%)
          <CaretSortIcon className="ml-2 h-4 w-1" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("xirrRate")}%</div>,
    },
  ];
 
  const table = useReactTable({
    data: data || [], // Make sure data is an empty array if undefined
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
 
  return (
    <div>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by title..."
            value={table.getColumn("title")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {data?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
 
export default SchemePerformanceTable;