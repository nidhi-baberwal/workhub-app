import Workspace from "../models/workspaceModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

export const createWorkspace = async(req, res) => {
    try{

    console.log("BODY:", req.body);

    const {name} = req.body;
    console.log("NAME:", name);

    const userId = new mongoose.Types.ObjectId(req.user.id);
     console.log("USER ID:", userId);

    const workspace = await Workspace.create({
      name,
      owner: userId,
      members: [
        {
         user: userId,
         role: "owner",
        }
      ]
    });

    await workspace.populate("members.user", "name email");
     
    console.log("WORKSPACE CREATED:", workspace);

    res.status(201).json(workspace);
} catch(error){
    console.log("WORKSPACE ERROR:", error);
    res.status(500).json({message: error.message});
}
};

//delete workspace
export const deleteWorkspace = async(req, res)=> {
    try{
        console.log(" deleteWorkspace CONTROLLER HIT");
        console.log("PARAMS:", req.params);
        console.log("USER:", req.user);

        const workspace = await Workspace.findById(req.params.workspaceId);

        console.log(" Workspace found:", workspace);

        if(!workspace)
            console.log(" Workspace not found");
            return res.status(404).json({
               message: "Workspace not found"
            });
        

        //only owner can delete workspace
        if(workspace.owner.toString() !== req.user.id){
            console.log(" Not owner");
            return res.status(403).json({
                message: "Only owner can delete workspace"
            });
        }

        console.log(" Deleting workspace...");
        await workspace.deleteOne();

        console.log(" Workspace deleted");
        res.status(200).json({
            message: "Workspace deleted successfully"
        });
    } catch (error){
        console.log("DELETE ERROR:", error);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const addMember = async(req, res) => {
    try{
        const{workspaceId} = req.params; //frontend sends
        const{email, role} = req.body;
    
        //1.find workspace
        const workspace = await Workspace.findById(workspaceId)
        .populate("members.user", "name email");

        if(!workspace){
            return res.status(404).json({message: "Workspace not found"});
        }

        //2.check if requester is owner/role check
        if(workspace.owner.toString() !== req.user.id){
            return res.status(403).json({message: "Only Owner can add members"});
        }

        //3.check if user is there or not
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        //4.check if user is already exists
        const alreadyMember = workspace.members.find(
           (m) => m.user._id.toString() === user._id.toString()
        );

        if (alreadyMember) {
      return res.status(400).json({ message: "User already a member" });
         }

        //5.Add member
        workspace.members.push({
            user: user._id,
            role: role || "member",
            addedAt: new Date()
        });

        //6. Save updated workspace
        await workspace.save();
        
        await workspace.populate("members.user", "name email");

        res.status(200).json({
            message: "Member added successfully",
            workspace
        });

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

export  const getWorkspaces = async(req,res) => {
    try{
         console.log("GET USER:", req.user); 
     const userId = req.user.id;

     const workspaces = await Workspace.find({
        $or: [
            {owner: userId},
            {"members.user": userId}
        ]
     })
     
     .populate("owner", "name email")
     .populate("members.user", "name email");
     
     console.log("WORKSPACES:", workspaces);
     res.json(workspaces);
    } catch(error){
        res.status(500).json({message: error.message});
    }
};