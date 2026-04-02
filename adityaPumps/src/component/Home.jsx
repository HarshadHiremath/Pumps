import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home({ setUser }) {
    const navigate = useNavigate();

    const columns = [
        "Standard Name",
        "Component Category",
        "Sub type of standard component",
        "MOC Selection",
        "Dimensions",
        "Weight",
        "Revision",
        "Interchangeablity MOC",
        "Plant no",
        "Drawing No.",
    ];

    const [rawData, setRawData] = useState([]);
    const [selections, setSelections] = useState({});
    const [loading, setLoading] = useState(true);

    const API_URL = "https://sheets.googleapis.com/v4/spreadsheets/1k_1BWpZz3ap10C8hdoMSGfEoVlYZ-12_QmAKURzcEWg/values/Data?key=AIzaSyDFA-SjdIRv0U7BClx-85-JhK2CKSYH2as";

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
                ([key, value]) => row[key] === value,
            );
        });
        return [...new Set(availableRows.map((row) => row[columnName]))]
            .filter(v => v && v !== "N/A")
            .sort();
    };

    const finalResults = rawData.filter((row) => {
        return Object.entries(selections).every(
            ([key, value]) => row[key] === value,
        );
    });

    const getStockColor = (status) => {
        const s = status?.toLowerCase() || "";
        if (s.includes("available") && !s.includes("not"))
            return "bg-green-600 text-white border-green-700";
        if (s.includes("limited"))
            return "bg-amber-500 text-white border-amber-600";
        return "bg-red-600 text-white border-red-700";
    };

    const handleLogout = () => {
    localStorage.removeItem("user");
    if (setUser) {
        setUser(null);
    }
    localStorage.clear(); 
    navigate("/", { replace: true }); 
};

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            {/* --- TOP NAVIGATION --- */}
            <nav className="sticky top-0 z-50 bg-white border-b-4 border-green-600 px-4 md:px-8 py-3 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-white p-1 border border-slate-200 shadow-sm">
                        <img
                            src="https://www.jameshargreaves.com/wp-content/uploads/2023/07/Wilo-Logo-50-50-Content.png"
                            alt="Wilo Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-slate-800 leading-none">
                            INVENTO <span className="text-green-600">Wilo</span>
                        </h1>
                        <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mt-1">
                            Asset Management Portal
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="group flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-lg font-bold text-sm transition-all border border-slate-200"
                >
                    Logout
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                    </svg>
                </button>
            </nav>

            <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row">
                {/* --- SIDEBAR FILTERS --- */}
                <aside className="w-full lg:w-80 p-6 bg-slate-50 border-r border-slate-200 lg:h-[calc(100vh-76px)] lg:sticky lg:top-[76px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-slate-200">
                        <h2 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"/></svg>
                            Filters
                        </h2>
                        {Object.keys(selections).length > 0 && (
                            <button
                                onClick={() => setSelections({})}
                                className="text-[10px] font-black text-red-600 hover:text-red-800 underline"
                            >
                                CLEAR ALL
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {columns.map((col) => (
                            <div key={col}>
                                <label className="text-[11px] font-black text-slate-700 mb-2 block uppercase tracking-tight">
                                    {col}
                                </label>
                                <select
                                    value={selections[col] || ""}
                                    onChange={(e) => handleDropdownChange(col, e.target.value)}
                                    className="w-full bg-white border-2 border-slate-300 text-slate-800 py-2 px-3 rounded-md text-sm font-semibold focus:border-green-600 focus:ring-0 outline-none transition-all cursor-pointer shadow-sm"
                                >
                                    <option value="">-- All {col} --</option>
                                    {getOptionsForColumn(col).map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* --- MAIN DASHBOARD --- */}
                <main className="flex-1 p-6 lg:p-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96 text-green-600">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mb-4"></div>
                            <p className="font-black uppercase tracking-widest text-sm">Synchronizing Database...</p>
                        </div>
                    ) : (
                        <>
                            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b pb-6">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                                        Asset Catalog
                                    </h2>
                                    <p className="text-slate-600 font-bold mt-1">
                                        Identified <span className="text-green-600 px-2 bg-green-50 rounded">{finalResults.length}</span> components matching parameters.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="px-4 py-2 bg-slate-900 text-white text-[11px] font-black rounded flex items-center gap-2 uppercase tracking-widest">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        System Operational
                                    </div>
                                </div>
                            </header>

                            {/* DATA GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                                {finalResults.length > 0 ? (
                                    finalResults.map((item, i) => (
                                        <div
                                            key={i}
                                            className="bg-white rounded-lg border-2 border-slate-200 shadow-sm hover:shadow-xl hover:border-green-500 transition-all duration-300 overflow-hidden flex flex-col"
                                        >
                                            {/* Drawing Header */}
                                            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Drawing ID</span>
                                                <span className="text-sm font-mono font-bold text-green-400">{item["Drawing No."]}</span>
                                            </div>

                                            {/* Status Bar */}
                                            <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${getStockColor(item["Stock status"])}`}>
                                                    {item["Stock status"]}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-500 uppercase">Rev: {item["Revision"]}</span>
                                            </div>

                                            {/* Primary Info */}
                                            <div className="p-5 flex-1">
                                                <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 uppercase tracking-tight">
                                                    {item["Standard Name"]}
                                                </h3>
                                                <p className="text-xs font-bold text-green-700 mb-4 pb-2 border-b border-slate-100 italic">
                                                    {item["Sub type of standard component"]}
                                                </p>

                                                {/* Specs List */}
                                                <div className="space-y-1 mt-4">
                                                    <div className="flex justify-between p-2 rounded bg-slate-50">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase">MOC Selection</span>
                                                        <span className="text-xs font-bold text-slate-800">{item["MOC Selection"]}</span>
                                                    </div>
                                                    <div className="flex justify-between p-2 rounded">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase">Net Weight</span>
                                                        <span className="text-xs font-bold text-slate-800">{item["Weight"]} kg</span>
                                                    </div>
                                                    <div className="flex flex-col p-2 rounded bg-slate-50">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase mb-1">Dimensions</span>
                                                        <span className="text-[11px] font-bold text-slate-800 leading-snug">{item["Dimensions"]}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Info */}
                                            <div className="px-5 py-4 bg-slate-100 border-t-2 border-slate-200 flex justify-between items-center">
                                                <div>
                                                    <span className="text-[9px] font-black text-slate-500 uppercase block">Plant Ref</span>
                                                    <span className="text-xs font-bold text-slate-900"># {item["Plant no"]}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase block">Unit Cost</span>
                                                    <span className="text-xl font-black text-slate-900">
                                                        ₹ {Number(item["Cost"]).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-32 flex flex-col items-center justify-center bg-slate-50 rounded-xl border-4 border-dashed border-slate-200">
                                        <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">No Matches Identified</h3>
                                        <p className="text-slate-500 font-bold mt-2">The requested configuration does not exist in the Wilo inventory.</p>
                                        <button 
                                            onClick={() => setSelections({})} 
                                            className="mt-8 px-10 py-3 bg-green-600 text-white rounded font-black text-sm hover:bg-green-700 transition-all shadow-xl uppercase tracking-widest"
                                        >
                                            Reset Filter Stack
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Home;