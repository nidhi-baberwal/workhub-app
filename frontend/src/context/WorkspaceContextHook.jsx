import { useContext } from "react";
import { WorkspaceContext } from "./WorkspaceContextValue.jsx";

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);

    if (!context) {
        throw new Error("useWorkspace must be used inside WorkspaceProvider");
    }

    return context;
};