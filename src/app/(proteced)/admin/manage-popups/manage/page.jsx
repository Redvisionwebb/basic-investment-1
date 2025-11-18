"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import formatDate from "@/lib/formatDate";

const PopupsTable = () => {
  const router = useRouter();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);

  // Fetch all popups
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups/`
      );
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Failed to fetch popups" });
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Delete popup
  const confirmDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this popup?")) return;
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups/${id}`
      );
      if (res.status === 200) {
        toast({ variant: "success", title: "Popup deleted successfully" });
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Failed to delete popup" });
    }
  };

  // Toggle status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups/changestatus/`,
        { id, status: !currentStatus }
      );
      if (res.status === 201) {
        toast({ variant: "success", title: "Status updated" });
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Failed to change status" });
    }
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const image = row.getValue("image");
        return image?.url ? (
          <Image src={image.url} width={160} height={100} alt="popup" />
        ) : null;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span
            className={`px-2 py-1 rounded-full text-white ${
              status ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {status ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => formatDate(row.getValue("updatedAt")),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const blog = row.original;
        return (
          <div className="relative group">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
              •••
            </div>
            <div className="absolute top-full right-0 mt-2 flex flex-col bg-white border shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <button
                onClick={() => router.push(`/admin/manage-popups/edit/${blog._id}`)}
                className="px-4 py-2 text-left text-blue-600 hover:bg-blue-50"
              >
                Edit
              </button>
              <button
                onClick={() => toggleStatus(blog._id, blog.status)}
                className="px-4 py-2 text-left text-green-600 hover:bg-green-50"
              >
                {blog.status ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => confirmDelete(blog._id)}
                className="px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Popups</h1>
        {data.length === 0 && (
          <Button onClick={() => router.push("/admin/manage-popups/add")}>
            Add New Popup
          </Button>
        )}
      </div>

      <div className="py-4">
        <Input
          placeholder="Search by title..."
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="max-w-xl border border-gray-300"
        />
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 text-left border-b">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border-b">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
};

export default PopupsTable;
