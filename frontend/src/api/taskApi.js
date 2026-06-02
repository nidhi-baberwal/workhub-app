import API from "./axios";

//create task
export const createTask = async(taskData, token) => {
    console.log("FRONTEND CREATE TASK CALLED");
    const res= await API.post("/tasks", taskData);
    return res.data;
};

//get all tasks by workspace
export const getTasks = async(workspaceId, token) => {
    const res = await API.get(`/tasks/${workspaceId}`); 
    return res.data;
}; 

//get myTasks 
export const getMyTasks = async () => {
    const res = await API.get("/tasks/my-tasks");
    return res.data;
};

//update task
export const updateTask = async(taskId, data, token) => {
    const res = await API.put(`/tasks/${taskId}`, data);
    return res.data;
};

//delete task
export const deleteTask = async(taskId, token) => {
    const res = await API.delete(`/tasks/${taskId}`); 
    return res.data;
};
