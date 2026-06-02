import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,

    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo",
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },

    dueDate: {
        type: Date,
    },

    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: "null"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, 
   {timestamps: true}
);

const Task = mongoose.model("Task", taskSchema);

export default Task;