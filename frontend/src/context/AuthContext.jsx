import { useState } from "react";
import { AuthContext } from "./AuthContextValue.jsx";
import * as api from "../api/authApi.js";

export const AuthProvider = ({ children })=>{
    const[user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const loading = false;


    //LOGIN
    const login = async(formData) =>{
        const res = await api.loginUser(formData);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setUser(res.data.user);
    };

        //REGISTER
        const register = async(formData) =>{
            await api.registerUser(formData);
        };

        //LOGOUT
        const logout = ()=>{
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        };

      return (
        <AuthContext.Provider value={{
          user,
          login,
          register,
          logout,
          loading
        }
        }>
            {children}
        </AuthContext.Provider> 
      );
    };

    