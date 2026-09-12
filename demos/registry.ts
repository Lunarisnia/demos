import type { ComponentType } from "react";
import { LissajousDemo } from "./lissajous/demo";
import { VectorProjectionDemo } from "./vector-projection/demo";
import { CrossProductDemo } from "./cross-product/demo";
import { MatrixMultiplicationDemo } from "./matrix-multiplication/demo";

export type DemoCategory = "Mathematics" | "Computer graphics" | "Simulation";

export type Demo = {
  slug: string;
  title: string;
  description: string;
  category: DemoCategory;
  technology: string;
  glyph: string;
  accent: "orange" | "blue" | "acid" | "ink";
  component: ComponentType;
};

export const demos: Demo[] = [
  {
    slug: "matrix-multiplication",
    title: "Matrix Multiplication",
    description: "Watch rows meet columns and see how each dot product fills one cell of the resulting matrix.",
    category: "Mathematics",
    technology: "Interactive DOM",
    glyph: "[×]",
    accent: "orange",
    component: MatrixMultiplicationDemo,
  },
  {
    slug: "cross-product",
    title: "Cross Product",
    description: "Construct a vector perpendicular to two directions and connect its magnitude to the area between them.",
    category: "Mathematics",
    technology: "Interactive SVG",
    glyph: "×",
    accent: "blue",
    component: CrossProductDemo,
  },
  {
    slug: "vector-projection",
    title: "Vector Projection",
    description: "Split a vector into its along-the-road and sideways parts, and see what the dot product actually measures.",
    category: "Mathematics",
    technology: "Interactive SVG",
    glyph: "↘",
    accent: "acid",
    component: VectorProjectionDemo,
  },
  {
    slug: "lissajous-curves",
    title: "Lissajous Curves",
    description: "Trace harmonic motion and watch simple frequency ratios form intricate figures.",
    category: "Mathematics",
    technology: "Canvas 2D",
    glyph: "∞",
    accent: "orange",
    component: LissajousDemo,
  },
];

export const categories = [...new Set(demos.map((demo) => demo.category))];

export function getDemo(slug: string) {
  return demos.find((demo) => demo.slug === slug);
}
