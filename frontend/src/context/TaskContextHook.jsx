import { useContext } from "react";
import { TaskContext } from "./TaskContextValue.jsx";

export const useTask = () => useContext(TaskContext);