"use client";

import { useEffect, useRef, useState } from "react";

export function LissajousDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frequency, setFrequency] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let animationId = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const bounds = canvas.getBoundingClientRect();
      canvas.width = bounds.width * ratio;
      canvas.height = bounds.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const radius = Math.min(width, height) * 0.34;
      const phase = frame * 0.008;

      context.fillStyle = "rgba(17, 18, 15, 0.16)";
      context.fillRect(0, 0, width, height);
      context.beginPath();

      for (let step = 0; step <= 600; step += 1) {
        const t = (step / 600) * Math.PI * 2;
        const x = width / 2 + Math.sin(frequency * t + phase) * radius;
        const y = height / 2 + Math.sin((frequency - 1) * t) * radius;
        if (step === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.strokeStyle = "#bbd928";
      context.lineWidth = 1.35;
      context.stroke();
      frame += 1;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [frequency]);

  return (
    <div className="lissajous-demo">
      <canvas ref={canvasRef} aria-label="Animated Lissajous curve" />
      <label>
        Frequency ratio
        <input type="range" min="2" max="8" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} />
        <output>{frequency}:{frequency - 1}</output>
      </label>
    </div>
  );
}
