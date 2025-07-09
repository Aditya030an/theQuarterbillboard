// export default function PixelBlock({ char, size }) {
//   return (
//     <div
//       className={`w-10 h-${size} m-1 
//         bg-charcoal 
//         text-softwhite 
//         text-sm font-mono 
//         flex items-center justify-center 
//         border border-electric 
//         hover:bg-neon 
//         transition duration-150 ease-in-out`}
//     >
//       {char}
//     </div>
//   );
// }

export default function PixelBlock({ char, color = "#F1F5F9", sizeClass = "text-md"  , font = "font-mono"}) {
  const isSpace = char === " " || char === "⠀";

  return (
    <div
      className={`w-[36px] h-[36px] flex items-center justify-center 
        ${isSpace ? "bg-transparent border-transparent" : "bg-[#111111] border border-[#94A3B8]"}
        ${sizeClass} ${font} rounded transition-all duration-150
        ${!isSpace ? "hover:bg-[#10B981] hover:text-[#F1F5F9]" : ""}`}
      style={{ color }}
    >
      {isSpace ? "" : char}
    </div>
  );
}


