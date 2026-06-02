import { useEffect } from "react";
import { useTask } from "../context/TaskContext";

const MyTasks = () => {

   const { myTasks, fetchMyTasks } = useTask();

   useEffect(() => {
      fetchMyTasks();
   }, [fetchMyTasks]);

   return (
      <div>
         <h2>My Tasks</h2>

         {myTasks.map((task) => (
            <div key={task._id}>
               <p>{task.title}</p>
               <p>{task.status}</p>
            </div>
         ))}
      </div>
   );
};

export default MyTasks;