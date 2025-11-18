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
            let url = "";
            switch (type) {
                case "contactus":
                    url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/leads`;
                    break;
                case "botleads":
                    url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/bot/leads`;
                    break;
                case "riskprofile":
                    url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/riskprofileuser`;
                    break;
                case "healthprofile":
                    url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/financialhealthuser`;
                    break;
                default:
                    url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/leads`;
            }

            const res = await axios.get(url);
            if (res.status === 200) {
                const leads = res?.data?.leads || res?.data || [];
                setData(Array.isArray(leads) ? leads : []);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData(activeTab);
    }, [activeTab]);

    const getColumns = () => {
        const baseColumns = [
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
        ];

        const dateColumn = {
            accessorKey: "createdAt",
            header: "Post Date",
            cell: ({ row }) => (
                <div className="capitalize">
                    {formatDate(row.getValue("createdAt"))}
                </div>
            ),
        };

        switch (activeTab) {
            case "contactus":
                return [
                    ...baseColumns,
                    {
                        accessorKey: "message",
                        header: "Message",
                        cell: ({ row }) => <div>{row.getValue("message")}</div>,
                    },
                    dateColumn,
                ];
            case "botleads":
                return [
                    ...baseColumns,
                    {
                        accessorKey: "services",
                        header: "Services",
                        cell: ({ row }) => <div>{row.getValue("services")}</div>,
                    },
                    {
                        accessorKey: "address",
                        header: "Address",
                        cell: ({ row }) => <div>{row.getValue("address")}</div>,
                    },
                    dateColumn,
                ];
            case "riskprofile":
                return [
                    ...baseColumns,
                    {
                        accessorKey: "message",
                        header: "Message",
                        cell: ({ row }) => <div>{row.getValue("message")}</div>,
                    },
                    {
                        accessorKey: "score",
                        header: "Score",
                        cell: ({ row }) => <div>{row.getValue("score")}</div>,
                    },
                    {
                        accessorKey: "riskprofile",
                        header: "Risk Profile",
                        cell: ({ row }) => <div>{row.getValue("riskprofile")}</div>,
                    },
                    dateColumn,
                ];
            case "healthprofile":
                return [
                    ...baseColumns,
                    {
                        accessorKey: "message",
                        header: "Message",
                        cell: ({ row }) => <div>{row.getValue("message")}</div>,
                    },
                    {
                        accessorKey: "score",
                        header: "Score",
                        cell: ({ row }) => <div>{row.getValue("score")}</div>,
                    },
                    {
                        accessorKey: "healthprofile",
                        header: "Health Profile",
                        cell: ({ row }) => <div>{row.getValue("healthprofile")}</div>,
                    },
                    dateColumn,
                ];
            default:
                return [...baseColumns, dateColumn];
        }
    };

    const columns = getColumns();

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
            <div className="flex flex-col gap-5">
                <div>
                    <h1 className="text-2xl font-bold">Leads</h1>
                </div>

                <div className="rounded-md bg-white p-3">
                    <div className="text-sm text-muted-foreground">
                        Total Leads: {data.length}
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        {[
                            { key: "contactus", label: "Contact Us Leads" },
                            { key: "botleads", label: "Bot Leads" },
                            { key: "riskprofile", label: "Risk Profile Leads" },
                            { key: "healthprofile", label: "Health Profile Leads" },
                        ].map((tab) => (
                            <Button
                                key={tab.key}
                                className={
                                    activeTab === tab.key
                                        ? "bg-[#2367f8] hover:bg-[#2367f8] text-white"
                                        : "border border-gray-400"
                                }
                                variant={activeTab === tab.key ? "default" : "outline"}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="rounded-md bg-white p-3">
                    <div className="flex items-center pb-4">
                        <Input
                            placeholder="Filter by email..."
                            value={table.getColumn("email")?.getFilterValue() ?? ""}
                            onChange={(event) =>
                                table.getColumn("email")?.setFilterValue(event.target.value)
                            }
                            className="max-w-xl border border-gray-400"
                        />
                    </div>

                    <div className="w-full">
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
                                        <TableCell
                                            colSpan={columns.length}
                                            className="text-center h-24"
                                        >
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
            </div>
        </DefaultLayout>
    );
};

export default DataTableDemo;
