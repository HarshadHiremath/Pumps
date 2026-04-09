import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Img from "../assets/img.png";

function Home({ setUser }) {
  const navigate = useNavigate();
  const columns = ["SrNo","Components", "Component Subtypes", "Size", "Features"];

  const [rawData, setRawData] = useState([]);
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const API_URL = "https://sheets.googleapis.com/v4/spreadsheets/1rF0O4v9KPAOjC_DnvD8D2RDjKL-SslzfW4LV7ixWmFc/values/Data?key=AIzaSyDFA-SjdIRv0U7BClx-85-JhK2CKSYH2as";

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((res) => {
        if (res.values) {
          const headers = res.values[0];
          const data = res.values.slice(1).map((row, index) => {
            let obj = {};
            headers.forEach((key, i) => {
              obj[key] = row[i] ? String(row[i]).trim() : "N/A";
            });
            obj._id = obj["SrNO"] || index;
            return obj;
          });
          setRawData(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      if (prev.some((c) => c._id === item._id)) return prev;
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const isInCart = (item) => cart.some((c) => c._id === item._id);

  const handleDropdownChange = (columnName, value) => {
    setSelections((prev) => {
      const updated = { ...prev };
      if (!value) delete updated[columnName];
      else updated[columnName] = value;
      return updated;
    });
  };

  const getOptionsForColumn = (columnName) => {
    const otherFilters = { ...selections };
    delete otherFilters[columnName];
    const availableRows = rawData.filter((row) => {
      return Object.entries(otherFilters).every(([key, value]) => row[key] === value);
    });
    return [...new Set(availableRows.map((row) => row[columnName]))].sort();
  };

  const finalResults = rawData.filter((row) => {
    return Object.entries(selections).every(([key, value]) => row[key] === value);
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* RESPONSIVE NAVBAR */}
      <nav className="sticky top-0 z-[60] flex justify-between items-center px-4 md:px-8 py-3 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="flex gap-2 md:gap-3 items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
          <img src={Img} className="w-8 h-8 object-contain" alt="Logo" />
          <h1 className="font-bold text-lg md:text-xl tracking-tight hidden sm:block">
            Pump<span className="text-indigo-600">Portal</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 md:px-5 py-2 rounded-full font-semibold text-xs md:text-sm transition hover:bg-slate-800 shadow-md"
          >
            <span>Cart</span>
            <span className="bg-indigo-500 text-white px-2 py-0.5 rounded-full text-[10px]">
              {cart.length}
            </span>
          </button>
          <button onClick={() => { localStorage.clear(); navigate("/"); }} className="text-slate-500 hover:text-red-600 font-medium text-xs md:text-sm px-2">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex relative">
        {/* SIDEBAR - Overlay on mobile, fixed on desktop */}
        <aside className={`
          fixed lg:sticky top-0 lg:top-[65px] left-0 z-50
          w-72 h-full lg:h-[calc(100vh-65px)] 
          bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="p-6">
            <div className="flex justify-between items-center lg:hidden mb-6">
              <h2 className="font-bold">Filters</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400">✕</button>
            </div>
            
            <h2 className="hidden lg:block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Search Filters</h2>
            
            <div className="space-y-5">
              {columns.map((col) => (
                <div key={col} className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">{col}</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selections[col] || ""}
                    onChange={(e) => handleDropdownChange(col, e.target.value)}
                  >
                    <option value="">All</option>
                    {getOptionsForColumn(col).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
              <button 
                onClick={() => setSelections({})}
                className="w-full py-2.5 mt-4 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-100 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE SIDEBAR OVERLAY */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* MAIN PRODUCT GRID */}
        <main className="flex-1 p-4 md:p-8">
          <header className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">Components</h2>
            <p className="text-slate-500 text-xs md:text-sm">Found {finalResults.length} matching items</p>
          </header>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {finalResults.map((item) => {
                const added = isInCart(item);
                return (
                  <div key={item._id} className="bg-white border border-slate-200 p-5 rounded-2xl transition-all hover:shadow-lg">
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">SR: {item["SrNo"]}</span>
                      <h3 className="font-bold text-slate-800 text-base md:text-lg leading-tight">{item["Components"]}</h3>
                    </div>

                    <div className="space-y-2 mb-5 text-xs md:text-sm">
                      <div className="flex justify-between"><span className="text-slate-400">Subtype</span><span className="text-slate-700 font-medium">{item["Component Subtypes"]}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Size</span><span className="text-slate-700 font-medium">{item["Size"]}</span></div>
                      <div className="flex justify-between items-start gap-4"><span className="text-slate-400">Features</span><span className="text-slate-700 font-medium text-right">{item["Features"]}</span></div>
                    </div>

                    <button
                      disabled={added}
                      onClick={() => addToCart(item)}
                      className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                        added ? "bg-slate-100 text-slate-400 border" : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {added ? "✓ In Cart" : "Add to Cart"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;