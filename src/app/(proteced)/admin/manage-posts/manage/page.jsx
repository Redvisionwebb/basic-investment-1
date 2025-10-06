"use client";

import * as React from "react";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import formatDate from "@/lib/formatDate";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Loader from "@/components/admin/common/Loader";

const DataTableDemo = () => {
    const router = useRouter();
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/blogs/`);
                if (res.status === 200) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch blogs", error);
            }
            setLoading(false);
        };

        fetchData();
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
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/blogs/${selectedId}`);
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
            header: "Post Image",
            cell: ({ row }) => (
                <Image
                    src={row.getValue("image")?.url}
                    width={100}
                    height={100}
                    className="rounded"
                    alt="image"
                />
            ),
        },
        {
            accessorKey: "posttitle",
            header: "Title",
            cell: ({ row }) => <div>{row.getValue("posttitle")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: "Post date",
            cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const blog = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push(`/admin/manage-posts/edit-post/${blog._id}`)}
                            className="text-[var(--rv-admin-bg-color)] border border-[var(--rv-admin-bg-color)] rounded-md p-2"
                        >
                            <FiEdit2 size={16} />
                        </button>
                        <button
                            onClick={() => confirmDelete(blog._id)}
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
            {loading ? (
                <div className="">
                    <Loader />
                </div>
            ) : (
                <>

                    <div className="flex justify-between">
                        <h1 className="font-bold text-2xl">Add New Post</h1>
                        <Link href="/admin/manage-posts/add-post">
                            <Button className="text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]">Add New Post</Button>
                        </Link>
                    </div>

                    <div className="w-full">
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Filter by title..."
                                value={table.getColumn("posttitle")?.getFilterValue() ?? ""}
                                onChange={(event) =>
                                    table.getColumn("posttitle")?.setFilterValue(event.target.value)
                                }
                                className="max-w-xl border border-gray-300"
                            />
                        </div>
                        <div className="rounded-md">
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
                                    {table?.getRowModel().rows.length ? (
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
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    {showConfirm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-4 rounded shadow-lg">
                                <p>Are you sure you want to delete this blog?</p>
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
                </>
            )}
        </DefaultLayout>
    );
};

export default DataTableDemo;
