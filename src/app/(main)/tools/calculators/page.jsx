"use client";
import React, { Suspense } from "react";
import InnerCalculatorsPage from "./InnerCalculatorsPage";
import CalculatorPage from "../../calculators/page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* <InnerCalculatorsPage /> */}
      <CalculatorPage />
    </Suspense>
  );
}
