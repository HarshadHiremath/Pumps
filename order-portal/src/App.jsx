import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./component/Login";
import Home from "./component/Home";
import Cart from "./component/Cart";

function App() {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/home" /> : <Login setUser={setUser} />
          }
        />

        {/* HOME */}
        <Route
          path="/home"
          element={
            user ? <Home setUser={setUser} /> : <Navigate to="/" />
          }
        />

        {/* ✅ CART (ADDED) */}
        <Route
          path="/cart"
          element={
            user ? <Cart /> : <Navigate to="/" />
          }
        />

        {/* ✅ OPTIONAL: handle unknown routes */}
        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/"} />}
        />

      </Routes>
    </Router>
  );
}

export default App;