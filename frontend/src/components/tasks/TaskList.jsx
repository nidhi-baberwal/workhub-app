import { useTask} from "../../context/TaskContext.jsx";

const TaskList = () => {
    const{workspaceTasks, loading, removeTask} = useTask();
    
    if(loading) return <p className="loading"> Loading...</p>

    if (!workspaceTasks || workspaceTasks.length === 0)  {
        return (
        <div  className="empty-state">
                <h3>No tasks yet 🚀</h3>
          <p>Create your first task to start collaborating.</p>    
            </div>
        );
    }

    const handleDelete = async (taskId) => {

        const confirmDelete =
            window.confirm("Delete this task?");

        if(!confirmDelete) return;

    try{
      await removeTask(taskId);
     } catch(error){
      console.log(error);
     }
    };

    return(
    <div className="task-list">
        {workspaceTasks.map((task) => (
            <div key={task._id} className="task-card">

                <h3 className="task-title">
                    {task.title}
                    </h3>

                <p className={`task-status ${task.status}`}> 
                    Status: {task.status} 
                </p>

                <p className={`task-priority ${task.priority}`}>
                    Priority: {task.priority}
                </p> 

                <p className="task-meta">
                      Workspace: {task.workspace?.name}
                </p>

                <p className="task-meta">
                   Created By: {task.createdBy?.name}
                </p>

                <p className="task-meta">
                   Assigned To: {task.assignedTo?.name || "Unassigned"}
                </p>  

                <button
                        className="delete-btn"
                        onClick={() => handleDelete(task._id)}
                    >
                       🗑️ Delete
                    </button> 

                </div>
        ))}
    </div>
    );
};
export default TaskList;