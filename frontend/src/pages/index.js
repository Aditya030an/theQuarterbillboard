import SevenCards from "../Components/SevenCard";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import Gridy from "../Components/grid-component";

const IndexPage = () => {
  const gridSize = 100;
  const cellSize = 30;

  const scrollContainerRef = useRef(null);
  const cellRefs = useRef([]);
  const [highlightedIndexes, setHighlightedIndexes] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [fading, setFading] = useState(false);

  const [countdown, setCountdown] = useState(25 * 60); // Start with 25 minutes

useEffect(() => {
  const interval = setInterval(() => {
    setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
  }, 1000);
  return () => clearInterval(interval);
}, []);

useEffect(() => {
  let timeoutId;

  const cycle = () => {
    setFading(true);
    setTimeout(() => {
      const nextIsGrid = !showGrid;
      setShowGrid(nextIsGrid);
      setFading(false);

      const nextDuration = nextIsGrid ? 25 * 60 : 35 * 60;
      setCountdown(nextDuration);

      timeoutId = setTimeout(cycle, nextDuration * 1000);
    }, 1000);
  };

  timeoutId = setTimeout(cycle, 25 * 60 * 1000);
  return () => clearTimeout(timeoutId);
}, [showGrid]);




  const scrollToPixel = (index) => {
    const container = scrollContainerRef.current;
    const cell = cellRefs.current[index];

    if (container && cell) {
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
  };

  const scrollToPixelGroup = (miniIndex) => {
    const groupSize = 10;
    const row = Math.floor(miniIndex / 10);
    const col = miniIndex % 10;

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

    scrollToPixel(centerIndex);
    setHighlightedIndexes(blockIndexes);

    setTimeout(() => {
      setHighlightedIndexes([]);
    }, 2000);
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* Header and Nav */}
      <div className="flex items-center justify-between px-3 flex-wrap">
        <div className="flex-1">
          {/* Header */}
          <header className="h-16 py-2 flex flex-wrap justify-center items-center">
            <div className="flex items-center justify-center">
              {"THE QUARTER BILLBOARD".split("").map((char, i) => {
                const isSpace = char === " " || char === "⠀";
                return (
                  <div
                    key={`header-${i}`}
                    className={`w-[40px] h-[40px] flex items-center justify-center text-[#EC4899] 
                    ${
                      isSpace
                        ? "bg-transparent border-transparent"
                        : "bg-[#111111] border border-[#94A3B8]"
                    }
                    text-2xl font-semibold rounded transition-all duration-150
                    ${
                      !isSpace ? "hover:bg-[#10B981] hover:text-[#F1F5F9]" : ""
                    }`}
                  >
                    {isSpace ? "⠀" : char}
                  </div>
                );
              })}
            </div>
            <div className="px-4 text-right text-sm text-white font-mono">
  {showGrid ? "Grid visible for:" : "Intermission for:"}{" "}
  {Math.floor(countdown / 60)
    .toString()
    .padStart(2, "0")}
  :
  {(countdown % 60).toString().padStart(2, "0")}
</div>

          </header>

          {/* Nav */}
          <nav className="h-12 flex flex-wrap items-center justify-between px-4">
            <div className="flex">
              {"WELCOME".split("").map((char, i) => {
                const isSpace = char === " " || char === "⠀";
                return (
                  <div
                    key={`welcome-${i}`}
                    className={`w-[36px] h-[36px] flex items-center justify-center text-[#F1F5F9] 
                    ${
                      isSpace
                        ? "bg-transparent border-transparent"
                        : "bg-[#111111] border border-[#94A3B8]"
                    }
                    text-xl font-medium rounded transition-all duration-150
                    ${
                      !isSpace ? "hover:bg-[#10B981] hover:text-[#F1F5F9]" : ""
                    }`}
                  >
                    {isSpace ? "⠀" : char}
                  </div>
                );
              })}
            </div>
            <Link href="/buy-a-pixel" className="flex  hover:underline">
              {"BUY_A_PIXEL".split("").map((char, i) => {
                const isSpace = char === " " || char === "⠀";
                return (
                  <div
                    key={`buy-${i}`}
                    className={`w-[30px] h-[30px] flex items-center justify-center text-[#F1F5F9] 
                    ${
                      isSpace
                        ? "bg-transparent border-transparent"
                        : "bg-[#111111] border border-[#94A3B8]"
                    }
                    text-[20px] font-medium rounded transition-all duration-150
                    ${
                      !isSpace ? "hover:bg-[#10B981] hover:text-[#F1F5F9]" : ""
                    }`}
                  >
                    {isSpace ? "⠀" : char}
                  </div>
                );
              })}
            </Link>
            <div className="flex flex-wrap gap-6">
              <Link href="/login" className="flex hover:underline">
                {"LOGIN".split("").map((char, i) => {
                  const isSpace = char === " " || char === "⠀";
                  return (
                    <div
                      key={`login-${i}`}
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
              </Link>
              <Link href="/register" className="flex hover:underline">
                {"REGISTER".split("").map((char, i) => {
                  const isSpace = char === " " || char === "⠀";
                  return (
                    <div
                      key={`register-${i}`}
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
              </Link>
            </div>
          </nav>
        </div>

        {/* Mini Map */}
        <div
          className={`shrink-0 bg-black bg-opacity-60 border border-gray-400 p-2 rounded-md z-10 ${
            fading ? "opacity-0" : "opacity-100"
          } ${showGrid ? "block" : "hidden"}`}
        >
          <div
            className="grid gap-[1px]"
            style={{
              gridTemplateColumns: `repeat(10, 10px)`,
              gridTemplateRows: `repeat(10, 10px)`,
            }}
          >
            {Array.from({ length: 100 }, (_, i) => (
              <button
                key={i}
                className="w-[10px] h-[10px] bg-white hover:bg-[#3b83f6] cursor-pointer"
                onClick={() => scrollToPixelGroup(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Section */}
      <main className="flex-1 relative overflow-hidden px-4 py-2">
        {/* Grid Container */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            fading ? "opacity-0" : "opacity-100"
          } ${showGrid ? "block" : "hidden"}`}
        >
          <div
            ref={scrollContainerRef}
            className="h-full w-full overflow-auto thin-scrollbar border border-gray-600 rounded-md relative"
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
              }}
            >
              {Array.from({ length: gridSize * gridSize }, (_, i) => (
                <div
                  key={i}
                  ref={(el) => (cellRefs.current[i] = el)}
                  className={`w-[30px] h-[30px] border border-gray-700 transition duration-100 ${
                    highlightedIndexes.includes(i)
                      ? "bg-[#3b83f68c] animate-pulse"
                      : "hover:bg-gray-600"
                  }`}
                  title={`Pixel #${i}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Intermission Message */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            fading ? "opacity-0" : "opacity-100"
          } ${!showGrid ? "block" : "hidden"}`}
        >
          <SevenCards />
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
