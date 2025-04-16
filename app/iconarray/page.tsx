"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const IconArray = z
  .object({
    rows: z.coerce
      .number()
      .min(1, { message: "Number of rows must be at least 1" })
      .max(30, { message: "Number of rows must be at most 30" }),

    columns: z.coerce
      .number()
      .min(1, { message: "Number of columns must be at least 1" })
      .max(30, { message: "Number of columns must be at most 30" }),

    highlighted: z.coerce
      .number()
      .min(0, { message: "Highlighted count must be at least 0" })
      .max(900, { message: "Highlighted count must not exceed 900" }), // We will update this in superRefine
  })
  .refine(
    (data) => {
      const totalCells = data.rows * data.columns;
      return !(data.highlighted > totalCells);
    },
    {
      message: "Highlighted count must be less than row x col",
      path: ["highlighted"], // path of error
    }
  );

const IconArrayPage = () => {
  // State to store form values and generated icon array
  const [rows, setRows] = useState(15);
  const [columns, setColumns] = useState(15);
  const [highlighted, setHighlighted] = useState(15);
  const [iconArray, setIconArray] = useState<string[][]>([]);

  useEffect(() => {
    const row = 15;
    const col = 15;
    const highlight = 15;
    const totalCells = row * col;
    const positions = Array.from({ length: totalCells }, (_, index) => ({
      row: Math.floor(index / col),
      col: index % col,
    }));
    shuffleArray(positions);
    const array = Array.from({ length: row }, () =>
      Array(columns).fill("normal")
    );
    for (let i = 0; i < highlight; i++) {
      const { row, col } = positions[i];
      array[row][col] = "highlighted";
    }
    setIconArray(array);
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof IconArray>>({
    resolver: zodResolver(IconArray),
    defaultValues: {
      rows: rows,
      columns: columns,
      highlighted: highlighted,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof IconArray>) {
    console.log(values);
    const { rows, columns, highlighted } = values;
    setRows(rows);
    setColumns(columns);
    setHighlighted(highlighted);

    // Generate all possible positions in the grid (row, column pairs)
    const totalCells = rows * columns;
    const positions = Array.from({ length: totalCells }, (_, index) => ({
      row: Math.floor(index / columns),
      col: index % columns,
    }));

    // Shuffle positions array to randomize the highlighted cells
    shuffleArray(positions);

    // Select the first `highlighted` number of positions and set them as highlighted
    const array = Array.from({ length: rows }, () =>
      Array(columns).fill("normal")
    );
    for (let i = 0; i < highlighted; i++) {
      const { row, col } = positions[i];
      array[row][col] = "highlighted";
    }

    // Update the icon array state
    setIconArray(array);
  }

  function shuffleArray(array: { row: number; col: number }[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // 3. Calculate dynamic icon size based on both rows and columns
  const calculateIconSize = () => {
    const gridWidth = 100 / columns; // width percentage per column
    const gridHeight = 100 / rows; // height percentage per row

    // The icon size will be the smaller of the available width or height
    return `calc(min(${15 * gridWidth}%, ${15 * gridHeight}%))`;
  };

  return (
    <main className="flex justify-center p-4 min-h-[100vh]">
      <Card className="p-4 md:min-w-[80%] md:min-h-[60%] flex flex-col">
        <h1 className="text-center">Icon Array Generator</h1>
        <Separator />
        <section className="flex flex-col md:flex-row flex-1 gap-4">
          <Card className="p-4 flex-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Row Input */}
                <FormField
                  control={form.control}
                  name="rows"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rows</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of rows"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the number of rows in the icon array.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Column Input */}
                <FormField
                  control={form.control}
                  name="columns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Columns</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of columns"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the number of columns in the icon array.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Highlighted Input */}
                <FormField
                  control={form.control}
                  name="highlighted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highlighted</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Highlighted icons"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the number of highlighted icons (must be less than
                        or equal to rows * columns).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button type="submit">Generate</Button>
                </div>
              </form>
            </Form>
          </Card>

          {/* Image container or results */}
          <Card id="image-container" className="flex-1 flex justify-center p-4">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: "8px", // Fixed gap between icons
              }}
            >
              {iconArray.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      width: calculateIconSize(), // Dynamically calculate icon size
                      aspectRatio: "1", // Keep a square aspect ratio
                      borderRadius: "50%", // Circle shape
                      backgroundColor: cell === "highlighted" ? "red" : "gray",
                    }}
                  />
                ))
              )}
            </div>
          </Card>
        </section>
      </Card>
    </main>
  );
};

export default IconArrayPage;
