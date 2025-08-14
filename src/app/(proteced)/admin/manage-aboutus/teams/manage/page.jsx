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

const TeamTable = () => {
  const router = useRouter();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/teams");
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

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/teams/${id}`);
      if (res.status === 200) {
        setData((prev) => prev.filter((member) => member._id !== id));
        toast({ title: "Deleted Successfully" });
      }
    } catch (err) {
      console.error("Delete failed", err);
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
      cell: ({ row }) => {
        const member = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[var(--primary)] text-white" align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/admin/manage-aboutus/teams/edit/${member._id}`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(member._id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Manage Team Members</h2>
        <Link href="/admin/manage-aboutus/teams/add">
          <Button className="bg-[var(--primary)] text-white">Add New Member</Button>
        </Link>
      </div>

      <div className="rounded-md border">
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
    </DefaultLayout>
  );
};

export default TeamTable;
