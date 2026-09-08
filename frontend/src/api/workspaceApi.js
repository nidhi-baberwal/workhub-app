import API from "./axios";

// get all workspaces 
export const getWorkspaces = () =>
  API.get("/workspaces");

//create workspace
export const createWorkspace = (data) =>
    API.post("/workspaces", data);

//add member
export const addMember = (workspaceId, data) =>
    API.post(`/workspaces/${workspaceId}/members`, data);

//update workspace
export const updateWorkspace = (workspaceId, data) =>
  API.put(`/workspaces/${workspaceId}`, data);

//delete workspace
export const deleteWorkspace = (workspaceId) =>
  API.delete(`/workspaces/${workspaceId}`);

