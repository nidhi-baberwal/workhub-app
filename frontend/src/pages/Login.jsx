import {useState} from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login }= useAuth();

    const navigate = useNavigate();
    
    const[form, setForm]= useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(form);
        try{
        console.log("LOGIN START");

        await login(form);

        console.log("LOGIN SUCCESS");

        navigate("/dashboard");


    }catch(err){
        console.log("LOGIN FAILED:" , err.response?.data);
    }
    }
 
    return(
    <form className="auth-card" onSubmit = {handleSubmit}>
     <h2 className="auth-title">Login</h2>

     <input 
     className="auth-input"
     type = "email"
     value={form.email}
     placeholder= "Enter your email"
     onChange= {(e) => setForm({...form, email: e.target.value})}
     />

     <input 
     className="auth-input"
     type = "password"
     value={form.password}
     placeholder= "Enter your password"
     onChange= {(e) => setForm({...form, password: e.target.value})}
     />

     <button type= "submit" className="auth-btn">
        Login
        </button>
    </form>
    );
}
export default Login;