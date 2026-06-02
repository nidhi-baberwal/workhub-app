import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../api/workspaceApi.js";
import { useAuth } from "./AuthContext.jsx";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) =>{
 const[workspaces, setWorkspaces] = useState([]);
 const[currentWorkspace, setCurrentWorkspace] = useState(null);

 const { user } = useAuth();

 //fetch all workspaces
 const fetchWorkspaces = async() => {
   try{

   const token = localStorage.getItem("token");
   const res = await api.getWorkspaces(token);

    console.log("FRONTEND RESPONSE:", res.data);

   setWorkspaces(res.data || []);
   } catch(error){
      console.error("Error fetching workspaces:", error);
   } 
 };

 useEffect(() => {

   if(!user) return;

  fetchWorkspaces();
}, [user]);

 //create workspace
 const createNewWorkspace = async(data) =>{
   try{
    const res = await api.createWorkspace(data);
    
    await fetchWorkspaces();
    
    setCurrentWorkspace(res.data);

    localStorage.setItem("workspace", JSON.stringify(res.data));

    

    return res.data;
   }catch(error){
      console.error("Create workspace error:", error.response?.data || error.message);
   }
 };

 //Delete Workspace
 const removeWorkspace = async(workspaceId) => {
   try{
      await api.deleteWorkspace(workspaceId);

      setWorkspaces((prev) =>
      prev.filter((ws) => ws._id !== workspaceId )
   );

   if(currentWorkspace?._id === workspaceId){
      setCurrentWorkspace(null);
      localStorage.removeItem("workspace");
   }

   } catch(error){
      console.error(
         "Delete Workspace Error:", 
         error.respose?.data || error.message
      );
   }
 };

 //load from localstorage
 useEffect(() => {
    const saved = localStorage.getItem("workspace");
    if(saved) 
      setCurrentWorkspace(JSON.parse(saved));
 }, []);

 const addMemberToWorkspace = async (workspaceId, email, role = "member") => {
   const res = await api.addMember(workspaceId, {email, role});

   if(!res.data?.workspace) return;

   const updatedWorkspace = res.data.workspace;
   

   //update workspace list
   setWorkspaces((prev) => 
   prev.map((ws) =>
   ws._id === updatedWorkspace._id ? updatedWorkspace : ws
  )
 );

 //update current workspace if user is inside it
 if (currentWorkspace?._id === workspaceId){
   setCurrentWorkspace(updatedWorkspace);
   localStorage.setItem(
      "workspace",
      JSON.stringify(updatedWorkspace)
   );
 }

 return res.data;
 }

 return(
    <WorkspaceContext.Provider value={{
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        createNewWorkspace,
        removeWorkspace,
        fetchWorkspaces,
        addMemberToWorkspace
    }}>
        {children}
    </WorkspaceContext.Provider>
 );
};

export const useWorkspace = ()=> {
   const context = useContext(WorkspaceContext);

if(!context){
   throw new Error("useWorkspace must be used inside workspaceProvider")
}

return context;
};