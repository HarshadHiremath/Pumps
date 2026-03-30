import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";

const SHEET_ID = "1k_1BWpZz3ap10C8hdoMSGfEoVlYZ-12_QmAKURzcEWg";
const API_KEY = "AIzaSyDFA-SjdIRv0U7BClx-85-JhK2CKSYH2as";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // Prevent the default form submission (page reload)
    if (e) e.preventDefault();
    
    setIsLoading(true);
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Admin?key=${API_KEY}`;
      const res = await fetch(url);
      const result = await res.json();
      const rows = result.values;

      const headers = rows[0];
      const users = rows.slice(1).map((row) => {
        let obj = {};
        headers.forEach((key, i) => {
          obj[key] = row[i];
        });
        return obj;
      });

      const user = users.find(
        (u) => u.userName === username && u.password === password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/home");
      } else {
        alert("Invalid Credentials ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to Industrial Server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
      </div>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-[90%] max-w-md">
        {/* WE WRAP EVERYTHING IN A FORM TO ENABLE 'ENTER' KEY SUPPORT */}
        <form 
          onSubmit={handleLogin} 
          className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-10 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>

          <div className="text-center mb-8">
            <div className="inline-block p-1 bg-white rounded-xl mb-4 shadow-lg shadow-cyan-500/20">
              <img src={Logo} alt="Wilo Logo" className="w-20 h-auto rounded-lg" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">
              Aditya's <span className="text-cyan-400">Pumps</span>
            </h1>
            <p className="text-[10px] mt-2 uppercase tracking-[0.2em] text-zinc-400 font-bold">
              Industrial Monitoring v1.0
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2 ml-1">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  required
                  type="text"
                  placeholder="System ID / Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2 ml-1">Secure Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* Changed from onClick to type="submit" */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group mt-4 overflow-hidden py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-[0.98]"
            >
              <span className="relative z-10">{isLoading ? "Verifying..." : "Authorize Access"}</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            </button>
          </div>

          <div className="mt-1 pt-6 border-t border-white/5">
            <p className="text-center text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wider">
              System Authorized For <br/>
              <span className="text-zinc-300 font-bold">Wilo Industrial Division</span>
            </p>
          </div>
        </form>
        <p className="text-center mt-6 text-zinc-500 text-[14px] font-bold tracking-wide">
          Developed by <span className="text-cyan-500/80">Aditya Kulkarni</span> • © 2026
        </p>
      </div>
    </div>
  );
}

export default Login;