// components/SevenCards.js
import React from "react";

const cards = [
  {
    title: "Pixel Power",
    description: "Own a piece of the web. Buy a pixel and showcase your brand.",
  },
  {
    title: "Interactive Grid",
    description: "Explore and interact with a 100x100 dynamic pixel board.",
  },
  {
    title: "Mini Map",
    description: "Navigate quickly using the handy mini map viewer.",
  },
  {
    title: "Custom Design",
    description: "Apply colors, images, or text to your purchased pixels.",
  },
  {
    title: "Real Ownership",
    description: "Each pixel is unique and owned — like digital real estate.",
  },
  {
    title: "Built with Next.js",
    description: "Fast, modern stack: Next.js, Tailwind CSS, and Node backend.",
  },
  {
    title: "Always Evolving",
    description: "New features coming soon: animations, zoom, social features.",
  },
];

const SevenCards = () => {
  return (
    <div className="w-full py-8 px-4 bg-gray-800 text-white">
      <h2 className="text-3xl font-bold text-center mb-8 text-pink-400 flex items-center justify-center">
       {"THE NEXT AD'S".split("").map((char, i) => {
                const isSpace = char === " " || char === "⠀";
                return (
                  <div
                    key={`buy-${i}`}
                    className={`w-[30px] h-[30px] flex items-center justify-center text-[#F1F5F9] 
                    ${isSpace ? "bg-transparent border-transparent" : "bg-[#111111] border border-[#94A3B8]"}
                    text-[20px] font-medium rounded transition-all duration-150
                    ${!isSpace ? "hover:bg-[#10B981] hover:text-[#F1F5F9]" : ""}`}
                  >
                    {isSpace ? "⠀" : char}
                  </div>
                );
              })}
      </h2>
      <div className="flex items-center justify-center gap-4 px-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-[180px] h-[300px] bg-[#111111] border border-[#94A3B8] rounded-xl p-6 hover:bg-[#10B981] hover:text-white transition-all duration-300 shadow-md flex-shrink-0"
          >
            <h3 className="text-xl font-semibold mb-2 text-pink-300">
              {card.title}
            </h3>
            <p className="text-sm text-gray-300">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SevenCards;
