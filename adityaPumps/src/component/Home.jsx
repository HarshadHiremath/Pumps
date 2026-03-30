import { useNavigate } from "react-router-dom";

function Home({ setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    return (
        <div>
            <h2>Welcome to Home Page 🎉</h2>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Home;
