"use client";

import React, { useEffect, useRef, useState } from "react";
import { IconArray } from "@/types/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card } from "@/components/ui/card";

const RowCanvas = ({
  rowIndex,
  cols,
  highlightCount,
  cellSize,
}: {
  rowIndex: number;
  cols: number;
  highlightCount: number;
  cellSize: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = cols * cellSize;
    canvas.height = cellSize;

    const radius = cellSize / 2 - 2;

    for (let col = 0; col < cols; col++) {
      const idx = rowIndex * cols + col;
      const cx = col * cellSize + cellSize / 2;
      const cy = cellSize / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = idx < highlightCount ? "red" : "black";
      ctx.fill();
      ctx.strokeStyle = "#d1d5db";
      ctx.stroke();
    }
  }, [rowIndex, cols, highlightCount, cellSize]);

  return <canvas ref={canvasRef} className="block" />;
};

const PreviewPage = () => {
  const iconArray: IconArray = {
    rows: 20000,
    cols: 50,
    id: "blablabla",
    name: "Sample Icon Array",
    highlightCount: 7,
  };
  const parentRef = useRef<HTMLDivElement>(null);

  const [cellSize, setCellSize] = useState<number>(16); // Default value for cell size
  const rows = iconArray?.rows ?? 0;
  const cols = iconArray?.cols ?? 0;
  const highlightCount = iconArray?.highlightCount ?? 0;

  // Calculate maxWidth and cellSize once the component is mounted on the client
  useEffect(() => {
    const maxWidth = window.innerWidth > 1440 ? 1440 : window.innerWidth;
    const newCellSize = Math.floor(
      Math.min((maxWidth - 40) / Math.max(cols, 1), 16)
    );
    setCellSize(newCellSize);
  }, [cols]);

  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => cellSize,
    overscan: 100,
  });

  return (
    <main className="flex justify-center bg-white">
      <div className="flex max-h-[100dvh] w-full flex-col bg-white">
        <Card
          ref={parentRef}
          className="bg-white flex flex-col items-center overflow-auto w-full"
          style={{ position: "relative" }}
        >
          <div
            key={cellSize}
            style={{
              height: rowVirtualizer.getTotalSize(),
              width: cols * cellSize,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: virtualRow.start,
                  left: 0,
                  width: "100%",
                  height: cellSize,
                }}
              >
                <RowCanvas
                  rowIndex={virtualRow.index}
                  cols={cols}
                  highlightCount={highlightCount}
                  cellSize={cellSize}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
};

export default PreviewPage;
