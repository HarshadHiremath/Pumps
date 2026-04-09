import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Update quantity and sync with storage
  const updateQuantity = (index, delta) => {
    const updated = cart.map((item, i) => {
      if (i === index) {
        const currentQty = item.quantity || 1;
        const newQty = Math.max(1, currentQty + delta); // Min quantity 1
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

  const sendEmail = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    // Build formatted string for email template
    const orderDetails = cart
      .map(
        (item, i) =>
          `Item ${i + 1}: ${item["Components"]}
Quantity: ${item.quantity || 1}
Subtype: ${item["Component Subtypes"]}
Size: ${item["Size"]}
Features: ${item["Features"]}
---------------------------`
      )
      .join("\n");

    const templateParams = {
      message: orderDetails,
      order_count: cart.length,
    };

    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams,
        "YOUR_PUBLIC_KEY"
      )
      .then(() => {
        alert("✅ Order sent successfully!");
        localStorage.removeItem("cart");
        setCart([]);
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Failed to send order");
      });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-blue-600 font-bold">← Back</button>
        <h1 className="text-3xl font-extrabold text-gray-900">Cart Orders</h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
          <p className="text-gray-500 text-lg mb-4">Your cart is currently empty.</p>
          <button 
            onClick={() => navigate("/home")}
            className="text-blue-600 underline font-bold"
          >
            Go back to shop
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item, i) => (
            <div
              key={i}
              className="bg-white border p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-1">
                <h2 className="font-bold text-xl text-gray-800 mb-1">
                  {item["Components"]}
                </h2>
                <div className="text-sm text-gray-500 grid grid-cols-2 gap-x-4">
                  <p>Subtype: {item["Component Subtypes"]}</p>
                  <p>Size: {item["Size"]}</p>
                </div>
              </div>

              {/* QUANTITY CONTROLS */}
              <div className="flex items-center gap-4 border rounded-lg p-1 px-3">
                <button 
                  onClick={() => updateQuantity(i, -1)}
                  className="text-xl font-bold text-gray-400 hover:text-blue-600"
                >
                  −
                </button>
                <span className="font-bold text-lg w-8 text-center">
                  {item.quantity || 1}
                </span>
                <button 
                  onClick={() => updateQuantity(i, 1)}
                  className="text-xl font-bold text-gray-400 hover:text-blue-600"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(i)}
                className="text-red-500 hover:text-red-700 font-medium px-4 py-2"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-green-100">
             <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">Total Items:</span>
                <span className="text-2xl font-bold text-gray-900">{cart.length}</span>
             </div>
             <button
                onClick={sendEmail}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-xl py-4 rounded-xl font-bold transition shadow-md shadow-green-200"
              >
                Place Order via Email
              </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;