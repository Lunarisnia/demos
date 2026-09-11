import type { ComponentType } from "react";
import { LissajousDemo } from "./lissajous/demo";
import { VectorProjectionDemo } from "./vector-projection/demo";

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
