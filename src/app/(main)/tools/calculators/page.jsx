"use client";
import React, { Suspense } from "react";
import AllCalculator from "./calculators/page";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllCalculator />
    </Suspense>
  );
}
