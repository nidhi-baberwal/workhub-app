import API from "./axios";

//register
export const registerUser = (data)=>
    API.post("/auth/register", data);

//login
export const loginUser = (data) =>
    API.post("/auth/login", data);