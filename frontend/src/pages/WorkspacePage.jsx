import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import { createWorkspace } from "../api/workspaceApi.js";

const CreateWorkspace = ()=>{
    const[name, setName] = useState("");
    const { createNewWorkspace} = useWorkspace();

    const navigate = useNavigate();

    const handleClick = async () => {
    try{
     await createNewWorkspace({ name });

     setName("");

     navigate("/dashboard");
     
    } catch(error){
        console.log(error);
    }
    };

    return(
        <div className="workspace-card"> 

        <h2 className="workspcae-title">Create Workspace</h2>

        <p className="workspace-subtitle">
            organize teams, tasks and collaboration
            </p>

            <input
            className="workspace-input"
            placeholder="workspace name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <button className="workspace-btn" onClick={handleClick}>
                Create Workspace
            </button>
        </div>

    );
}
export default CreateWorkspace;