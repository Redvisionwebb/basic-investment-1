"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card";

const CompareFundsTable2 = ({ allData, selectedFundsNames }) => {

  return (
    <div className="container mx-auto mt-5 space-y-6">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="font-semibold">Scheme Details</TableHead>
                {selectedFundsNames.map((fund, index) => (
                  <TableHead key={index} className="font-semibold text-center">
                    {fund}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className=" ">
                <TableCell className="font-medium">Latest NAV</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`nav-${index}`} className="text-center">
                    {fund.schemeDetails.latestNav}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className=" ">
                <TableCell className="font-medium">Fund Manager</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`manager-${index}`} className="text-center">
                    {fund.schemeDetails.fundManager}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className=" ">
                <TableCell className="font-medium  ">Last 1 Mon(%)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`1m-${index}`} className="text-center">
                    {fund?.schemeDetails?.last1Mon}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className=" ">
                <TableCell className="font-medium  ">Last 3 Mon(%)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`3m-${index}`} className="text-center">
                    {fund?.schemeDetails?.last3Mon}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className=" ">
                <TableCell className="font-medium  ">Last 6 Mon(%)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`6m-${index}`} className="text-center">
                    {fund?.schemeDetails?.last6Mon}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className=" ">
                <TableCell className="font-medium  ">Last 1 Year(%)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`1y-${index}`} className="text-center">
                    {fund.schemeDetails.last1Year}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className=" ">
                <TableCell className="font-medium  ">Last 3 Year(%)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`3y-${index}`} className="text-center">
                    {fund.schemeDetails.last3Year}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className=" ">
                <TableCell className="font-medium  ">Last 5 Year(%)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`5y-${index}`} className="text-center">
                    {fund.schemeDetails.last5Year}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className=" ">
                <TableCell className="font-medium  ">SI(%)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`si-${index}`} className="text-center">
                    {fund.schemeDetails.si}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className=" ">
                <TableCell className="font-medium  ">Inception Date</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`inception-${index}`} className="text-center">
                    {fund.schemeDetails.inceptionDate.split(",")[0]}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className=" ">
                <TableCell className="font-medium  ">Corpus</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`corpus-${index}`} className="text-center">
                    {fund.schemeDetails.corpus}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className=" ">
                <TableCell className="font-medium  ">Sch. Category</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`category-${index}`} className="text-center">
                    {fund.schemeDetails.schCategory}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className=" ">
                <TableCell className="font-medium  ">SD(3Yr)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`Sd-${index}`} className="text-center">
                    {fund.schemeDetails && fund.schemeDetails.sd !== null ? fund.schemeDetails.sd : "N/A"}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className=" ">
                <TableCell className="font-medium  ">Beta Ratio(3Yr)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`betaratio-${index}`} className="text-center">
                    {fund.schemeDetails && fund.schemeDetails.betaRatio !== null ? fund.schemeDetails.betaRatio : "N/A"}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className=" ">
                <TableCell className="font-medium  ">Sharpe Ratio(3Yr)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`SharpeRatio-${index}`} className="text-center">
                    {fund.schemeDetails && fund.schemeDetails.sharpeRatio !== null ? fund.schemeDetails.sharpeRatio : "N/A"}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className=" ">
                <TableCell className="font-medium  ">Sch. BenchMark</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`SchBenchMark-${index}`} className="text-center">
                    {fund.schemeDetails.schBenchMark}
                  </TableCell>
                ))}
              </TableRow>


              <TableRow className=" ">
                <TableCell className="font-medium  ">Equity Holding(%)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`EquityHolding-${index}`} className="text-center">
                    {fund.schemeDetails.equityHolding}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className=" ">
                <TableCell className="font-medium  ">Debt Holding(%)</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`DebtHolding-${index}`} className="text-center">
                    {fund.schemeDetails.debtHolding}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className=" ">
                <TableCell className="font-medium  ">Total Stock Holding</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`TotalStock-${index}`} className="text-center">
                    {fund.schemeDetails.totalStockHolding}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className=" ">
                <TableCell className="font-medium  ">Total Debt Holding</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`TotalDebtHolding-${index}`} className="text-center">
                    {fund.schemeDetails.totalDebtHolding}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className=" ">
                <TableCell className="font-medium  ">Assets in top 10 Holding</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`Assets-${index}`} className="text-center">
                    {fund.schemeDetails.assetsInTop10Holding}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className=" ">
                <TableCell className="font-medium  ">Exit Load</TableCell>
                {allData.map((fund, index) => (
                  <TableCell key={`exitLoad-${index}`} className="text-center">
                    {fund.schemeDetails.exitLoad}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompareFundsTable2;
