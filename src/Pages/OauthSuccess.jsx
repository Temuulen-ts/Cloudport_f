// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export default function OAuthSuccess() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");

//     if (token) {
//       localStorage.setItem("token", token);
//       navigate("/");
//     }
//   }, []);

//   return <div>Logging you in...</div>;
// }

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 OAuthSuccess component mounted");
    console.log("📍 Current URL:", window.location.href);
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    
    console.log("🪙 Token found:", token ? "YES" : "NO");
    console.log("🪙 Token value:", token ? token.substring(0, 30) + "..." : "null");

    if (token) {
      console.log("💾 Saving token to localStorage");
      localStorage.setItem("token", token);
      console.log("✅ Token saved, navigating to /");
      navigate("/");
    } else {
      console.warn("⚠️ No token found, navigating to /login");
      navigate("/login?error=no_token");
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
}