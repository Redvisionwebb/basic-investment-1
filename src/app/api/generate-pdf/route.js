// app/api/generate-pdf/route.js
import { PDFDocument } from 'pdf-lib';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { arnNumber, pdfpath, axis, euin, euinAxis } = await request.json();
  // console.log(arnNumber, pdfpath, axis, euin, euinAxis)
  if (!arnNumber) {
    return new NextResponse(JSON.stringify({ error: 'ARN number is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response = await fetch(pdfpath);
  const pdfBuffer = await response.arrayBuffer();

  // Load the PDF using pdf-lib
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const page = pdfDoc.getPages()[0];


  page.drawText(arnNumber, {
    x: axis.x,
    y: axis.y,
    size: 10,
  });

  // Add the EUIN number at specified coordinates
  page.drawText(euin, {
    x: euinAxis.x, // Using separate euinAxis.x for EUIN number's x-coordinate
    y: euinAxis.y, // Using separate euinAxis.y for EUIN number's y-coordinate
    size: 10,
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=filled_document.pdf',
    },
  });
}
