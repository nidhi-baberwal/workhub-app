import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import Workspace from "../models/workspaceModel.js";

export const createTask = async(req, res) => {
    try{
    
    console.log("CREATE TASK HIT");

    console.log("TASK BODY:", req.body);
    console.log("USER:", req.user);

   const{ title, description, workspace, priority, dueDate, assignedTo} = req.body;

   //check workspace exists
   const existingWorkspace = await Workspace.findById(workspace);
   console.log("FOUND WORKSPACE:", existingWorkspace);

   if(!existingWorkspace){
    return res.status(404).json({message: "Workspace not found"});
   }

   //create task
   const task = await Task.create({
    title,
    description,
    workspace: workspace,  //linking task to workspace
    createdBy: req.user.id,
    priority,
    dueDate,
    assignedTo
   });
 
   const populatedTask = await Task.findById(task._id)
   .populate("assignedTo", "name email")
   .populate("createdBy", "name")
   .populate("workspace", "name");

   res.status(201).json(populatedTask);
    } catch(error){
        res.status(500).json({message: error.message});
        }
};

// get tasks from that workspace because one workspace have many tasks

export const getTasks = async(req, res) => {
    try{
        const{ workspaceId } = req.params;

        //filters from query
        const{status, priority, search, page=1, limit=5} = req.query;

        //build filter object
        let filter = {workspace: workspaceId};

        if(status){
            filter.status = status; //e.g. pending, completed
        }

        if(priority){
            filter.priority = priority; //e.g high, low
        }

        if(search){
            filter.title = {$regex: search, $options: "i"}; //case insensitive
        }

        //pagination logic
        const skip = (page - 1) * limit;


        //give all tasks of this workspace
        const tasks = await Task.find(filter)
                    .populate("assignedTo", "name email")
                    .populate("createdBy", "name email")
                    .populate("workspace", "name")
                    .sort({priority: -1, dueDate: 1})
                    .skip(skip)
                    .limit(Number(limit));
                    //highest priority first, earliest due first

        //Total count for frontend
        const totalTasks= await Task.countDocuments(filter);          

        res.status(200).json({
            totalTasks,
            currentPage: Number(page),
            totalPages: Math.ceil(totalTasks / limit),
            tasks
        });

        
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

export const getMyTasks = async (req, res) => {
   try {

      const tasks = await Task.find({
         assignedTo: req.user.id
      })
      .populate("workspace", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

      res.status(200).json(tasks);

   } catch(error) {
      res.status(500).json({
         message: error.message
      });
   }
};

// update tasks
export const updateTask = async(req, res) => {
    try{
        const{title, description, status, priority, dueDate, assignedTo} = req.body;

        //1. find task
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }

        //2.find workspace
        const workspace = await Workspace.findById(task.workspace);

        //3.permission check
        const isOwner = workspace.owner.toString() === req.user.id;
        const isAssignedUser = task.assignedTo?.toString() ===req.user.id;

        if(!isOwner && !isAssignedUser){
            return res.status(403).json({
                message:"Not allowed to update this task"
            });
        }

        //4. update only allowed fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.assignedTo = assignedTo || task.assignedTo;
    
      await task.save();

    res.status(200).json(task);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

export const deleteTask = async(req, res) => {
    try{
     
        await Task.findByIdAndDelete( req.params.id);
        res.json({message: "Task deleted"});

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

// Assign tasks to a user
//PUT  /api/tasks/:taskId/assign

export const assignTask = async(req, res) => {
 try{
  const{ taskId } = req.params;
  const{ userId } = req.body;  //userId to assign

  //1. find task
   const task = await Task.findById(taskId);
   if(!task){
    return res.status(404).json({message: "Task not found"});
   }

   //2. find workspace
   const workspace = await Workspace.findById(task.workspace);

   //3.Only owner can assign task
   if(workspace.owner.toString() !== req.user.id){
    return res.status(403).json({
        message:"Only workspace owner can assign tasks"
    });
   }


  //4. check assigned user is exists
   const user = await User.findById(userId);
   if(!user){
    return res.status(404).json({message: "User not found"});
   }

   //5.check user is in workspace
    const isMember  = workspace.members.some(
        member => member.user.toString() === userId
    );

   if(!isMember){
    return res.status(400).json({message: "User not in workspace"});
   }
 
   //6.Assign task
   task.assignedTo = userId;
   await task.save();

   res.status(200).json(task);


 }catch(error){
    res.status(500).json({message: error.message});
 }
};