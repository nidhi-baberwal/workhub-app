import { useState } from "react";
import { addMember } from "../../api/workspaceApi";
import { useWorkspace } from "../../context/WorkspaceContext";

const AddMember = ()=>{
   
    const { currentWorkspace } = useWorkspace();

    const[email, setEmail] = useState("");
    const[role, setRole] = useState("member");
    const[loading, setLoading] = useState(false);
    
    const handleAddMember =  async()=> {
        try{
            if(!currentWorkspace){
                alert("please select a workspace");
                return;
        }

            if(!email){
                alert("Email is required");
                return;
            }

            setLoading(true);

            const res = await addMember(currentWorkspace._id, {
                email,
                role,
            });

            alert("member added successfully");

            console.log(res.data);

            setEmail("");
            setRole("member");

        } catch(error){
            console.log(error);

            alert(
                 error.response?.data?.message ||
                 "Failed to add member"
            );
        } finally{
            setLoading(false);
        }
    };

    return(
        <div className="add-member-card">
            <h3 className="add-member-title">Add Member</h3>

            <input 
             type="email"
             className="input"
             value={email}
             placeholder="Enter your Email"
             onChange={(e)=> setEmail(e.target.value)}
              />

            <select 
            value={role}
            className="input"
            onChange={(e)=> setRole(e.target.value)}
             >
                <option value="member">Member</option>
                <option value= "admin">Admin</option>
            </select>

            <button
             className="btn btn-primary full-btn"
              onClick={handleAddMember}
              disabled={loading}
              >
                {loading ? "Adding..." : "Add Member"}
             </button>
        </div>
    );
};
export default AddMember;