import { useEffect } from "react";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import CreateWorkspace from "./WorkspacePage.jsx";
import CreateTask from "../components/tasks/CreateTask.jsx";
import { useTask } from "../context/TaskContext.jsx";
import AddMember from "../components/workspace/AddMember.jsx";
import TaskList from "../components/tasks/TaskList.jsx";
import MembersList from "../components/workspace/MemberList.jsx";

const Dashboard = () => {
    const { currentWorkspace } = useWorkspace();
    const { fetchTasks } = useTask();

    //logged-in user
    const user = JSON.parse(localStorage.getItem("user"));
    
     useEffect(() => {
        if (currentWorkspace?._id) {
            fetchTasks(currentWorkspace._id);
        }
    }, [currentWorkspace?._id]);

    if(!currentWorkspace){
        return <div>No workspace selected</div>;
    }

     console.log("USER:", user);

     console.log("WORKSPACE:", currentWorkspace);

     console.log("MEMBERS:", currentWorkspace.members);

     // find current user inside workspace members
     const currentMember = currentWorkspace.members?.find(
      (m) => String(m.user?._id || m.user) === String(user._id)
    );
     
     console.log("CURRENT MEMBER:", currentMember);

      const role = currentMember?.role;
      
      console.log("ROLE:", role);

      const isOwner = role === "owner";

      console.log("IS OWNER:", isOwner);

      const isAdmin = role === "admin";

    return (
    <div className="dashboard-container">

        <div className="workspace-header">
        <p className="workspace-label">Current Workspace</p>

        <h2 className="workspace-title">Workspace: {currentWorkspace.name}</h2>
        </div>

        <div className="dashboard-content">

        <div className="dashboard-actions">   

         {/* owner + admin can create task */}   
        {(isOwner || isAdmin) &&  <CreateTask/>}
        
        {/*only owner can see add member*/ }
        {isOwner && <AddMember/>}

        </div> 

        <TaskList/>

        <MembersList
         members={currentWorkspace.members}
         owner= {currentWorkspace.owner}
        />
        </div>

    </div>
    );
}
export default Dashboard;