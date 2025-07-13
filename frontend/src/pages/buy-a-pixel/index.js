import React, { useRef, useState } from "react";
import { useRouter } from "next/router";

const gridSize = 100;
const cellSize = 30;
const miniMapSize = 10;

const BuyPixelPage = () => {

  const router = useRouter();


  if(localStorage.getItem("token") === null){
    alert("Please login first");
    router.push("/login");
  }

  const cellRefs = useRef([]);
  const containerRef = useRef(null);

  const soldPixels = [45, 200, 345, 999, 1505, 1506, 1507];
  const [selectedPixels, setSelectedPixels] = useState(new Set());
  const [highlightedIndexes, setHighlightedIndexes] = useState([]);

  const [isSelecting, setIsSelecting] = useState(false);
  const [startIndex, setStartIndex] = useState(null);

  const handleMouseDown = (index) => {
    if (soldPixels.includes(index)) return;
    setIsSelecting(true);
    setStartIndex(index);
    setSelectedPixels(new Set([index]));
  };

const handleMouseOver = (index) => {
  // if (!isSelecting) return;
  if (startIndex === null) return;

  const startRow = Math.floor(startIndex / gridSize);
  const startCol = startIndex % gridSize;

  const endRow = Math.floor(index / gridSize);
  const endCol = index % gridSize;

  const rowMin = Math.min(startRow, endRow);
  const rowMax = Math.max(startRow, endRow);
  const colMin = Math.min(startCol, endCol);
  const colMax = Math.max(startCol, endCol);

  let blocked = false;
  const newSet = new Set();

  for (let row = rowMin; row <= rowMax; row++) {
    for (let col = colMin; col <= colMax; col++) {
      const i = row * gridSize + col;
      if (soldPixels.includes(i)) {
        blocked = true;
        break;
      }
      newSet.add(i);
    }
    if (blocked) break;
  }

  if (blocked) {
    alert("You cannot select this area as it contains already sold pixels.");
    setIsSelecting(false);
    setStartIndex(null);
    setSelectedPixels(new Set()); // Optional: reset current selection
    return;
  }

  setSelectedPixels(newSet);
};

  const handleMouseUp = () => {
    setIsSelecting(false);
    setStartIndex(null);
    console.log("Pixels selected:", [...selectedPixels]);
  };

  const scrollToPixelGroup = (miniIndex) => {
    const groupSize = 10;
    const row = Math.floor(miniIndex / miniMapSize);
    const col = miniIndex % miniMapSize;

    const startRow = row * groupSize;
    const startCol = col * groupSize;

    const blockIndexes = [];
    for (let r = 0; r < groupSize; r++) {
      for (let c = 0; c < groupSize; c++) {
        const idx = (startRow + r) * gridSize + (startCol + c);
        blockIndexes.push(idx);
      }
    }

    const centerRow = startRow + Math.floor(groupSize / 2);
    const centerCol = startCol + Math.floor(groupSize / 2);
    const centerIndex = centerRow * gridSize + centerCol;

    const cell = cellRefs.current[centerIndex];
    const container = containerRef.current;

    if (cell && container) {
      const offsetTop =
        cell.offsetTop - container.clientHeight / 2 + cell.clientHeight / 2;
      const offsetLeft =
        cell.offsetLeft - container.clientWidth / 2 + cell.clientWidth / 2;

      container.scrollTo({
        top: offsetTop,
        left: offsetLeft,
        behavior: "smooth",
      });
    }

    setHighlightedIndexes(blockIndexes);
    setTimeout(() => setHighlightedIndexes([]), 2000);
  };

  const getMiniMapBlockStatus = (blockIndex) => {
    const blockRow = Math.floor(blockIndex / miniMapSize);
    const blockCol = blockIndex % miniMapSize;
    const startPixelRow = blockRow * 10;
    const startPixelCol = blockCol * 10;

    let hasSold = false;
    let hasSelected = false;

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const pixelIndex = (startPixelRow + r) * gridSize + (startPixelCol + c);
        if (soldPixels.includes(pixelIndex)) hasSold = true;
        if (selectedPixels.has(pixelIndex)) hasSelected = true;
      }
    }

    if (hasSelected) return "selected";
    if (hasSold) return "sold";
    return "free";
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4"
      onMouseUp={handleMouseUp}
    >
      {/* Header + Mini Map */}
      <div className="flex items-center justify-between w-full flex-wrap gap-4">
        <div className="flex flex-wrap w-10/12">
          <h1 className="text-3xl font-bold flex flex-wrap">
            {"BUY A PIXEL".split("").map((char, i) => {
              const isSpace = char === " " || char === "⠀";
              return (
                <div
                  key={`char-${i}`}
                  className={`w-[30px] h-[30px] flex items-center justify-center text-[#F1F5F9]
                    ${
                      isSpace
                        ? "bg-transparent border-transparent"
                        : "bg-[#111111] border border-[#94A3B8]"
                    }
                    text-[20px] font-medium rounded transition-all duration-150
                    ${
                      !isSpace
                        ? "hover:bg-[#10B981] hover:text-[#F1F5F9]"
                        : ""
                    }`}
                >
                  {isSpace ? "⠀" : char}
                </div>
              );
            })}
          </h1>

          {/* Selected Pixel Confirmation */}
          {selectedPixels.size > 0 && (
            <div className="p-4 bg-white text-black rounded mt-2">
              <p className="h-[80px] overflow-y-scroll thin-scrollbar text-sm">
                <strong>Selected Pixels:</strong>{" "}
                {Array.from(selectedPixels).join(", ")}
              </p>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  const pixels = Array.from(selectedPixels);
                  fetch("/api/savePixels", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pixels }),
                  }).then((res) => {
                    // if (res.ok) alert("Pixels reserved successfully!");
                  });
                }}
              >
                Confirm Purchase
              </button>
            </div>
          )}
        </div>

        {/* Mini Map */}
        <div className="bg-gray-800 border border-gray-600 p-2 rounded">
          <p className="text-sm mb-1 text-gray-300">Mini Map</p>
          <div
            className="grid gap-[1px]"
            style={{
              gridTemplateColumns: `repeat(${miniMapSize}, 10px)`,
              gridTemplateRows: `repeat(${miniMapSize}, 10px)`,
            }}
          >
            {Array.from({ length: 100 }, (_, i) => {
              const status = getMiniMapBlockStatus(i);
              let color = "bg-white";
              if (status === "sold") color = "bg-red-600";
              if (status === "selected") color = "bg-green-500";

              return (
                <button
                  key={i}
                  className={`w-[10px] h-[10px] ${color} rounded-sm hover:brightness-125`}
                  onClick={() => scrollToPixelGroup(i)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Pixel Grid */}
      <div
        ref={containerRef}
        className="grid border border-gray-700 select-none overflow-auto max-h-[80vh] mt-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, i) => {
          const isSold = soldPixels.includes(i);
          const isSelected = selectedPixels.has(i);
          const isHighlighted = highlightedIndexes.includes(i);

          return (
            <button
              key={i}
              ref={(el) => (cellRefs.current[i] = el)}
              className={`w-[30px] h-[30px] border border-gray-700 transition duration-100
                ${isSold ? "bg-red-600 cursor-not-allowed" : ""}
                ${isSelected ? "bg-green-500" : ""}
                ${
                  isHighlighted
                    ? "bg-[#3b83f68c] animate-pulse"
                    : !isSold && !isSelected
                    ? "hover:bg-blue-500 cursor-pointer"
                    : ""
                }`}
              onMouseDown={() => handleMouseDown(i)}
              onMouseOver={() => handleMouseOver(i)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BuyPixelPage;
