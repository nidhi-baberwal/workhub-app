import axios from "axios";

const API= axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

//attach token automatically
API.interceptors.request.use((req) => {
    console.log("Interceptor running");

    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

     if(token){
        req.headers.Authorization = `Bearer ${token}`;
     }
     return req;
});

export default API;