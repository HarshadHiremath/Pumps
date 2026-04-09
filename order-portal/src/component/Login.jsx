import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpg";

const SHEET_ID = "1k_1BWpZz3ap10C8hdoMSGfEoVlYZ-12_QmAKURzcEWg";
const API_KEY = "AIzaSyDFA-SjdIRv0U7BClx-85-JhK2CKSYH2as";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Admin?key=${API_KEY}`;
      const res = await fetch(url);
      const result = await res.json();
      const rows = result.values;

      if (!rows) throw new Error("No data found");

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
        alert("Access Denied: Invalid Credentials ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Terminal Error: Unable to reach Wilo Authorization Server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-sans">
      {/* Engineering Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Wilo Green Decorative Blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-green-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-[95%] max-w-md">
        <form 
          onSubmit={handleLogin} 
          className="bg-white border-2 border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl p-8 md:p-12 overflow-hidden"
        >
          {/* Top Industrial Border */}
          <div className="absolute top-0 left-0 w-full h-2 bg-green-600"></div>

          <div className="text-center mb-10">
            <div className="inline-block p-2 bg-white border border-slate-100 rounded-xl mb-4 shadow-sm">
              <img src={Logo} alt="Wilo Logo" className="w-16 h-auto grayscale-0" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Industrial <span className="text-green-600">Pump's</span>
            </h1>
            <p className="text-[10px] mt-2 uppercase tracking-[0.1em] text-slate-500 font-black">
              Secure Asset Authorization
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-slate-800 uppercase mb-2 tracking-widest">Operator Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  required
                  type="text"
                  placeholder="Enter System ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-slate-50 border-2 border-slate-200 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:border-green-600 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-800 uppercase mb-2 tracking-widest">Access Pin / Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-slate-50 border-2 border-slate-200 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:border-green-600 transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden py-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest transition-all shadow-lg shadow-green-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 text-sm">
                {isLoading ? "Verifying Credentials..." : "Authorize Access"}
              </span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">System Status: Online</p>
            </div>
            <p className="text-center text-[9px] text-green-500 font-bold leading-relaxed uppercase tracking-widest">
              Authorized Personnel Only <br/>
              <span className="text-slate-900 font-black">Aditya Industrial Division</span>
            </p>
          </div>
        </form>
        
        {/* Footer Credit */}
        <div className="mt-8 flex flex-col items-center justify-center space-y-1">
          <p className="text-slate-400 text-[12px] font-bold text-center tracking-widest uppercase">
          Engineered with ❤️ & passion by <span className="text-green-600">Aditya Kulkarni & Team</span>
          </p>
          <p className="text-slate-900 text-[9px] font-medium">© 2026 HGI Pvt. Ltd. All Rights Reserved. </p>
        </div>
      </div>
    </div>
  );
}

export default Login;