TaskFlow SaaS - Collaborative Task Management Platform

A full-stack SaaS application built with the MERN stack that enables teams to collaborate through shared workspaces, member management, and task tracking.

The platform allows users to create workspaces, invite team members, assign tasks, manage project progress, and collaborate in a secure role-based environment.

 Project Overview:

TaskFlow is designed to simulate how modern project management platforms operate.

Users can:

Create multiple workspaces
Invite team members
Assign tasks
Manage project workflows
Track task progress
Collaborate through shared dashboards

The application follows a scalable SaaS architecture with secure authentication, authorization, and clean REST API design.

Core Features:

Authentication & Security:
User Registration
Secure Login System
JWT Authentication
Protected Routes
Persistent User Sessions
Authorization Middleware

Workspace Management:
Create Workspaces
View All User Workspaces
Workspace Switching
Workspace Ownership
Team Collaboration

Team Member Management:
Invite Members via Email
Owner & Member Roles
Workspace Membership Tracking
Role-Based Access Control (RBAC)

Task Management
Create Tasks
Assign Tasks to Members
Update Task Status
Delete Tasks
Track Assigned Users
Workspace-Based Task Organization

Each task contains:
{
  "title": "Fix Login Bug",
  "priority": "Medium",
  "status": "Todo",
  "assignedTo": "User",
  "workspace": "Workspace"
}

Advanced Functionality:
Search Tasks
Filter by Status
Filter by Priority
Pagination
Dynamic Data Fetching
MongoDB Population
Dashboard Experience
Workspace Sidebar
Team Member Directory
Task Cards
Assignment Tracking
User-Based Task Visibility
End-to-End Testing (Cypress)

This project includes automated Cypress testing to ensure critical user workflows function correctly.

Authentication Tests:

-> User Login

-> Invalid Login Handling

-> Route Protection

Workspace Tests:

-> Create Workspace

-> Workspace Selection

-> Workspace Visibility

Task Tests:

-> Create Task

-> Assign Task

-> Task Display Verification

Tech Stack:

Frontend:
React.js
React Router
Context API
Axios
CSS

Backend:
Node.js
Express.js
MongoDB
Mongoose

Authentication:
JWT
bcrypt

Testing:
Cypress

Tools:
Git
GitHub
VS Code

project structure
taskflow-saas/

├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── api/
│   └── App.jsx
│
└── README.md

REST API Endpoints:
Authentication
POST /api/auth/register
POST /api/auth/login

Workspaces
POST   /api/workspaces
GET    /api/workspaces
PUT    /api/workspaces/:id
DELETE /api/workspaces/:id


Tasks
POST   /api/tasks
GET    /api/tasks/:workspaceId
PUT    /api/tasks/:id
DELETE /api/tasks/:id

Key Engineering Concepts Demonstrated:
Full-Stack MERN Development
SaaS Application Architecture
Authentication & Authorization
Role-Based Access Control
RESTful API Design
MongoDB Data Modeling
State Management
Protected Routes
Team Collaboration Systems
End-to-End Testing
Pagination & Filtering
Clean Component Architecture

Future Enhancements:
Drag & Drop Kanban Board
Real-Time Notifications
Socket.IO Integration
Email Invitations
Activity Logs
File Attachments
Due Dates & Reminders
Docker Deployment
AWS Deployment
CI/CD Pipeline

What I Learned:

Building this project strengthened my understanding of:

Scalable MERN Architecture
API Security
JWT Authentication Flow
MongoDB Relationships
Team Collaboration Systems
Cypress E2E Testing
Frontend-Backend Integration
Real-World SaaS Development

Author

Nidhi

Full Stack MERN Developer