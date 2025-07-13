import SevenCards from "../Components/SevenCard";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
<<<<<<< HEAD
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
=======
import Gridy from "../Components/grid-component";
>>>>>>> 36e8bf7adbfaab32777eec95d46403561cbdc982

const IndexPage = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const getUserDetails = async (authToken) => {
    try {
      const response = await axios.get(`${API_URL}/api/user/getUser`, {
        headers: {
          token: authToken,
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUserDetails(token);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.reload();
  };

  const gridSize = 100;
  const cellSize = 30;

  const scrollContainerRef = useRef(null);
  const cellRefs = useRef([]);
  const [highlightedIndexes, setHighlightedIndexes] = useState([]);

  const [showGrid, setShowGrid] = useState(true);
  const [fading, setFading] = useState(false);
  const [countdown, setCountdown] = useState(25 * 60);

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
        const nextShow = !showGrid;
        setShowGrid(nextShow);
        setFading(false);
        const nextDuration = nextShow ? 25 * 60 : 35 * 60;
        setCountdown(nextDuration);
        timeoutId = setTimeout(cycle, nextDuration * 1000);
      }, 1000);
    };
    timeoutId = setTimeout(cycle, countdown * 1000);
    return () => clearTimeout(timeoutId);
  }, [showGrid]);

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

    const container = scrollContainerRef.current;
    const cell = cellRefs.current[centerIndex];

    if (container && cell) {
      container.scrollTo({
        top: cell.offsetTop - container.clientHeight / 2 + cell.clientHeight / 2,
        left: cell.offsetLeft - container.clientWidth / 2 + cell.clientWidth / 2,
        behavior: "smooth",
      });
    }

    setHighlightedIndexes(blockIndexes);
    setTimeout(() => setHighlightedIndexes([]), 2000);
  };

  const formatTime = (secs) => {
    const min = Math.floor(secs / 60).toString().padStart(2, "0");
    const sec = (secs % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* HEADER */}
      <header className="flex flex-col px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center flex-wrap">
            {"THE QUARTER BILLBOARD".split("").map((char, i) => (
              <div
                key={`title-${i}`}
                className={`w-[40px] h-[40px] flex items-center justify-center text-[#EC4899] 
                  ${char === " " ? "bg-transparent border-transparent" : "bg-[#111] border border-[#94A3B8]"}
                  text-2xl font-semibold rounded hover:bg-[#10B981] hover:text-[#F1F5F9]`}
              >
                {char === " " ? "⠀" : char}
              </div>
            ))}
          </div>
          <div className="text-sm font-mono text-white">
            {showGrid ? "Grid visible for: " : "Intermission for: "}
            {formatTime(countdown)}
          </div>
        </div>

        {/* NAV */}
        <nav className="flex justify-between mt-4 px-2">
          <div className="flex flex-col gap-2 items-start">
            {/* Welcome Text */}
            <div className="flex">
              {(user ? `WELCOME ${user.name}` : "WELCOME")
                .split("")
                .map((char, i) => (
                  <div
                    key={`welcome-${i}`}
                    className={`w-[36px] h-[36px] flex items-center justify-center text-[#F1F5F9] 
                    ${char === " " ? "bg-transparent border-transparent" : "bg-[#111] border border-[#94A3B8]"}
                    text-xl font-medium rounded hover:bg-[#10B981] hover:text-[#F1F5F9]`}
                  >
                    {char === " " ? "⠀" : char}
                  </div>
                ))}
            </div>

            {/* Buy a pixel */}
            <Link href="/buy-a-pixel" className="flex hover:underline">
              {"BUY_A_PIXEL".split("").map((char, i) => {
                const isSpace = char === " " || char === "⠀";
                return (
                  <div
                    key={`buy-${i}`}
                    className={`w-[30px] h-[30px] flex items-center justify-center text-[#F1F5F9] 
                    ${isSpace ? "bg-transparent border-transparent" : "bg-[#111] border border-[#94A3B8]"}
                    text-[20px] font-medium rounded transition-all duration-150
                    ${!isSpace ? "hover:bg-[#10B981] hover:text-[#F1F5F9]" : ""}`}
                  >
                    {isSpace ? "⠀" : char}
                  </div>
                );
              })}
            </Link>

            {/* Login / Register / Logout */}
            <div className="flex gap-4">
              {!token ? (
                <>
                  <Link href="/login" className="flex hover:underline">
                    {"LOGIN".split("").map((char, i) => (
                      <div
                        key={`login-${i}`}
                        className="w-[30px] h-[30px] flex items-center justify-center border border-[#94A3B8] bg-[#111] text-[20px] rounded hover:bg-[#10B981]"
                      >
                        {char}
                      </div>
                    ))}
                  </Link>
                  <Link href="/register" className="flex hover:underline">
                    {"REGISTER".split("").map((char, i) => (
                      <div
                        key={`register-${i}`}
                        className="w-[30px] h-[30px] flex items-center justify-center border border-[#94A3B8] bg-[#111] text-[20px] rounded hover:bg-[#10B981]"
                      >
                        {char}
                      </div>
                    ))}
                  </Link>
                </>
              ) : (
                <button onClick={handleLogout} className="flex hover:underline cursor-pointer">
                  {"LOGOUT".split("").map((char, i) => (
                    <div
                      key={`logout-${i}`}
                      className="w-[30px] h-[30px] flex items-center justify-center border border-[#94A3B8] bg-[#111] text-[20px] rounded hover:bg-[#10B981]"
                    >
                      {char}
                    </div>
                  ))}
                </button>
              )}
            </div>
          </div>

          {/* Mini Map */}
          {showGrid && (
            <div className="mx-4 mt-2 p-2 border border-gray-400 bg-black bg-opacity-60 rounded-md">
              <div
                className="grid gap-[1px]"
                style={{
                  gridTemplateColumns: "repeat(10, 10px)",
                  gridTemplateRows: "repeat(10, 10px)",
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
          )}
        </nav>
      </header>

      {/* Main Grid / Intermission */}
      <main className="flex-1 relative overflow-hidden p-2">
        {showGrid ? (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${fading ? "opacity-0" : "opacity-100"}`}
          >
            <div
              ref={scrollContainerRef}
              className="h-full w-full overflow-auto thin-scrollbar border border-gray-600 rounded-md"
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
                    className={`w-[30px] h-[30px] border border-gray-700 ${
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
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <SevenCards />
          </div>
        )}
      </main>
    </div>
  );
};

export default IndexPage;
