import { Children } from "react";
import { useAuth } from "../context/AuthContext";   
import { Navigate } from "react-router-dom";

const PrivateRoute = ({children}) => {
 const {user, loading} = useAuth();

 //wait until we check localstorage
 if(loading){
    return <h2>Loading...</h2>;
 }

 //if not logged in-> redirect
 if(!user){
    return<Navigate to= "/login"/>;
 }

 //logged in-> show page
 return children;
}
export default PrivateRoute;