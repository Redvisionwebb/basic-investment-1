"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const StatsTable = () => {
  const router = useRouter();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/stats`);
        if (res.status === 200) setData(res.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const CancelDelete = () => {
    setShowConfirm(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setLoading(true);

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/stats/${selectedId}`);
      if (res.status === 200) {
        setData((prev) => prev.filter((item) => item._id !== selectedId));
        toast({ variant: "success", title: "Deleted successfully" });
      } else {
        toast({ variant: "destructive", title: "Failed to delete stat" });
      }
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Error deleting stat" });
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <Image
          src={row.original.image?.url || "/no-image.png"}
          alt={row.original.title}
          width={60}
          height={60}
          className="rounded object-cover"
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.original.title}</div>,
    },
    {
      accessorKey: "subtitle",
      header: "Subtitle",
      cell: ({ row }) => <div>{row.original.subtitle || "-"}</div>,
    },
    {
      accessorKey: "statsNumber",
      header: "Stats Number",
      cell: ({ row }) => <div>{row.original.statsNumber}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.original.description || "-"}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const stat = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/admin/manage-Stats/edit/${stat._id}`)}
              className="text-[#2367f8] border border-[#2367f8] rounded-md p-2"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => confirmDelete(stat._id)}
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
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DefaultLayout>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Manage Stats</h2>
        
         {(data?.length < 6) && (<Link href="/admin/manage-Stats/add">
          <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]">Add New Stats</Button>
        </Link>) }
      </div>

      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6">
                  No stats found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-2 py-4">
        <Button
          variant="outline"
          size="sm"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this Stats?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={CancelDelete} className="px-4 py-2 bg-gray-300 rounded">
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

export default StatsTable;
