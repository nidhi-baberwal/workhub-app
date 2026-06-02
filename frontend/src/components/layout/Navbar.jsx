import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    return(
    <div className="navbar" >
    <h3 className="logo"> Task Manager</h3>

    <div className="nav-right"> 
        <span className="username"> {user?.name} </span>

        <button className="logout-btn" 
            onClick={logout}
            >
            Logout
        </button>
    </div>
    </div>
    );
}
export default Navbar;