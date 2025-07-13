import { useState } from "react";
import PixelBlock from "../../Components/PixelBlock";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user"); // default to 'user'
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    // Required
    if(!name) newErrors.name= "Name is Required";
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    // Password length
    if (password && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setServerError("");
    if (!validateForm()) return;

    console.log("user details", name , email , password , role);

    try {
      const response = await axios.post(`${API_URL}/api/user/register`, {
        name,
        email,
        password,
        role,
      });

      console.log("respnse inside signup", response);

      if (response?.data?.success) {
        localStorage.setItem("token", response?.data?.token);
        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
        alert("Register successful!");

        router.push("/login");
      } else {
        setServerError(response?.data?.message || "Login failed.");
      }
    } catch (err) {
      setServerError("Something went wrong.");
      console.error(err);
    }
  };

  const gridSize = 50;

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
    <div className="min-h-screen bg-[#111111] text-[#F1F5F9] relative overflow-hidden flex items-center justify-center">
      {/* Pixel Background */}
      <div
        className="absolute inset-0 z-0 grid opacity-5"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 30px)`,
          gridTemplateRows: `repeat(${gridSize}, 30px)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, i) => (
          <div
            key={i}
            className="bg-[#111111] w-[30px] h-[30px] border-2 border-[#94A3B8] opacity-40 transition-all duration-300 
              hover:bg-[#7dcab1] 
              hover:opacity-100 
              hover:scale-110 
              hover:shadow-[0_0_10px_#10B981]"
          />
        ))}
      </div>

      {/* Signup Form */}
      <div className="relative z-10 w-full h-screen border-2 border-[#3B82F6]  shadow-lg p-8 flex flex-col items-center justify-between">
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
            "SIGN UP TO CONTINUE",
            "subtitle",
            "#94A3B8",
            "text-xl",
            "font-medium"
          )}
        </div>

        {/* NAME */}
        <div className="flex flex-col items-center gap-1">
        <div className="flex items-center justify-center gap-8 mt-6 w-full relative ">
          <div className="flex gap-1">
            {renderText(
              "NAME",
              "name-label",
              "#F1F5F9",
              "text-base",
              "font-normal"
            )}
            
          </div>
          <div
            className={`flex flex-wrap gap-1 justify-center ${
              name.length === 0 && "border border-gray-500 rounded-sm "
            } `}
          >
            {name.length === 0 ? (
              <PixelBlock char=" " />
            ) : (
              name
                .split("")
                .map((char, i) => (
                  <PixelBlock key={`name-char-${i}`} char={char} />
                ))
            )}
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="absolute opacity-0 pointer-events-auto"
              style={{
                width: `${Math.max(name.length * 36, 36)}px`,
                height: "36px",
                zIndex: 20,
              }}
              autoFocus
            />
          </div>
        </div>
        {
          (errors.name && name.length === 0 ) &&  <span className="text-sm text-red-400">{errors.name}</span>
        }
        </div>

        {/* EMAIL */}
        <div className="flex flex-col items-center gap-1">

        <div className="flex items-center justify-center gap-8 mt-3 w-full relative">
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
            className={`flex flex-wrap gap-1 justify-center relative ${
              email?.length === 0 && "border border-gray-500 rounded-sm"
            }`}
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
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="absolute opacity-0 pointer-events-auto"
              style={{
                width: `${Math.max(email.length * 36, 36)}px`,
                height: "36px",
                zIndex: 20,
              }}
            />
          </div>
        </div>
        {
          (errors.email && email.length === 0 ) &&  <span className="text-sm text-red-400">{errors.email}</span>
        }
</div>
        {/* PASSWORD */}
        <div className="flex flex-col items-center gap-1">
        <div className="flex items-center justify-center gap-8 mt-3 w-full relative">
          <div className="flex items-center gap-1">
            {renderText(
              "PASSWORD",
              "password-label",
              "#F1F5F9",
              "text-base",
              "font-normal"
            )}
            {showPassword ? (
              <button
                className="cursor-pointer"
                onClick={() => {
                  setShowPassword(false);
                }}
              >
                Show
              </button>
            ) : (
              <button
                className="cursor-pointer"
                onClick={() => {
                  setShowPassword(true);
                }}
              >
                Hide
              </button>
            )}
          </div>
          <div
            className={`flex flex-wrap gap-1 justify-center relative ${
              password?.length === 0 && "border border-gray-500 rounded-sm"
            }`}
          >
            {password.length === 0 ? (
              <PixelBlock char=" " />
            ) : (
              password
                .split("")
                .map((char, i) => (
                  <PixelBlock
                    key={`password-char-${i}`}
                    char={showPassword ? char : "*"}
                  />
                ))
            )}
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="absolute opacity-0 pointer-events-auto"
              style={{
                width: `${Math.max(password.length * 36, 36)}px`,
                height: "36px",
                zIndex: 20,
              }}
            />
          </div>
        </div>
        {
          (errors.password && password.length === 0 ) &&  <span className="text-sm text-red-400">{errors.password}</span>
        }
</div>
        {/* ROLE */}
        <div className="flex items-center justify-center gap-8 mt-3 w-full">
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
              <button
                key={option}
                className={`cursor-pointer flex gap-1 border rounded px-2 py-1 transition-colors ${
                  role === option
                    ? "border-[#3B82F6] text-black bg-white"
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
              </button>
            ))}
          </div>
        </div>

        {/* SIGNUP Button */}
        <div
          onClick={handleSubmit}
          className="flex gap-2 mt-6 cursor-pointer hover:scale-105 transition-transform"
        >
          {renderText(
            "SIGN UP",
            "signup-button",
            "#F1F5F9",
            "text-lg",
            "font-semibold"
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap justify-center gap-1 mt-6">
          {renderText(
            "ALREADY HAVE AN ACCOUNT? ",
            "footer-msg",
            "#94A3B8",
            "text-sm",
            "font-normal"
          )}
          <Link href="/login" className="flex gap-1 hover:underline">
            {renderText(
              "LOGIN",
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
