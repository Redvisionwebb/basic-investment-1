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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
const DataTableDemo = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState("contactus");
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    const fetchData = async (type) => {
        setLoading(true);
        try {
            switch (type) {
                case 'contactus': {
                    const res = await axios.get("/api/leads");
                    if (res.status === 200) {
                        setData(res?.data?.leads || {});
                    } else {
                        setData({});
                    }
                    break;
                }
                case 'riskprofile': {
                    const res = await axios.get("/api/riskprofileuser");
                    // console.log(res.data)
                    if (res.status === 200) {
                        setData(res?.data || {});
                    } else {
                        setData({});
                    }
                    break;
                }
                case 'healthprofile': {
                    const res = await axios.get("/api/financialhealthuser");
                    if (res.status === 200) {
                        setData(res?.data || {});
                    } else {
                        setData({});
                    }
                    break;
                }
                default: {
                    const res = await axios.get("/api/leads");
                    if (res.status === 200) {
                        setData(res?.data?.leads || {});
                    } else {
                        setData({});
                    }
                    break;
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setData({});
        } finally {
            setLoading(false);
        }
    };
    
 

    React.useEffect(() => {
        fetchData(activeTab);
    }, [activeTab]);

    const columns = [
        {
            id: "srno",
            header: "S. No.",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div>{row.getValue("email")}</div>,
        },
        {
            accessorKey: "mobile",
            header: "Mobile",
            cell: ({ row }) => <div>{row.getValue("mobile")}</div>,
        },
        {
            accessorKey: "message",
            header: "Message",
            cell: ({ row }) => <div>{row.getValue("message")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: "Post Date",
            cell: ({ row }) => (
                <div className="capitalize">
                    {formatDate(row.getValue("createdAt"))}
                </div>
            ),
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-700 mb-2">Leads</h1>
                <div className="text-sm text-muted-foreground">
                    Total Leads: {data.length}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Button
                    
                    className={activeTab === "contactus" ? "text-white bg-[var(--primary)]" : ""}
                        variant={activeTab === "contactus" ? "default" : "outline"}
                        onClick={() => setActiveTab("contactus")}
                    >
                        Contact Us Leads
                    </Button>
                    <Button
                    className={activeTab === "riskprofile" ? "text-white bg-[var(--primary)]" : ""}
                        variant={activeTab === "riskprofile" ? "default" : "outline"}
                        onClick={() => setActiveTab("riskprofile")}
                    >
                        Risk Profile Leads
                    </Button>
                    <Button
                    className={activeTab === "healthprofile" ? "text-white bg-[var(--primary)]" : ""}
                        variant={activeTab === "healthprofile" ? "default" : "outline"}
                        onClick={() => setActiveTab("healthprofile")}
                    >
                        Health Profile Leads
                    </Button>
                </div>
            </div>

            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter by email..."
                        value={table.getColumn("email")?.getFilterValue() ?? ""}
                        onChange={(event) =>
                            table.getColumn("email")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
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
                                    <TableCell colSpan={columns.length} className="text-center h-24">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
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
        </DefaultLayout>
    );
};

export default DataTableDemo;
