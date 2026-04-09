import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Img from "../assets/img.png";

function Home({ setUser }) {
  const navigate = useNavigate();
  const columns = ["Components", "Component Subtypes", "Size", "Features"];

  const [rawData, setRawData] = useState([]);
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);

  // Initialize cart from localStorage immediately to prevent sync issues
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const API_URL = "https://sheets.googleapis.com/v4/spreadsheets/1rF0O4v9KPAOjC_DnvD8D2RDjKL-SslzfW4LV7ixWmFc/values/Data?key=AIzaSyDFA-SjdIRv0U7BClx-85-JhK2CKSYH2as";

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch data from Google Sheets
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((res) => {
        if (res.values) {
          const headers = res.values[0];
          const jsonData = res.values.slice(1).map((row) => {
            let obj = {};
            headers.forEach((key, i) => {
              obj[key] = row[i] ? String(row[i]).trim() : "N/A";
            });
            return obj;
          });
          setRawData(jsonData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const addToCart = (item) => {
    // Check if item already exists based on a unique identifier (Components name)
    const exists = cart.some((c) => c["Components"] === item["Components"]);
    if (!exists) {
      setCart((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

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
      return Object.entries(otherFilters).every(
        ([key, value]) => row[key] === value
      );
    });
    return [...new Set(availableRows.map((row) => row[columnName]))]
      .filter((v) => v && v !== "N/A")
      .sort();
  };

  const finalResults = rawData.filter((row) => {
    return Object.entries(selections).every(
      ([key, value]) => row[key] === value
    );
  });

  const handleLogout = () => {
    localStorage.clear();
    if (setUser) setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <img src={Img} alt="Logo" className="w-10" />
          <h1 className="font-bold text-xl text-blue-900">Pump Portal</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition"
          >
            Cart ({cart.length})
          </button>
          <button
            onClick={handleLogout}
            className="border border-red-500 text-red-500 hover:bg-red-50 px-5 py-2 rounded-full transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-72 p-6 border-r h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
          <h2 className="font-bold text-lg mb-6 text-gray-800">Filter Products</h2>
          {columns.map((col) => (
            <div key={col} className="mb-6">
              <label className="block text-xs font-uppercase tracking-wider font-bold text-gray-500 mb-2 uppercase">
                {col}
              </label>
              <select
                value={selections[col] || ""}
                onChange={(e) => handleDropdownChange(col, e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">All {col}</option>
                {getOptionsForColumn(col).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </aside>

        <main className="flex-1 p-8 bg-gray-50 min-h-screen">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {finalResults.map((item, i) => {
                const alreadyInCart = cart.some(c => c["Components"] === item["Components"]);
                return (
                  <div key={i} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                    <h2 className="font-bold text-xl mb-3 text-gray-900">{item["Components"]}</h2>
                    <div className="text-sm text-gray-600 space-y-2 mb-6">
                      <p><b>Subtype:</b> {item["Component Subtypes"]}</p>
                      <p><b>Size:</b> {item["Size"]}</p>
                      <p><b>Features:</b> {item["Features"]}</p>
                    </div>
                    <button
                      disabled={alreadyInCart}
                      onClick={() => addToCart(item)}
                      className={`w-full py-3 rounded-lg font-bold transition ${
                        alreadyInCart
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {alreadyInCart ? "Already Added" : "Add to Cart"}
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