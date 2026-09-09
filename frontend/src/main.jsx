import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/index.css"
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { WorkspaceProvider } from './context/WorkspaceContext.jsx'
import { TaskProvider } from './context/TaskContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <WorkspaceProvider>
        <TaskProvider>
      <App/>
        </TaskProvider>
      </WorkspaceProvider>
    </AuthProvider>
  </BrowserRouter>,
)
