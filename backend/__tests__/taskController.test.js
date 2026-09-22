import { jest } from "@jest/globals";

const mockTask = {
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockWorkspace = {
  findById: jest.fn(),
};

const mockUser = {
  findById: jest.fn(),
};

jest.unstable_mockModule("../models/taskModel.js", () => ({
  default: mockTask,
}));

jest.unstable_mockModule("../models/workspaceModel.js", () => ({
  default: mockWorkspace,
}));

jest.unstable_mockModule("../models/userModel.js", () => ({
  default: mockUser,
}));

const {
  createTask,
  getTasks,
  getMyTasks,
  updateTask,
  deleteTask,
  assignTask,
} = await import("../controllers/taskController.js");

describe("Create Task controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return 404 if workspace does not exist", async () => {
    mockWorkspace.findById.mockResolvedValue(null);

    const req = {
      body: {
        title: "Test Task",
        description: "Test description",
        workspace: "workspace123",
        priority: "high",
        dueDate: "2026-09-30",
        assignedTo: "user123",
      },
      user: {
        id: "creator123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createTask(req, res);

    expect(mockWorkspace.findById).toHaveBeenCalledWith("workspace123");

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      message: "Workspace not found",
    });

    expect(mockTask.create).not.toHaveBeenCalled();
  });

  it("should return 500 if creating task fails", async () => {
  mockWorkspace.findById.mockRejectedValue(
    new Error("Database error")
  );

  const req = {
    body: {
      title: "Test Task",
      workspace: "workspace123",
    },
    user: {
      id: "creator123",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await createTask(req, res);

  expect(res.status).toHaveBeenCalledWith(500);

  expect(res.json).toHaveBeenCalledWith({
    message: "Database error",
  });
});

it("should create a task successfully", async () => {
  const workspace = {
    _id: "workspace123",
    name: "Development",
  };

  const createdTask = {
    _id: "task123",
  };

  const populatedTask = {
    _id: "task123",
    title: "Test Task",
    description: "Test description",
  };

  mockWorkspace.findById.mockResolvedValue(workspace);

  mockTask.create.mockResolvedValue(createdTask);

  mockTask.findById.mockReturnValue({
    populate: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(populatedTask),
      }),
    }),
  });

  const req = {
    body: {
      title: "Test Task",
      description: "Test description",
      workspace: "workspace123",
      priority: "high",
      dueDate: "2026-09-30",
      assignedTo: "user123",
    },
    user: {
      id: "creator123",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await createTask(req, res);

  expect(mockWorkspace.findById).toHaveBeenCalledWith(
    "workspace123"
  );

  expect(mockTask.create).toHaveBeenCalledWith({
    title: "Test Task",
    description: "Test description",
    workspace: "workspace123",
    createdBy: "creator123",
    priority: "high",
    dueDate: "2026-09-30",
    assignedTo: "user123",
  });

  expect(res.status).toHaveBeenCalledWith(201);

  expect(res.json).toHaveBeenCalledWith(populatedTask);
});
});

