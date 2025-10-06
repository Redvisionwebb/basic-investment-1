"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { FaFolderClosed } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";

const DataTableDemo = () => {
    const router = useRouter();
    const [data, setData] = React.useState([]); // Blog data state
    const [loading, setLoading] = React.useState(false);
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [selectedImage, setSelectedImage] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    // Handler to close modal
    const onClose = () => {
        setIsModalOpen(false);
    };

    // Fetch blog data from the API
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallery/`);
            if (res.status === 200) {
                setData(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        }
        setLoading(false);
    };
    React.useEffect(() => {
        fetchData();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file)
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('image', selectedImage);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallery/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                toast({
                    variant: '',
                    title: "Data uploaded successfully",
                    // description: "There was a problem with your request.",
                });
                setSelectedImage(null);
                setIsModalOpen(false);
                fetchData();
            } else {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An unexpected error occurred.", error);
        }
    };

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
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallery/${selectedId}`);
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
            cell: ({ row }) => {
                const image = row.getValue('image')
                return (
                    <div className="capitalize"><Image src={image?.url} width={160} height={100} alt="image" /></div>
                )
            }
        },
        {
            accessorKey: "createdAt",
            header: "Post date",
            cell: ({ row }) => <div className="capitalize">{formatDate(row.getValue("createdAt"))}</div>,
        },
        {
            accessorKey: "updatedAt",
            header: "Update",
            cell: ({ row }) => <div className="capitalize">{formatDate(row.getValue("updatedAt"))}</div>,
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const image = row.original;

                return (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => confirmDelete(image._id)}
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
            <div>
                <div className="flex justify-between">
                    <h1 className='font-bold text-2xl'>Manage Gallery</h1>
                    <div className="" onClick={() => setIsModalOpen(true)}>
                        <Button className="text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]">Add New</Button>
                    </div>
                </div>

                <div className="w-full py-4">
                    {/* <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter by title..."
                        value={(table.getColumn("title")?.getFilterValue()) ?? ""}
                        onChange={(event) =>
                            table.getColumn("title")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                ?.getAllColumns()
                                ?.filter((column) => column.getCanHide())
                                ?.map((column) => (
                                    <DropdownMenuItem
                                        key={column.id}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div> */}
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
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
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
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <div>
                            <div className="w-full flex items-center justify-between gap-5">
                                <p>Add New Photo</p>
                                <p><IoCloseSharp className="text-2xl cursor-pointer" onClick={() => onClose()} /> </p>
                            </div>

                            <div className="mt-4 flex flex-col gap-1">
                                <label
                                    htmlFor="imageUpload"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e)}
                                    className="border border-gray-400 flex h-10 w-full  bg-transparent shadow-input rounded-md px-3 py-2 text-sm 
           file:border-0 file:bg-transparent file:text-sm file:font-medium 
           placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] 
           focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 
           dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none 
           transition duration-400"
                                />
                                <p className=" text-sm text-gray-500">
                                    Supported formats: JPEG, PNG. WEBP.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => onClose()}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => onSubmit()}
                                className="px-4 py-2 rounded text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]"
                            >
                                save
                            </button>
                        </div>
                    </div>
                </div>
            )}
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

export default DataTableDemo;