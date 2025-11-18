"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "@/hooks/use-toast";

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
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

const ManageGallery = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  // ✅ Fetch gallery data
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallery`
        );
        if (res.status === 200) setData(res.data);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🗑 Confirm delete modal handlers
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
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallery/${selectedId}`
      );

      if (res.status === 200) {
        setData((prev) => prev.filter((item) => item._id !== selectedId));
        toast({ variant: "success", title: "Deleted successfully" });
      } else {
        toast({ variant: "destructive", title: "Failed to delete image" });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error deleting image" });
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  // ✅ Table columns (use accessorFn for nested fields)
  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Image
            src={row.getValue("image")?.url}
            width={120}
            height={120}
            className="rounded-md object-cover"
            alt="Gallery"
          />
        </div>
      ),
    },
    {
      id: "category", // ✅ set explicit id
      header: "Category",
      accessorFn: (row) => row.category?.title || "—", // ✅ safely access nested data
      cell: ({ getValue }) => (
        <div className="text-center">{getValue() || "—"}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Added On",
      cell: ({ row }) => (
        <div className="text-center">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const gallery = row.original;
        return (
          <div className="flex justify-center">
            <button
              onClick={() => confirmDelete(gallery._id)}
              className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-50"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  // ✅ Initialize React Table
  const table = useReactTable({
    data,
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
    <DefaultLayout>
      <div className="flex justify-between mb-4">
        <h1 className="font-bold text-2xl">Manage Gallery</h1>
        <Link href="/admin/manage-gallery/add-image">
          <Button className="text-white bg-[#2367f8] hover:bg-[#1d56d1]">
            Add New Image
          </Button>
        </Link>
      </div>

      <div className="w-full">
        {/* ✅ Category Filter Input */}
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by category..."
            value={table.getColumn("category")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("category")?.setFilterValue(e.target.value)
            }
            className="max-w-xl border border-gray-300"
          />
        </div>

        {/* ✅ Data Table */}
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
              {table.getRowModel().rows.length ? (
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Pagination Controls */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
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

      {/* ✅ Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this image?</p>
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
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                {loading ? "Deleting..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default ManageGallery;
