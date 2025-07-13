import React, { useEffect, useRef, useState } from "react";

const GridComponent = ({ cellRefs, gridSize, cellSize, imageSize, highlightedIndexes, setHighlightedIndexes }) => {

  const imageURL = "/favicon.ico"; // replace with actual image path

  useEffect(() => {
    const newHighlights = [];

    const blockRows = 5;
    const blockCols = 5;
    const startRow = 0;
    const startCol = 0;

    // PUSHING HIGHLIGHTED PIXELS
    // Calculate the indexes for the 5x5 block starting at (startRow, startCol)
    /* const highlightedIndexes = [
   0,   1,   2,   3,   4,
 100, 101, 102, 103, 104,
 200, 201, 202, 203, 204,
 300, 301, 302, 303, 304,
 400, 401, 402, 403, 404
];
 */

    for (let r = 0; r < blockRows; r++) {
      for (let c = 0; c < blockCols; c++) {
        newHighlights.push((startRow + r) * gridSize + (startCol + c));
      }
    }

    setHighlightedIndexes(newHighlights);
  }, [gridSize]);

  return (
    <div
      className="grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
      }}
    >
      {Array.from({ length: gridSize * gridSize }, (_, i) => {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const isHighlighted = highlightedIndexes.includes(i);

        // Get local row/col inside 5x5 block
        const localRow = row;
        const localCol = col;

        return (
          <div
            key={i}
            ref={(el) => (cellRefs.current[i] = el)}
            className={`w-[${cellSize}px] h-[${cellSize}px] border border-gray-700`}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              backgroundColor: isHighlighted ? "transparent" : "#1f2937", // fallback bg
              backgroundImage: isHighlighted ? `url(${imageURL})` : "none",
              backgroundSize: `${imageSize}px ${imageSize}px`,
              backgroundPosition: isHighlighted
                ? `-${(col % 5) * cellSize}px -${(row % 5) * cellSize}px`
                : "none",
              backgroundRepeat: "no-repeat",
            }}
            title={`Pixel #${i}`}
          />
        );
      })}
    </div>
  );
};

export default GridComponent;
