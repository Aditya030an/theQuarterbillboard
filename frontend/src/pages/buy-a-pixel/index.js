import React, { useEffect, useRef, useState, } from "react";

const gridSize = 100;
const cellSize = 30;
const miniMapSize = 10;

const BuyPixelPage = () => {

  const base_url = "http://localhost:4000"
  const cellRefs = useRef([]);
  const containerRef = useRef(null);
  const [ photo, setPhoto ] = useState(null)
  const [soldPixelsMap, setSoldPixelsMap] = useState(new Map());
  
  // ACTIVITY INDICATOR LOADING STATE
  const [isLoading, setIsLoading] = useState(false);

  const [ soldPixels, setSoldPixels ] = useState([]); // Example sold pixels
  const [selectedPixels, setSelectedPixels] = useState(new Set());
  const [highlightedIndexes, setHighlightedIndexes] = useState([]);

  const [isSelecting, setIsSelecting] = useState(false);
  const [startIndex, setStartIndex] = useState(null);

  useEffect(() => {

    fetchAllSoldPixels()

    // cleanup function to reset state
    return () => {
      setSoldPixels([]);
      setSelectedPixels(new Set());
      setHighlightedIndexes([]);
      setIsSelecting(false);
      setStartIndex(null);
    }

  }, [])

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

  const getImagePosition = (startingPixel, gridSize, cellSize) => {
  const row = Math.floor(startingPixel / gridSize);
  const col = startingPixel % gridSize;

  return {
    top: row * cellSize,
    left: col * cellSize
  };
};



  // FILE HANDLING FOR LAWYER PHOTO
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    // add validation for file must be needed
    if (!file) {  
      console.error('No file selected');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit 
      console.error('File size exceeds 5MB limit');
      alert('File size exceeds 5MB limit');
      return;
    }

    if (file) {
      // Handle the file upload logic here
      console.log('File uploaded:', file.name);
      alert(`File selected: ${file.name}`);
      setPhoto(file)
    }
  };

  const fetchAllSoldPixels = async () => {
    try {
      const response = await fetch(`${base_url}/api/adblock/all`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if(response.status == 200){
      const pixelMap = {};

  for (const block of data.adBlocks) {
    const { pixels, imageURL, startingPixel, cols, rows } = block;

    for (const pixel of pixels) {
      const relativeIndex = pixel - startingPixel;
      const rowOffset = Math.floor(relativeIndex / gridSize);
      const colOffset = relativeIndex % gridSize;

      pixelMap[pixel] = {
        imageURL,
        bgSize: `${cols * cellSize}px ${rows * cellSize}px`,
        bgPosition: `-${colOffset * cellSize}px -${rowOffset * cellSize}px`
      };
    }
  }

  setSoldPixelsMap(pixelMap); 
      }
    } catch (error) {
      console.error("Error fetching sold pixels:", error);
    }
  };


  const confirmPurchase = async() => {

    setIsLoading(true);
    const pixels = Array.from(selectedPixels);
    
    // get the number of rows and columns of selected pixels
    const rows = Math.max(...pixels.map(p => Math.floor(p / gridSize))) + 1;
    const cols = Math.max(...pixels.map(p => p % gridSize)) + 1;
    const pixelData = Array.from({ length: rows }, () => Array(cols).fill(0));  
    pixels.forEach(p => {
      const row = Math.floor(p / gridSize);
      const col = p % gridSize;
      pixelData[row][col] = 1; 
    }); 

    console.log("Pixel Data:", pixelData);
    console.log("Rows:", rows, "Columns:", cols, "Starting Pixel:", pixels[0]);

    const form = new FormData();
    form.append("adOwner", "user123"); // Replace with actual user ID
    form.append("startingPixel", pixels[0]);
    form.append("rows", rows);
    form.append("cols", cols);
    form.append("price", 100); // Replace with actual price
    form.append("imageURL", photo); // Replace with actual image URL
    form.append("pixels", JSON.stringify(pixels)); // Send the selected pixel indexes

    const response = await fetch(`${base_url}/api/adblock/create`, {
      method: "POST",
      body: form
    });

    if(response.status == 400){
      setIsLoading(false);
      alert("Error: Please fill all the fields correctly.");
      return;
    }

    const result = await response.json();
    if (result.success) {
      setIsLoading(false);
      alert("Ad Block created successfully!");
      console.log("Ad Block Data:", result.adBlock);
      fetchAllSoldPixels(); // Refresh sold pixels after purchase
      setSelectedPixels(new Set()); // Clear selection after purchase
    } 

    setIsLoading(false);

    // Send the pixel data to the server or process it as needed
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4"
      onMouseUp={handleMouseUp}
    >

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="loader">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            <p className="text-gray-700 mt-4">Loading...</p>
            
          </div>
        </div>
      )}


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

              <label className="flex items-center justify-center w-full p-3 mb-4 rounded-md border border-gray-300 bg-white text-gray-700 cursor-pointer hover:bg-gray-200 transition-all duration-300 shadow-sm focus:shadow-md">
              Upload Photo
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  confirmPurchase();
                  setSelectedPixels(new Set()); // Clear selection after purchase
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
  const soldPixel = soldPixelsMap[i];
  const isSold = !!soldPixel;

  const isSelected = selectedPixels.has(i);
  const isHighlighted = highlightedIndexes.includes(i);

  return (
    <button
      key={i}
      ref={(el) => (cellRefs.current[i] = el)}
      className={`w-[${cellSize}px] h-[${cellSize}px] border border-gray-700 transition duration-100
        ${isSelected ? "bg-green-500" : ""}
        ${
          isHighlighted
            ? "bg-[#3b83f68c] animate-pulse"
            : !isSold && !isSelected
            ? "hover:bg-blue-500 cursor-pointer"
            : ""
        }`}
      style={{
        backgroundImage: isSold ? `url(${soldPixel.imageURL})` : "none",
        backgroundSize: isSold ? soldPixel.bgSize : "initial",
        backgroundPosition: isSold ? soldPixel.bgPosition : "initial",
        backgroundRepeat: "no-repeat",
        cursor: isSold ? "not-allowed" : "pointer",
      }}
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
