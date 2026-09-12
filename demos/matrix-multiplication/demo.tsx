"use client";

import { useEffect, useState } from "react";

type Matrix = number[][];
type Cell = { row: number; column: number };

const examples: { label: string; a: Matrix; b: Matrix }[] = [
  { label: "Basic", a: [[1, 2, 3], [4, 5, 6]], b: [[7, 8], [9, 10], [11, 12]] },
  { label: "Transform", a: [[1, 0, 3], [0, 1, 2]], b: [[2, 0], [0, 2], [1, 1]] },
  { label: "Signs", a: [[2, -1, 3], [0, 4, -2]], b: [[1, 3], [-2, 0], [4, -1]] },
];

function multiply(a: Matrix, b: Matrix) {
  return a.map((row) => b[0].map((_, column) => row.reduce((sum, value, index) => sum + value * b[index][column], 0)));
}

function MatrixEditor({ matrix, name, active, mode, onChange }: { matrix: Matrix; name: string; active: Cell; mode: "row" | "column"; onChange: (matrix: Matrix) => void }) {
  return (
    <div className={`matrix-block matrix-${name.toLowerCase()}`}>
      <div className="matrix-name"><strong>{name}</strong><span>{matrix.length} × {matrix[0].length}</span></div>
      <div className="matrix-brackets">
        <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}>
          {matrix.flatMap((row, rowIndex) => row.map((value, columnIndex) => {
            const highlighted = mode === "row" ? rowIndex === active.row : columnIndex === active.column;
            return (
              <input
                aria-label={`${name} row ${rowIndex + 1}, column ${columnIndex + 1}`}
                className={highlighted ? "is-highlighted" : ""}
                key={`${rowIndex}-${columnIndex}`}
                type="number"
                value={value}
                onChange={(event) => {
                  const next = matrix.map((currentRow) => [...currentRow]);
                  next[rowIndex][columnIndex] = Number(event.target.value);
                  onChange(next);
                }}
              />
            );
          }))}
        </div>
      </div>
    </div>
  );
}

export function MatrixMultiplicationDemo() {
  const [a, setA] = useState<Matrix>(examples[0].a);
  const [b, setB] = useState<Matrix>(examples[0].b);
  const [active, setActive] = useState<Cell>({ row: 0, column: 0 });
  const [playing, setPlaying] = useState(false);
  const result = multiply(a, b);
  const resultRows = a.length;
  const resultColumns = b[0].length;
  const row = a[active.row];
  const column = b.map((currentRow) => currentRow[active.column]);
  const terms = row.map((value, index) => value * column[index]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        const index = current.row * resultColumns + current.column;
        const next = (index + 1) % (resultRows * resultColumns);
        return { row: Math.floor(next / resultColumns), column: next % resultColumns };
      });
    }, 1200);
    return () => window.clearInterval(timer);
  }, [playing, resultRows, resultColumns]);

  return (
    <div className="matrix-demo">
      <section className="matrix-workbench">
        <div className="matrix-equation">
          <MatrixEditor matrix={a} name="A" active={active} mode="row" onChange={setA} />
          <span className="matrix-operator">×</span>
          <MatrixEditor matrix={b} name="B" active={active} mode="column" onChange={setB} />
          <span className="matrix-operator">=</span>
          <div className="matrix-block matrix-c">
            <div className="matrix-name"><strong>C</strong><span>{result.length} × {result[0].length}</span></div>
            <div className="matrix-brackets">
              <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${result[0].length}, 1fr)` }}>
                {result.flatMap((resultRow, rowIndex) => resultRow.map((value, columnIndex) => (
                  <button
                    aria-label={`Explain result row ${rowIndex + 1}, column ${columnIndex + 1}`}
                    className={rowIndex === active.row && columnIndex === active.column ? "is-active" : ""}
                    key={`${rowIndex}-${columnIndex}`}
                    type="button"
                    onClick={() => { setPlaying(false); setActive({ row: rowIndex, column: columnIndex }); }}
                  >
                    {value}
                  </button>
                ))) }
              </div>
            </div>
          </div>
        </div>

        <div className="matrix-path" aria-hidden="true">
          <span>A row {active.row + 1}</span>
          <i>meets</i>
          <span>B column {active.column + 1}</span>
          <i>to fill</i>
          <span>C<sub>{active.row + 1},{active.column + 1}</sub></span>
        </div>

        <div className="matrix-calculation">
          <p>Pair, multiply, then add</p>
          <div className="matrix-terms">
            {row.map((value, index) => (
              <span key={index}>
                <small>{value} × {column[index]}</small>
                <strong>{terms[index]}</strong>
                {index < row.length - 1 && <i>+</i>}
              </span>
            ))}
            <b>=</b>
            <output>{result[active.row][active.column]}</output>
          </div>
        </div>
      </section>

      <aside className="matrix-panel">
        <div>
          <p className="projection-kicker">Row meets column</p>
          <h2>Each result cell is one dot product.</h2>
          <p className="projection-explanation">Choose a cell in C. Take the matching row from A and column from B, multiply corresponding numbers, then add those products.</p>
        </div>

        <button className={`matrix-play ${playing ? "is-playing" : ""}`} type="button" onClick={() => setPlaying((current) => !current)}>
          {playing ? "Pause walkthrough" : "Play all cells"}
        </button>

        <div className="matrix-presets">
          {examples.map((example) => <button key={example.label} type="button" onClick={() => { setPlaying(false); setA(example.a); setB(example.b); setActive({ row: 0, column: 0 }); }}>{example.label}</button>)}
        </div>

        <div className="matrix-rule">
          <span>Why 2 × 3 times 3 × 2?</span>
          <div><strong>2 × <em>3</em></strong><i>×</i><strong><em>3</em> × 2</strong></div>
          <p>The inside dimensions must match: every A row has 3 values and every B column has 3 values. The outside dimensions become the result: 2 × 2.</p>
        </div>

        <div className="matrix-summary">
          <p>C<sub>{active.row + 1},{active.column + 1}</sub> = row {active.row + 1} of A · column {active.column + 1} of B</p>
          <code>{terms.join(" + ")} = {result[active.row][active.column]}</code>
        </div>
      </aside>
    </div>
  );
}
