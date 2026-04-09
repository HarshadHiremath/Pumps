import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

function Cart() {
    const [cart, setCart] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [userData, setUserData] = useState({ name: "", email: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    const updateQuantity = (index, delta) => {
        const updated = cart.map((item, i) => {
            if (i === index) {
                const currentQty = item.quantity || 1;
                const newQty = Math.max(1, currentQty + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };

    const removeItem = (index) => {
        const updated = cart.filter((_, i) => i !== index);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };

    const sendEmail = (e) => {
        if (cart.length === 0) return alert("Cart is empty!");
        if (!userData.email || !userData.name) return alert("Please enter your details first!");

        setIsSending(true);
       
        // Build the email content with all parameters
        const orderDetails = cart.map((item, i) => (
                  `#${item["SrNo"]} - ${item["Components"]}
                  Quantity: ${item.quantity || 1}
                  Subtype: ${item["Component Subtypes"]}
                  Size: ${item["Size"]}
                  Features: ${item["Features"]}
                  ---------------------------`
        )).join("\n");

         console.log(orderDetails);
        const templateParams = {
            name: userData.name,
            email: userData.email, // This sends it to the person who filled the form
            message: orderDetails,
        };

        emailjs.send(
            "service_5hyui9h",
            "template_pacohsn",
            templateParams,
            "CHxKKI-wiAUNfFTQ8"
        )
        .then(() => {
            alert("✅ Order sent to " + userData.email);
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/home");
        })
        .catch((err) => {
            console.error(err);
            alert("❌ Failed to send order");
        })
        .finally(() => setIsSending(false));
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto bg-slate-50 min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition">
                    <span className="text-blue-600 font-bold text-xl">←</span>
                </button>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Review Order</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: CART ITEMS */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-slate-200">
                            <p className="text-slate-500 mb-6">Your cart is empty.</p>
                            <button onClick={() => navigate("/home")} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Shop Now</button>
                        </div>
                    ) : (
                        cart.map((item, i) => (
                            <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Sr.No {item["SrNo"]}</span>
                                            <h2 className="font-bold text-lg text-slate-800">{item["Components"]}</h2>
                                        </div>
                                        
                                        {/* Parameters Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-xs md:text-sm pt-2">
                                            <div><p className="text-slate-400">Subtype</p><p className="font-semibold text-slate-700">{item["Component Subtypes"]}</p></div>
                                            <div><p className="text-slate-400">Size</p><p className="font-semibold text-slate-700">{item["Size"]}</p></div>
                                            <div className="col-span-2 md:col-span-1"><p className="text-slate-400">Features</p><p className="font-semibold text-slate-700 line-clamp-1">{item["Features"]}</p></div>
                                        </div>
                                    </div>

                                    {/* Action Side */}
                                    <div className="flex items-center md:flex-col justify-between md:justify-center gap-4 md:border-l border-slate-100 md:pl-6">
                                        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                            <button onClick={() => updateQuantity(i, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-slate-400 hover:text-blue-600">−</button>
                                            <span className="font-bold text-slate-700 w-6 text-center">{item.quantity || 1}</span>
                                            <button onClick={() => updateQuantity(i, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-slate-400 hover:text-blue-600">+</button>
                                        </div>
                                        <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-sm font-semibold transition">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RIGHT: CHECKOUT SUMMARY */}
                {cart.length > 0 && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Contact Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                                    <input 
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition"
                                        value={userData.name}
                                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
                                    <input 
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition"
                                        value={userData.email}
                                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-slate-500 font-medium">Total Items</span>
                                    <span className="text-xl font-bold text-slate-800">{cart.length}</span>
                                </div>
                                <button
                                    onClick={sendEmail}
                                    disabled={isSending}
                                    className={`w-full py-4 rounded-xl font-bold transition shadow-lg active:scale-[0.98] ${
                                        isSending ? "bg-slate-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                                    }`}
                                >
                                    {isSending ? "Sending Order..." : "Place Order via Email"}
                                </button>
                                <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
                                    By placing the order, a copy of the list will be sent to the email provided above.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;