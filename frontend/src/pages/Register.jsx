import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Register = ()=> {
    const{ register } = useAuth();

    const[form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        register(form);
    }

    return(
   <form className="auth-card" onSubmit = {handleSubmit}>
    <h2 className="auth-title">Create Account</h2>

    <p className="auth-subtitle">
        start managing your task smarter
    </p>

    <input
    className="auth-input"
    value={form.name}
     type="text"
     placeholder="Enter your name"
     onChange={(e) =>
       setForm({ ...form, name: e.target.value })}
    />

    <input
    className="auth-input"
    value={form.email}
     type = "email"
     placeholder = "Enter your email"
     onChange = {(e) => 
        setForm({...form, email: e.target.value})}
    />

    <input
    className="auth-input"
    value={form.password}
     type = "password"
     placeholder = "Enter your password"
     onChange = {(e) => 
        setForm({...form, password: e.target.value})}
    />
    
    <button className="auth-btn">Register</button>
   </form>
    );
}
export default Register;