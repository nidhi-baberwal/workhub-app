import {  createContext, useContext, useState } from "react";
import { createTask, getMyTasks, getTasks, updateTask, deleteTask} from "../api/taskApi.js";

const TaskContext = createContext();

export const TaskProvider = ({children}) => {
    const [workspaceTasks, setWorkspaceTasks] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMyTasks = async () => {
     try {
      setLoading(true);

      const data = await getMyTasks();

      setMyTasks(data);

     } catch (err) {
      console.log("My tasks error:", err.message);
     } finally {
      setLoading(false);
      }
     };

    const fetchTasks = async (workspaceId) => {
        try{
        setLoading(true);

        const data = await getTasks(workspaceId);
        setWorkspaceTasks(data.tasks);
        } catch (err) {
        console.log("Task fetch failed:", err.message);
    } finally {
        setLoading(false);
    }
};

    const addTask = async (taskData) => {
        try{
           const newTask = await createTask(taskData);

           console.log("TASK CREATED:", newTask);

        setWorkspaceTasks((prev) => {
            if (!Array.isArray(prev)) return [newTask];
            return [...prev, newTask];
        }
    ) 
    } catch(error){
        console.log("ERROR:", error.response?.data || error.message);
    }
};

    const editTask = async (taskId, data) => {
        const updated = await updateTask(taskId, data);
        setWorkspaceTasks((prev) => 
        prev.map((t) => (t._id === taskId ? updated : t))
    );
    }

    const removeTask = async(taskId) => {
        try {

        await deleteTask(taskId);
        setWorkspaceTasks((prev) =>
        prev.filter((t) => t._id !== taskId));
     }
      catch(error){
      console.log(error);
     }
    };
    
    return (
        <TaskContext.Provider value={{
            workspaceTasks,
            myTasks,
            loading,
            fetchTasks,
            fetchMyTasks,
            addTask,
            editTask,
            removeTask,
        }}>
            {children}
        </TaskContext.Provider>
    );

}
export const useTask = () => useContext(TaskContext);