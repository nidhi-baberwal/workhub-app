import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import Settings from "./pages/Settings.jsx";
import CreateWorkspace from "./pages/WorkspacePage.jsx";
import MyTasks from "./pages/MyTasks.jsx";

function App(){
  return(
  
      <Routes>

        {/*redirect root*/}
        <Route path= "/" 
           element ={
            localStorage.getItem("token") 
             ? <Navigate to= "/dashboard"/>
             : <Navigate to= "/login"/>
           }/>
           
        {/*public routes*/}
        <Route path="/login" element={<Login/>}/>
        <Route path= "/register" element= {<Register/>}/>

        {/*protected + layout routes*/}
        <Route 
        element={
          <PrivateRoute>
            <MainLayout/>
          </PrivateRoute>
         } 
         >
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/my-tasks" element={<MyTasks />} />
         <Route path="/settings" element={<Settings/>} />
         <Route path="/create-workspace" element={<CreateWorkspace />}
/>
         </Route>

      </Routes>
  
  );
}
export default App;