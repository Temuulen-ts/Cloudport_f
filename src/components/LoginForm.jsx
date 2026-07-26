import { FcGoogle } from "react-icons/fc";
import logo from '../assets/Logo/cloud-port-high-resolution-logo-grayscale-transparent.png'
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { login } from "../services/AuthService.js";
import { useNavigate } from "react-router-dom";

const api = import.meta.env.VITE_API_BASE_URL;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(email, password);
      if (!data.token) {
        alert("Invalid Credentials")
      } else {
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("ERROR:", error);
    }
  };

  return (
    // Desktop: w-[400px], Mobile: w-[90%] max-w-[400px] - same max width on desktop
    <div className="relative w-[400px] max-w-[90%] md:max-w-[400px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-white shadow-2xl mx-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <img src={logo} alt="Company Logo" className="h-12 md:h-auto" />
      </div>

      <form onSubmit={handleLogin}>
        {/* Email - increased touch target on mobile only */}
        <input
          type="email"
          placeholder="username@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 px-4 py-2 md:py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="text-medium text-white">Password</label>

        {/* Password */}
        <div className="relative mt-1">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 md:py-2 pr-10 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        <div className="text-sm text-gray-300 mb-6 hover:text-white cursor-pointer">
          Forgot Password?
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-blue-700 hover:bg-blue-800 transition duration-300 mb-6">
          Sign in
        </button>
      </form>

      {/* Divider */}
      <div className="text-center text-sm text-gray-300 mb-4">
        or continue with
      </div>

      {/* Social Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            window.location.href = `${api}/oauth2/authorization/google`;
          }}
          className="flex-1 bg-white rounded-md py-2 flex items-center justify-center hover:bg-gray-200 transition">
          <FcGoogle size={20} />
        </button>


      </div>

      {/* Register */}
      <div className="text-sm text-center text-gray-300">
        Don't have an account yet?{" "}
        <Link
          to="/signup"
          className="text-white font-medium hover:underline"
        >
          Register for free
        </Link>
      </div>
    </div>
  );
}