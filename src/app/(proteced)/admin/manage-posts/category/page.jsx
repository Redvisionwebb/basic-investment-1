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
import { Checkbox } from "@/components/ui/checkbox";
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
import formatDate from "@/lib/formatDate";
import { useRouter } from "next/navigation";

// Import Dialog components
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Toast } from "@radix-ui/react-toast";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

const DataTableDemo = () => {
    const router = useRouter();
    const [data, setData] = React.useState([]); // Blog data state
    const [loading, setLoading] = React.useState(false);
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [dialogOpen, setDialogOpen] = React.useState(false); // State to control dialog visibility
    const [categorytitle, setCategorytitle] = React.useState("")
    const [editCategoryId, setEditCategoryId] = React.useState('');

    // Fetch blog data from the API
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/category/");
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

    // Delete blog post function
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`/api/category/${id}`);
            if (res.status === 201) {
                setData((prevData) => prevData.filter((cate) => cate._id !== id));
            } else {
                console.error("Failed to delete blog");
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    const columns = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => <div>{row.getValue("title")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: "Post date",
            cell: ({ row }) => <div className="capitalize">{formatDate(row.getValue("createdAt"))}</div>,
        },
        {
            accessorKey: "updatedAt",
            header: "Last Update",
            cell: ({ row }) => <div className="capitalize">{formatDate(row.getValue("updatedAt"))}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const cate = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button  variant="ghost" className="h-8 w-8 p-0 ">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setEditCategoryId(cate._id);
                                setCategorytitle(cate.title);
                                setDialogOpen(true);
                            }}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(cate._id)}>
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

    const handleSubmit = async () => {
        try {
            const res = await axios.post('/api/category/', { categorytitle });
            if (res.status === 201) {
                setData((prevData) => [
                    ...prevData,
                    { _id: res.data._id, title: categorytitle, createdAt: new Date(), updatedAt: new Date() },
                ]);
                setDialogOpen(false)
                toast({
                    variant: '',
                    title: "Data uploaded successfully",
                    // description: "There was a problem with your request.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            }
        } catch (error) {
            console.error("Error add category:", error);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await axios.put(`/api/category/${editCategoryId}`, { categorytitle });
            if (res.status === 201) {
                fetchData()
                setDialogOpen(false)
                toast({
                    variant: '',
                    title: "Data Updated successfully",
                    // description: "There was a problem with your request.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            }
        } catch (error) {
            console.error("Error add category:", error);
        }
    };

    return (
        <DefaultLayout>
            <Toaster />
            <div className="flex justify-between">
                <h1 className='font-bold text-gray-700 text-2xl mb-7'>All Categories</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="text-white" onClick={() => {
                            setDialogOpen(true);
                            setCategorytitle(""); // Clear title for new category
                            setEditCategoryId(""); // Reset edit state
                        }}>Add New</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editCategoryId ? "Edit Category" : "Add New Category"}</DialogTitle>
                            <DialogDescription>
                                Fill in the details for the {editCategoryId ? "edit" : "new"} category.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="">
                            <Label htmlFor="posttitle" className="text-right">Title</Label>
                            <Input
                                id="posttitle"
                                placeholder="Enter title"
                                value={categorytitle} // Set the input value to categorytitle
                                onChange={(e) => setCategorytitle(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button className="text-white" type="submit" onClick={editCategoryId ? handleUpdate : handleSubmit}>
                                {editCategoryId ? "Update Category" : "Save Post"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter by title..."
                        value={(table.getColumn("title")?.getFilterValue()) ?? ""}
                        onChange={(event) =>
                            table.getColumn("title")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <DropdownMenu>
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
                </div>
                <div className="rounded-md border">
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
                                        No data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default DataTableDemo;