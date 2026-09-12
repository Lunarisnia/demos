"use client";

import { useState } from "react";

type Vector3 = { x: number; y: number; z: number };

const presets: { label: string; a: Vector3; b: Vector3 }[] = [
  { label: "XY plane", a: { x: 3, y: 0, z: 0 }, b: { x: 0, y: 2, z: 0 } },
  { label: "Tilted", a: { x: 3, y: 1, z: 0 }, b: { x: -1, y: 2, z: 1 } },
  { label: "Parallel", a: { x: 2, y: 1, z: 0 }, b: { x: 4, y: 2, z: 0 } },
];

function cross(a: Vector3, b: Vector3): Vector3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dot(a: Vector3, b: Vector3) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function magnitude(vector: Vector3) {
  return Math.hypot(vector.x, vector.y, vector.z);
}

function add(a: Vector3, b: Vector3): Vector3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function format(value: number) {
  const clean = Math.abs(value) < 0.005 ? 0 : value;
  return clean.toFixed(2).replace(/\.00$/, "");
}

function VectorInputs({ label, value, onChange, color }: { label: string; value: Vector3; onChange: (vector: Vector3) => void; color: string }) {
  return (
    <fieldset className="cross-vector-inputs" style={{ "--vector-color": color } as React.CSSProperties}>
      <legend>{label}</legend>
      {(["x", "y", "z"] as const).map((axis) => (
        <label key={axis}>
          {axis}
          <input type="number" min="-5" max="5" step="0.5" value={value[axis]} onChange={(event) => onChange({ ...value, [axis]: Number(event.target.value) })} />
        </label>
      ))}
    </fieldset>
  );
}

export function CrossProductDemo() {
  const [a, setA] = useState<Vector3>({ x: 3, y: 0, z: 0 });
  const [b, setB] = useState<Vector3>({ x: 0, y: 2, z: 0 });
  const [yaw, setYaw] = useState(-32);
  const result = cross(a, b);
  const area = magnitude(result);
  const denominator = magnitude(a) * magnitude(b);
  const angle = denominator > 0 ? Math.acos(Math.max(-1, Math.min(1, dot(a, b) / denominator))) * 180 / Math.PI : 0;

  const project = (vector: Vector3) => {
    const radians = yaw * Math.PI / 180;
    const rotatedX = vector.x * Math.cos(radians) - vector.z * Math.sin(radians);
    const rotatedZ = vector.x * Math.sin(radians) + vector.z * Math.cos(radians);
    return { x: 370 + rotatedX * 62, y: 310 - vector.y * 62 + rotatedZ * 28 };
  };

  const origin = project({ x: 0, y: 0, z: 0 });
  const pa = project(a);
  const pb = project(b);
  const pab = project(add(a, b));
  const normalScale = area > 0 ? Math.min(1, 3.8 / area) : 0;
  const normal = { x: result.x * normalScale, y: result.y * normalScale, z: result.z * normalScale };
  const pn = project(normal);

  const arrow = (to: { x: number; y: number }, color: string, marker: string, label: string) => (
    <g>
      <line x1={origin.x} y1={origin.y} x2={to.x} y2={to.y} stroke={color} strokeWidth="5" markerEnd={`url(#${marker})`} />
      <text x={to.x + 10} y={to.y - 10} fill={color}>{label}</text>
    </g>
  );

  return (
    <div className="cross-demo">
      <div className="cross-scene">
        <svg viewBox="0 0 740 620" role="img" aria-label="Three-dimensional cross product visualization">
          <defs>
            {[["cross-a", "#73a6ff"], ["cross-b", "#ef7650"], ["cross-n", "#d7ef50"]].map(([id, color]) => (
              <marker key={id} id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L7,3 z" fill={color} /></marker>
            ))}
          </defs>
          <g className="cross-axes">
            {(["x", "y", "z"] as const).map((axis) => {
              const vector = { x: 0, y: 0, z: 0, [axis]: 4.5 };
              const positive = project(vector);
              const negative = project({ x: -vector.x, y: -vector.y, z: -vector.z });
              return <line key={axis} x1={negative.x} y1={negative.y} x2={positive.x} y2={positive.y} />;
            })}
          </g>
          <polygon points={`${origin.x},${origin.y} ${pa.x},${pa.y} ${pab.x},${pab.y} ${pb.x},${pb.y}`} fill="#d7ef50" fillOpacity="0.1" stroke="#d7ef50" strokeOpacity="0.5" strokeDasharray="7 6" />
          <line x1={pa.x} y1={pa.y} x2={pab.x} y2={pab.y} stroke="#ef7650" strokeOpacity="0.45" strokeDasharray="6 6" />
          <line x1={pb.x} y1={pb.y} x2={pab.x} y2={pab.y} stroke="#73a6ff" strokeOpacity="0.45" strokeDasharray="6 6" />
          {arrow(pa, "#73a6ff", "cross-a", "A")}
          {arrow(pb, "#ef7650", "cross-b", "B")}
          {area > 0.001 && arrow(pn, "#d7ef50", "cross-n", "A × B")}
          <circle cx={origin.x} cy={origin.y} r="5" fill="#f2efe5" />
        </svg>
        <div className="cross-orbit">
          <label>Rotate view <input type="range" min="-180" max="180" value={yaw} onChange={(event) => setYaw(Number(event.target.value))} /></label>
        </div>
      </div>

      <aside className="cross-panel">
        <div>
          <p className="projection-kicker">The surface test</p>
          <h2>Which way faces out?</h2>
          <p className="projection-explanation">A and B span a surface. Their cross product points perpendicular to that surface, while its length equals the parallelogram&apos;s area.</p>
        </div>

        <div className="cross-presets">
          {presets.map((preset) => <button key={preset.label} type="button" onClick={() => { setA(preset.a); setB(preset.b); }}>{preset.label}</button>)}
          <button type="button" onClick={() => { setA(b); setB(a); }}>Swap A ↔ B</button>
        </div>

        <VectorInputs label="Vector A" value={a} onChange={setA} color="#73a6ff" />
        <VectorInputs label="Vector B" value={b} onChange={setB} color="#ef7650" />

        <div className="cross-result">
          <p>A × B</p>
          <strong>({format(result.x)}, {format(result.y)}, {format(result.z)})</strong>
          <span>{area < 0.001 ? "No unique normal: A and B are parallel." : "Perpendicular to both A and B."}</span>
        </div>

        <dl className="cross-facts">
          <div><dt>Angle</dt><dd>{format(angle)}°</dd></div>
          <div><dt>Area / |A × B|</dt><dd>{format(area)}</dd></div>
          <div><dt>(A × B) · A</dt><dd>{format(dot(result, a))}</dd></div>
          <div><dt>(A × B) · B</dt><dd>{format(dot(result, b))}</dd></div>
        </dl>

        <div className="cross-rule"><span>Right-hand rule</span><p>Point your index finger along A and curl toward B. Your thumb points along A × B. Swap A and B, and the direction flips.</p></div>
      </aside>
    </div>
  );
}
