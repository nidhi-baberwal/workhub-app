import API from "./axios";

// get all workspaces 
export const getWorkspaces = () =>
  API.get("/workspaces");

//create workspace
export const createWorkspace = (data) =>
    API.post("/workspaces", data);

//delete workspace
export const deleteWorkspace = (workspaceId) =>
  API.delete(`/workspaces/${workspaceId}`);

//add member
export const addMember = (workspaceId, data) =>
    API.post(`/workspaces/${workspaceId}/members`, data);

