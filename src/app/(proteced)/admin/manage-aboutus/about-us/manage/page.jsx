"use client";

import * as React from "react";
import {
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
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/admin/common/Loader";

const DataTableAboutUs = () => {
    const router = useRouter();
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true); // Initially true to show loader
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
                const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/aboutus`);
                if (res.status === 200) setData(res.data);
            } catch (error) {
                toast.error("Failed to fetch About Us data ❌");
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    

    // const confirmDelete = (id) => {
    //     setSelectedId(id);
    //     setShowConfirm(true);
    // };

    // const CancelDelete = () => {
    //     setShowConfirm(false);
    //     setSelectedId(null);
    // };

    // const handleDelete = async () => {
    //     if (!selectedId) return;
    //     setLoading(true);
    //     try {
    //         const res = await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/aboutus/${selectedId}`);
    //         if (res.status === 200) {
    //             setData(prev => prev.filter(item => item._id !== selectedId));
    //             toast.success("Deleted successfully ✅");
    //         } else {
    //             toast.error("Failed to delete ❌");
    //         }
    //     } catch (error) {
    //         toast.error("Error deleting About Us ❌");
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //         setShowConfirm(false);
    //         setSelectedId(null);
    //     }
    // };

    const columns = [
        {
            accessorKey: "image",
            header: "Image",
            cell: ({ row }) => {
                const imageUrl = row.getValue("image")?.url || "/placeholder.jpg";
                return <Image src={imageUrl} width={80} height={80} className="rounded-md object-cover" alt="About Image" />;
            },
        },
        { accessorKey: "title", header: "Title", cell: ({ row }) => <div>{row.getValue("title")}</div> },
        { accessorKey: "createdAt", header: "Created", cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div> },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const blog = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push(`/admin/manage-aboutus/about-us/edit/${blog._id}`)}
                            className="text-[#2367f8] border border-[#2367f8] rounded-md p-2"
                        >
                            <FiEdit2 size={16} />
                        </button>
                        {/* <button
                            onClick={() => confirmDelete(blog._id)}
                            className="text-red-600 border border-red-600 rounded-md p-2 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading && selectedId === blog._id ? (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                            ) : <FiTrash2 size={16} />}
                        </button> */}
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
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    return (
        <DefaultLayout>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex justify-between mb-4">
                <h1 className="font-bold text-2xl">Manage About Us Sections</h1>
                {(!data || data?.length === 0) && (<Link href="/admin/manage-aboutus/about-us/add">
                    <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]">Add New</Button>
                </Link>) }
            </div>

            {loading && data.length === 0 ? (
                <Loader />
            ) : (
                <>
                    <div className="flex items-center py-2">
                        <Input
                            placeholder="Filter by title..."
                            value={(table.getColumn("title")?.getFilterValue()) ?? ""}
                            onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
                            className="max-w-xl border border-gray-300"
                        />
                    </div>

                    <div className="rounded-md">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map(row => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="text-sm text-muted-foreground flex-1">
                            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                        <div className="space-x-2">
                            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
                        </div>
                    </div>
                </>
            )}

            {/* {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <p>Are you sure you want to delete this About Us?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button onClick={CancelDelete} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 bg-red-500 text-white rounded flex items-center justify-center"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                ) : "OK"}
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
        </DefaultLayout>
    );
};

export default DataTableAboutUs;
