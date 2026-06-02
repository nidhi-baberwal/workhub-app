import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api/authApi.js";

const AuthContext = createContext();


export const AuthProvider = ({ children })=>{
    const[user, setUser] = useState(null);
    const[loading, setLoading] = useState(true);


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


        //Keep user logged in after refresh
        useEffect(() =>{
            const savedUser = localStorage.getItem("user");

            if(savedUser){
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        }, []);

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

    export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("AuthContext missing Provider");
    }

    return context;
};