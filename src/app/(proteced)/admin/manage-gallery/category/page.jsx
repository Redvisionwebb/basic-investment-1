"use client";

import * as React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import formatDate from "@/lib/formatDate";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const GalleryCategoryTable = () => {
  const router = useRouter();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [categorytitle, setCategorytitle] = React.useState("");
  const [editCategoryId, setEditCategoryId] = React.useState("");

  // ✅ Fetch gallery categories
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallerycategory`
      );
      if (res.status === 200) setData(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // ✅ Delete gallery category
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallerycategory/${id}`
      );
      if (res.status === 201) {
        setData((prev) => prev.filter((c) => c._id !== id));
        toast({ title: "Category deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // ✅ Add new category
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallerycategory`,
        { categorytitle }
      );
      if (res.status === 201) {
        fetchData();
        setDialogOpen(false);
        toast({ title: "Gallery category added successfully" });
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // ✅ Update existing category
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallerycategory/${editCategoryId}`,
        { categorytitle }
      );
      if (res.status === 201) {
        fetchData();
        setDialogOpen(false);
        toast({ title: "Gallery category updated successfully" });
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // ✅ Table columns
  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => <div>{formatDate(row.getValue("updatedAt"))}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const cate = row.original;
        return (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditCategoryId(cate._id);
                setCategorytitle(cate.title);
                setDialogOpen(true);
              }}
              className="text-blue-600 border border-blue-600 rounded-md p-2"
            >
              <FiEdit2 size={16} />
            </button>

            <button
              onClick={() => handleDelete(cate._id)}
              className="text-red-600 border border-red-600 rounded-md p-2"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  // ✅ React Table setup
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
      <Toaster />
      <div className="flex justify-between mb-4 items-center">
        <h1 className="font-bold text-2xl">Gallery Categories</h1>

        {/* ✅ Hide the Add button when there are already 10 categories */}
        {data.length < 10 && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 text-white"
                onClick={() => {
                  setDialogOpen(true);
                  setCategorytitle("");
                  setEditCategoryId("");
                }}
              >
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>
                  {editCategoryId
                    ? "Edit Gallery Category"
                    : "Add Gallery Category"}
                </DialogTitle>
                <DialogDescription>
                  {editCategoryId
                    ? "Update this gallery category."
                    : "Add a new gallery category."}
                </DialogDescription>
              </DialogHeader>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter category title"
                  value={categorytitle}
                  onChange={(e) => setCategorytitle(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  className="bg-blue-600 text-white"
                  onClick={editCategoryId ? handleUpdate : handleSubmit}
                >
                  {editCategoryId ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* ✅ Optional message when limit reached */}
      {data.length >= 10 && (
        <p className="text-sm text-red-600 mb-4">
          You’ve reached the maximum limit of 10 categories.
        </p>
      )}

      <Input
        placeholder="Filter by title..."
        value={table.getColumn("title")?.getFilterValue() ?? ""}
        onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
        className="mb-4 max-w-md border"
      />

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
          {table.getRowModel().rows.length ? (
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
              <TableCell colSpan={columns.length} className="text-center h-24">
                No gallery categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DefaultLayout>
  );
};

export default GalleryCategoryTable;
