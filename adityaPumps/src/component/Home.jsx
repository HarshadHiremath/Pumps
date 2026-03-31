import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home({ setUser }) {
  const navigate = useNavigate();

  const API_URL =
    "https://sheets.googleapis.com/v4/spreadsheets/1k_1BWpZz3ap10C8hdoMSGfEoVlYZ-12_QmAKURzcEWg/values/Data?key=AIzaSyDFA-SjdIRv0U7BClx-85-JhK2CKSYH2as";

  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const initialFilters = {
    material: "",
    moc: "",
    standard: "",
    dimension: "",
    category: "",
    revision: "",
    part: "",
    interchange: "",
    plant: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // 🔄 Convert array → JSON
  const convertToJSON = (data) => {
    const headers = data[0];
    return data.slice(1).map((row) => {
      let obj = {};
      headers.forEach((key, i) => {
        obj[key] = row[i];
      });
      return obj;
    });
  };

  // 📡 Fetch data
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((res) => {
        const json = convertToJSON(res.values);
        setRawData(json);
        setFilteredData(json);
      });
  }, []);

  // 🎯 Apply filters (ignore empty ones)
  const applyFilters = (newFilters) => {
    let temp = rawData;

    Object.entries(newFilters).forEach(([key, value]) => {
      if (!value) return;

      const map = {
        material: "MATERIAL DESCRIPTION",
        moc: "MOC",
        standard: "STANDARD NAME",
        dimension: "DIMENSION",
        category: "CATEGORY",
        revision: "REVISION",
        part: "PART CODE",
        interchange: "INTERCHANGEABILITY MOC",
        plant: "PLANT NUMBER",
      };

      temp = temp.filter((d) => d[map[key]] === value);
    });

    setFilteredData(temp);
  };

  // 🔄 Reset next filters when one changes
  const handleChange = (key, value) => {
    const keys = Object.keys(filters);
    const index = keys.indexOf(key);

    let newFilters = { ...filters };

    // reset next filters
    for (let i = index; i < keys.length; i++) {
      newFilters[keys[i]] = "";
    }

    newFilters[key] = value;

    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // 🔍 Unique values
  const getUnique = (data, key) => {
    return [...new Set(data.map((item) => item[key]))];
  };

  // column mapping
  const columnMap = {
    material: "MATERIAL DESCRIPTION",
    moc: "MOC",
    standard: "STANDARD NAME",
    dimension: "DIMENSION",
    category: "CATEGORY",
    revision: "REVISION",
    part: "PART CODE",
    interchange: "INTERCHANGEABILITY MOC",
    plant: "PLANT NUMBER",
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔥 Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-slate-900 text-white">
        <div>
          <h1 className="text-xl font-bold">MyApp 🚀</h1>
          <p className="text-xs text-gray-300">Smart Data Explorer</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>

      {/* 🔽 Filters */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

        {Object.keys(filters).map((key) => (
          <select
            key={key}
            value={filters[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">Select {columnMap[key]}</option>
            {getUnique(filteredData, columnMap[key]).map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>
        ))}

      </div>

      {/* 📦 Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-md">
            
            <h2 className="font-bold text-lg mb-2">
              {item["DRAWING NO"]}
            </h2>

            {Object.entries(item).map(([key, value]) => (
              <p key={key} className="text-sm text-gray-700">
                <span className="font-semibold">{key}:</span> {value}
              </p>
            ))}

          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;