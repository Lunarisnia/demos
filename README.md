# Field Notes / Demos

A central repository for interactive mathematics, computer graphics, and simulation demos.

## Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Add a demo

1. Create `demos/<slug>/demo.tsx` and export a React component.
2. Add its metadata to `demos/registry.ts`.
3. Assign the component to `component`.

The registry automatically populates the home catalog, in-page experiment switcher, and `/demos/<slug>` route. Client-side Canvas, WebGL, or WebGPU experiments should include `"use client"` in their component file.

## Structure

```text
app/
  demos/[slug]/page.tsx  Shared experiment route
  page.tsx               Demo catalog
demos/
  registry.ts            Metadata and component registry
  <slug>/demo.tsx        Colocated experiment implementation
```

## Checks

```bash
pnpm lint
pnpm build
```
