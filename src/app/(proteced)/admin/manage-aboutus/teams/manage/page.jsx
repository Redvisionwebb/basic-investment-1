"use client";

import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const TeamTable = () => {
  const router = useRouter();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  React.useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/teams`);
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Error fetching team data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
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
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/teams/${selectedId}`);
      if (res.status === 200) {
        setData((prevData) => prevData.filter((blog) => blog._id !== selectedId));
        toast({ variant: "success", title: "Deleted successfully" });
      } else {
        toast({ variant: "destructive", title: "Failed to delete blog" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error deleting blog" });
      console.error(error);
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
          alt="member"
          width={60}
          height={60}
          className="rounded-full object-cover"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: ({ row }) => <div>{row.original.designation}</div>,
    },
    {
      accessorKey: "experience",
      header: "Experience (Years)",
      cell: ({ row }) => <div>{row.original.experience || "-"}</div>,
    },
    {
      accessorKey: "socialMedia",
      header: "Social Links",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.socialMedia?.map((sm, idx) => (
            <a key={idx} href={sm.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {sm.name}
            </a>
          )) || "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const member = row.original;

        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/admin/manage-aboutus/teams/edit/${member._id}`)}
              className="text-[#2367f8] border border-[#2367f8] rounded-md p-2"
            >
              <FiEdit2 size={16} />
            </button>

            <button
              onClick={() => confirmDelete(member._id)}
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
      <div className="flex justify-between ">
        <h2 className="text-2xl font-bold">Manage Team Members</h2>
        <Link href="/admin/manage-aboutus/teams/add">
          <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]">Add New Member</Button>
        </Link>
      </div>
      <div className="w-full">
        <div className="flex items-center py-4">
          {/* <Input
            placeholder="Filter by title..."
            value={(table.getColumn("title")?.getFilterValue()) ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            className="max-w-xl border border-gray-300"
          /> */}
          {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
                                <DropdownMenuItem
                                    key={col.id}
                                    checked={col.getIsVisible()}
                                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                                >
                                    {col.id}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu> */}
        </div>
        <div className="rounded-md ">
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
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-6">
                    No team members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end items-center gap-2 py-4">
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
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this Member?</p>
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

export default TeamTable;
