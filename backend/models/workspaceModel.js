import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  members: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        role: {
            type: String,
            enum: [ "owner", "admin", "member"],
            default: "member",
        }
    }
  ]
},
{timestamps: true,}
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;