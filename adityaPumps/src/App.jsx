import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./component/Login";
import Home from "./component/Home";

function App() {
    const [user, setUser] = useState(null);

    // Check localStorage on app start
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <Router>
            <Routes>
                {/* Login Route */}
                <Route
                    path="/"
                    element={
                        user ? (
                            <Navigate to="/home" />
                        ) : (
                            <Login setUser={setUser} />
                        )
                    }
                />

                {/* Protected Home Route */}
                <Route
                    path="/home"
                    element={
                        user ? <Home setUser={setUser} /> : <Navigate to="/" />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
