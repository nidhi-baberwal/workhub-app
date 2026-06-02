import { useTask } from "../../context/TaskContext";

const AssignTask = () => {
    const { tasks, editTask } = useTask();

    const handleAssign = (taskId, userId) => {
        if(!userId) return;
        editTask(taskId, {assignedTo: userId});
    };

    return(
        <div>
            {tasks.map((task) => (
                <div key={task._id}>
                 <p>{task.title}</p>
                 <select
                    value={task.assignedTo || ""}
                    onChange={(e) => handleAssign(task._id, e.target.value)}
                 >
                    <option value="">Assign user</option>
                    <option value="u1">User 1</option>
                    <option value="u2">User 2</option>
                    <option value="u3">User 3</option>
                    </select>
                </div>
            ))}
    </div>
    );
};
export default AssignTask;