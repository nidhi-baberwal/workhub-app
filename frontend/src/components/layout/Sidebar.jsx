import { useWorkspace } from "../../context/WorkspaceContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();
    const {
        workspaces,
        currentWorkspace,
        removeWorkspace,
        setCurrentWorkspace
    } = useWorkspace();

    const handleDelete = async(workspaceId) =>{
        console.log("🟡 handleDelete clicked:", workspaceId);
        
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this workspace?"
        );

        if(!confirmDelete) return;

        await removeWorkspace(workspaceId);
    };

    return(
    <div className="sidebar">
        <h3 className="sidebar-title"> Workspaces </h3>
       
       <div className="workspace-list">
        {workspaces?.map((ws) => {
            const isActive = currentWorkspace?._id === ws._id;

            return(
              <div
                key={ws._id}
                className={`workspace-item ${isActive ? "active" : ""}`}
>
                <span onClick={() => setCurrentWorkspace(ws)}>
                  {ws.name}
                </span>

                <button
                className="delete-btn"
                 onClick={(e) => {
                 e.stopPropagation();
                 handleDelete(ws._id);
                 }}
                 >
                 🗑️
                </button>
                </div>
                );
               })
              }
    </div>

    <hr className="divider"/>
    <h4 className="menu-title"> Menu </h4>

    <div className="menu-item" onClick={() => navigate("/create-workspace")}>
     + Create Workspace
    </div>

    <div className="menu-item" onClick={() => navigate("/dashboard")} >
      Dashboard
    </div>

    <div className="menu-item" onClick={() => navigate("/my-tasks")} >
      My Tasks
    </div>

    <div className="menu-item" onClick={() => navigate("/settings")} >
     Settings
     </div>
</div>
    );
};
export default Sidebar;