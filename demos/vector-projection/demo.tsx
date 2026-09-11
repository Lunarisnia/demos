"use client";

import { useRef, useState } from "react";

type Vector = { x: number; y: number };

const WIDTH = 760;
const HEIGHT = 520;
const ORIGIN = { x: 380, y: 270 };
const SCALE = 56;

const presets: { label: string; a: Vector; b: Vector }[] = [
  { label: "Road", a: { x: 4, y: 3 }, b: { x: 1, y: 0 } },
  { label: "Slope", a: { x: 4, y: 2 }, b: { x: 2, y: 1.5 } },
  { label: "Opposite", a: { x: -3, y: 2 }, b: { x: 1, y: 0 } },
  { label: "Perpendicular", a: { x: -2, y: 3 }, b: { x: 3, y: 2 } },
];

function add(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}

function subtract(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y };
}

function multiply(vector: Vector, scalar: number): Vector {
  return { x: vector.x * scalar, y: vector.y * scalar };
}

function dot(a: Vector, b: Vector) {
  return a.x * b.x + a.y * b.y;
}

function length(vector: Vector) {
  return Math.hypot(vector.x, vector.y);
}

function toScreen(vector: Vector) {
  return {
    x: ORIGIN.x + vector.x * SCALE,
    y: ORIGIN.y - vector.y * SCALE,
  };
}

function format(value: number) {
  const clean = Math.abs(value) < 0.005 ? 0 : value;
  return clean.toFixed(2).replace(/\.00$/, "");
}

function VectorArrow({
  vector,
  start = { x: 0, y: 0 },
  color,
  label,
  dashed = false,
  marker,
}: {
  vector: Vector;
  start?: Vector;
  color: string;
  label: string;
  dashed?: boolean;
  marker: string;
}) {
  const from = toScreen(start);
  const to = toScreen(add(start, vector));
  const vectorLength = Math.hypot(to.x - from.x, to.y - from.y);
  const normalX = vectorLength > 0 ? -(to.y - from.y) / vectorLength : 0;
  const normalY = vectorLength > 0 ? (to.x - from.x) / vectorLength : 0;
  const labelX = from.x + (to.x - from.x) * 0.62 + normalX * 22;
  const labelY = from.y + (to.y - from.y) * 0.62 + normalY * 22;
  const labelWidth = label.length * 7.2 + 16;

  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth="4"
        strokeDasharray={dashed ? "9 8" : undefined}
        markerEnd={`url(#${marker})`}
      />
      <g className="projection-vector-label">
        <rect x={labelX - 8} y={labelY - 13} width={labelWidth} height="21" rx="3" fill="#11120f" opacity="0.9" />
        <text x={labelX} y={labelY + 1} fill={color}>{label}</text>
      </g>
    </g>
  );
}

export function VectorProjectionDemo() {
  const explanationRef = useRef<HTMLDialogElement>(null);
  const [a, setA] = useState<Vector>({ x: 4, y: 3 });
  const [b, setB] = useState<Vector>({ x: 1, y: 0 });
  const denominator = dot(b, b);
  const factor = denominator > 0.0001 ? dot(a, b) / denominator : 0;
  const projection = multiply(b, factor);
  const rejection = subtract(a, projection);
  const unitB = denominator > 0.0001 ? multiply(b, 1 / length(b)) : { x: 0, y: 0 };
  const amount = dot(a, unitB);
  const aPoint = toScreen(a);
  const bPoint = toScreen(b);
  const projectionPoint = toScreen(projection);
  const result = amount > 0.01 ? "along B" : amount < -0.01 ? "opposite B" : "perpendicular to B";

  const updateVector = (event: React.PointerEvent<SVGCircleElement>, target: "a" | "b") => {
    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!bounds) return;
    const next = {
      x: ((event.clientX - bounds.left) / bounds.width * WIDTH - ORIGIN.x) / SCALE,
      y: -((event.clientY - bounds.top) / bounds.height * HEIGHT - ORIGIN.y) / SCALE,
    };
    const clamped = {
      x: Math.max(-5.5, Math.min(5.5, next.x)),
      y: Math.max(-3.8, Math.min(3.8, next.y)),
    };
    if (target === "a") setA(clamped);
    else if (length(clamped) > 0.25) setB(clamped);
  };

  return (
    <div className="projection-demo">
      <div className="projection-canvas-wrap">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Interactive vector projection diagram">
          <defs>
            {[
              ["arrow-blue", "#73a6ff"],
              ["arrow-orange", "#ef7650"],
              ["arrow-yellow", "#d7ef50"],
              ["arrow-purple", "#c69bff"],
            ].map(([id, color]) => (
              <marker key={id} id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L7,3 z" fill={color} />
              </marker>
            ))}
            <pattern id="projection-grid" width={SCALE} height={SCALE} patternUnits="userSpaceOnUse">
              <path d={`M ${SCALE} 0 L 0 0 0 ${SCALE}`} fill="none" stroke="#292b26" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width={WIDTH} height={HEIGHT} fill="url(#projection-grid)" />
          <line x1="0" y1={ORIGIN.y} x2={WIDTH} y2={ORIGIN.y} stroke="#3d4038" />
          <line x1={ORIGIN.x} y1="0" x2={ORIGIN.x} y2={HEIGHT} stroke="#3d4038" />

          {denominator > 0.0001 && (
            <line
              x1={ORIGIN.x - unitB.x * 800}
              y1={ORIGIN.y + unitB.y * 800}
              x2={ORIGIN.x + unitB.x * 800}
              y2={ORIGIN.y - unitB.y * 800}
              stroke="#ef7650"
              strokeWidth="18"
              opacity="0.1"
            />
          )}

          <line x1={aPoint.x} y1={aPoint.y} x2={projectionPoint.x} y2={projectionPoint.y} stroke="#c69bff" strokeWidth="2" strokeDasharray="6 7" />
          <path d={`M ${projectionPoint.x} ${projectionPoint.y} l ${unitB.y * 13} ${unitB.x * 13} l ${-unitB.x * 13} ${unitB.y * 13}`} fill="none" stroke="#c69bff" strokeWidth="2" />

          <VectorArrow vector={b} color="#ef7650" label="B / ROAD" marker="arrow-orange" />
          <VectorArrow vector={projection} color="#d7ef50" label="ALONG" marker="arrow-yellow" />
          <VectorArrow vector={rejection} start={projection} color="#c69bff" label="SIDEWAYS" dashed marker="arrow-purple" />
          <VectorArrow vector={a} color="#73a6ff" label="A / ORIGINAL" marker="arrow-blue" />

          <circle cx={ORIGIN.x} cy={ORIGIN.y} r="5" fill="#f2efe5" />
          <circle
            cx={aPoint.x}
            cy={aPoint.y}
            r="13"
            fill="#73a6ff"
            className="projection-handle"
            onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
            onPointerMove={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && updateVector(event, "a")}
          />
          <circle
            cx={bPoint.x}
            cy={bPoint.y}
            r="13"
            fill="#ef7650"
            className="projection-handle"
            onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
            onPointerMove={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && updateVector(event, "b")}
          />
        </svg>

        <div className="projection-legend">
          <span><i className="legend-a" /> Drag blue A</span>
          <span><i className="legend-b" /> Drag orange B</span>
        </div>
      </div>

      <aside className="projection-panel">
        <div>
          <p className="projection-kicker">The road test</p>
          <h2>How much of A travels along B?</h2>
          <p className="projection-explanation">
            Treat B as a road or measuring rail. The yellow vector is the progress A makes along that road. Purple is the sideways movement the question ignores.
          </p>
          <button className="projection-help-button" type="button" onClick={() => explanationRef.current?.showModal()}>
            Projection & rejection explained
          </button>
        </div>

        <dialog
          className="projection-dialog"
          ref={explanationRef}
          onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
        >
          <form method="dialog">
            <button className="projection-dialog-close" aria-label="Close explanation">×</button>
            <p className="projection-kicker">Short summary</p>
            <h3>One vector, split into two useful parts.</h3>
            <div className="projection-dialog-item projection-dialog-along">
              <strong>Projection</strong>
              <p>The part of A that points along B. Think: progress along the road.</p>
            </div>
            <div className="projection-dialog-item projection-dialog-sideways">
              <strong>Rejection</strong>
              <p>The part of A perpendicular to B. Think: movement sideways off the road.</p>
            </div>
            <code>A = projection + rejection</code>
          </form>
        </dialog>

        <div className="projection-presets" aria-label="Examples">
          {presets.map((preset) => (
            <button key={preset.label} type="button" onClick={() => { setA(preset.a); setB(preset.b); }}>
              {preset.label}
            </button>
          ))}
        </div>

        <dl className="projection-values">
          <div><dt>Original A</dt><dd>({format(a.x)}, {format(a.y)})</dd></div>
          <div><dt>Direction B</dt><dd>({format(b.x)}, {format(b.y)})</dd></div>
          <div className="projection-result"><dt>Signed amount along B</dt><dd>{format(amount)}</dd><small>{result}</small></div>
          <div><dt>Projection</dt><dd>({format(projection.x)}, {format(projection.y)})</dd></div>
          <div><dt>Rejection</dt><dd>({format(rejection.x)}, {format(rejection.y)})</dd></div>
        </dl>

        <div className="projection-formula">
          <p>projection = B × dot(A, B) / dot(B, B)</p>
          <code>
            ({format(b.x)}, {format(b.y)}) × {format(dot(a, b))} / {format(denominator)} = ({format(projection.x)}, {format(projection.y)})
          </code>
        </div>

        <div className="projection-check">
          <span>A = projection + rejection</span>
          <strong>({format(a.x)}, {format(a.y)}) = ({format(projection.x)}, {format(projection.y)}) + ({format(rejection.x)}, {format(rejection.y)})</strong>
        </div>
      </aside>
    </div>
  );
}
