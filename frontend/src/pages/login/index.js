import { useState } from "react";
import PixelBlock from "../../Components/PixelBlock";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default to 'user'

  const gridSize = 100;

  // Helper to map string to PixelBlocks
  const renderText = (
    text,
    keyPrefix = "text",
    color = "#F1F5F9",
    size = "text-md",
    font = "font-mono"
  ) =>
    text
      .split("")
      .map((char, i) => (
        <PixelBlock
          key={`${keyPrefix}-${i}`}
          char={char === " " ? "⠀" : char}
          color={color}
          sizeClass={size}
          font={font}
        />
      ));

  return (
    <div className="min-h-screen bg-[#111111] text-[#F1F5F9] relative overflow-hidden flex items-center justify-center ">
      {/* Pixel Background */}
      <div
        className="absolute inset-0 z-0 grid opacity-5"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 30px)`,
          gridTemplateRows: `repeat(${gridSize},30px)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, i) => (
          <div
            key={i}
            className="bg-[#111111] w-[30px] h-[30px] border-2 border-[#94A3B8] opacity-40 hover:opacity-100 hover:scale-105 hover:bg-[#7dcab1] transition-all duration-200"
          />
        ))}
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full h-screen border-2 border-[#3B82F6]  shadow-lg p-8 flex flex-col items-center justify-between ">
        {/* Title */}
        <div className="flex flex-wrap justify-center gap-1">
          {renderText(
            "THE QUARTER BILLBOARD",
            "title",
            "#EC4899",
            "text-4xl",
            "font-bold"
          )}
        </div>

        {/* Subtitle */}
        <div className="flex flex-wrap justify-center gap-1">
          {renderText(
            "LOGIN TO CONTINUE",
            "subtitle",
            "#94A3B8",
            "text-xl",
            "font-medium"
          )}
        </div>

        {/* EMAIL */}
        <div className="flex items-center justify-center gap-8 mt-6 w-full relative">
          <div className="flex gap-1">
            {renderText(
              "EMAIL",
              "email-label",
              "#F1F5F9",
              "text-base",
              "font-normal"
            )}
          </div>
          <div
            className={`flex flex-wrap gap-1 justify-center ${
              email?.length === 0 && "border border-gray-500 rounded-sm"
            } `}
          >
            {email.length === 0 ? (
              <PixelBlock char=" " />
            ) : (
              email
                .split("")
                .map((char, i) => (
                  <PixelBlock key={`email-char-${i}`} char={char} />
                ))
            )}
          </div>
          {/* Working invisible input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="absolute opacity-0 pointer-events-auto left-0 top-0 w-full h-full"
            autoFocus
          />
        </div>

        {/* PASSWORD */}
        <div className="flex items-center gap-8 mt-6 w-full justify-center relative">
          <div className="flex gap-1">
            {renderText(
              "PASSWORD",
              "pass-label",
              "#F1F5F9",
              "text-base",
              "font-normal"
            )}
          </div>
          <div
            className={`flex flex-wrap gap-1 justify-center ${
              password?.length === 0 && "border border-gray-500 rounded-sm"
            }`}
          >
            {password.length === 0 ? (
              <PixelBlock char=" " />
            ) : (
              password
                .split("")
                .map((_, i) => <PixelBlock key={`pass-char-${i}`} char="*" />)
            )}
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="absolute opacity-0 pointer-events-auto left-0 top-0 w-full h-full"
          />
        </div>

        {/* ROLE */}
        <div className="flex items-center justify-center gap-8 mt-6 w-full">
          <div className="flex gap-1">
            {renderText(
              "ROLE",
              "role-label",
              "#F1F5F9",
              "text-base",
              "font-normal"
            )}
          </div>
          <div className="flex gap-4">
            {["user", "creator"].map((option) => (
              <div
                key={option}
                className={`cursor-pointer flex gap-1 border rounded px-2 py-1 transition-colors ${
                  role === option
                    ? "border-[#3B82F6] text-black"
                    : "border-gray-500"
                }`}
                onClick={() => setRole(option)}
              >
                {renderText(
                  option.toUpperCase(),
                  `role-${option}`,
                  "#F1F5F9",
                  "text-sm",
                  "font-medium"
                )}
              </div>
            ))}
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <div className="flex gap-2 mt-6 cursor-pointer hover:scale-105 transition-transform">
          {renderText(
            "LOGIN",
            "login-button",
            "#F1F5F9",
            "text-lg",
            "font-semibold"
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap justify-center gap-1 mt-6">
          {renderText(
            "DON'T HAVE AN ACCOUNT? ",
            "footer-msg",
            "#94A3B8",
            "text-sm",
            "font-normal"
          )}
          <Link href="/register" className="flex gap-1 hover:underline">
            {renderText(
              "REGISTER",
              "footer-link",
              "#EC4899",
              "text-sm",
              "font-semibold"
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
