import { useRef, useEffect } from "react";

export default function PixelCanvas() {
  const canvasRef = useRef(null);
  const pixelSize = 2; // each pixel block size in px
  const gridSize = 5000; // 5000 x 5000

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const visibleCols = Math.ceil(canvas.width / pixelSize);
    const visibleRows = Math.ceil(canvas.height / pixelSize);

    for (let y = 0; y < visibleRows; y++) {
      for (let x = 0; x < visibleCols; x++) {
        const gray = Math.floor(Math.random() * 50 + 10); // random dark gray
        ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
    />
  );
}
