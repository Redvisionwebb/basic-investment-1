"use client";

import * as React from "react";
import {
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
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ make sure react-toastify or your own toast hook is imported

export default function ServicesTable({ services, onDelete }) {
  const router = useRouter();

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);
  const [loading, setLoading] = React.useState(false); // ✅ added

  const handleEditService = (srv) => {
    router.push(`/admin/services/${srv.versionSlug}/${srv._id}`);
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setLoading(true);

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/services/${selectedId}`
      );

      if (res.status === 200) {
        // ✅ let parent know item was deleted
        if (onDelete) onDelete(selectedId);
        toast.success("Deleted successfully");
      } else {
        toast.error("Failed to delete service");
      }
    } catch (error) {
      toast.error("Error deleting service");
      console.error(error);
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Service Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="line-clamp-2 max-w-sm text-gray-600"
          dangerouslySetInnerHTML={{
            __html: row.getValue("description") || "",
          }}
        />
      ),
    },
    {
      accessorKey: "metaTitle",
      header: "Meta Title",
      cell: ({ row }) => <div>{row.getValue("metaTitle") || "-"}</div>,
    },
    {
      accessorKey: "metaDescription",
      header: "Meta Description",
      cell: ({ row }) => <div>{row.getValue("metaDescription") || "-"}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const srv = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleEditService(srv)}
              className="text-[#2367f8] border border-[#2367f8] rounded-md p-2"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => confirmDelete(srv._id)}
              className="text-red-600 border border-red-600 rounded-md p-2"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: services || [],
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
    <div className="w-full">
      {/* Search */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Search service..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-xl border border-gray-300"
        />
      </div>

      {/* Table */}
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {services.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No services found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this Service?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                {loading ? "Deleting..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
