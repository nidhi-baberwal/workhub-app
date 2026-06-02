import { useState } from "react";
import { useTask } from "../../context/TaskContext.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";

const CreateTask = () => {
    const { addTask } = useTask();
    const { currentWorkspace } = useWorkspace();

    const[title, setTitle] = useState("");
    const [assignedTo, setAssignedTo] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!title || !currentWorkspace) return;
         await addTask({
            title,
            workspace: currentWorkspace._id,  //"6a034187862a490af41a29a4" 
            assignedTo
         });

         setTitle("");
         setAssignedTo("");
    }

    return(
     <form className="task-form" onSubmit={handleSubmit}>
     
     <input
     className="task-input" 
     placeholder="Enter task..."
     value={title}
     onChange={(e) => setTitle(e.target.value)}
     />

     {/* Assign member dropdown */}
            <select
                className="task-select"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
            >

                <option value="">Unassigned</option>

                {currentWorkspace.members?.map((member) => (

                    <option
                        key={member.user?._id || member.user}
                        value={member.user?._id || member.user}
                    >
                        {member.user?.name || "Unknown User"}
                    </option>

                ))}

            </select>

     <button className="task-btn" type="submit">Add Task</button>
     </form>
    );
}
export default CreateTask;