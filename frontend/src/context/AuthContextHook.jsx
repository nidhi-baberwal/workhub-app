import { useContext } from "react";
import { AuthContext } from "./AuthContextValue.jsx";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("AuthContext missing Provider");
    }

    return context;
};