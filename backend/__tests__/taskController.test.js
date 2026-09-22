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

describe("Get Tasks controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should get tasks successfully", async () => {
    const tasks = [
      {
        _id: "task1",
        title: "Build login page",
        status: "pending",
        priority: "high",
      },
      {
        _id: "task2",
        title: "Build dashboard",
        status: "completed",
        priority: "medium",
      },
    ];

    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(tasks),
    };

    mockTask.find.mockReturnValue(mockQuery);

    mockTask.countDocuments.mockResolvedValue(2);

    const req = {
      params: {
        workspaceId: "workspace123",
      },
      query: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getTasks(req, res);

    expect(mockTask.find).toHaveBeenCalledWith({
      workspace: "workspace123",
    });

    expect(mockQuery.populate).toHaveBeenCalledTimes(3);

    expect(mockQuery.sort).toHaveBeenCalledWith({
      priority: -1,
      dueDate: 1,
    });

    expect(mockQuery.skip).toHaveBeenCalledWith(0);

    expect(mockQuery.limit).toHaveBeenCalledWith(5);

    expect(mockTask.countDocuments).toHaveBeenCalledWith({
      workspace: "workspace123",
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      totalTasks: 2,
      currentPage: 1,
      totalPages: 1,
      tasks,
    });
  });

  it("should filter tasks by status, priority and search", async () => {
  const tasks = [
    {
      _id: "task1",
      title: "Build login page",
      status: "pending",
      priority: "high",
    },
  ];

  const mockQuery = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(tasks),
  };

  mockTask.find.mockReturnValue(mockQuery);

  mockTask.countDocuments.mockResolvedValue(1);

  const req = {
    params: {
      workspaceId: "workspace123",
    },
    query: {
      status: "pending",
      priority: "high",
      search: "login",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await getTasks(req, res);

  expect(mockTask.find).toHaveBeenCalledWith({
    workspace: "workspace123",
    status: "pending",
    priority: "high",
    title: {
      $regex: "login",
      $options: "i",
    },
  });

  expect(mockTask.countDocuments).toHaveBeenCalledWith({
    workspace: "workspace123",
    status: "pending",
    priority: "high",
    title: {
      $regex: "login",
      $options: "i",
    },
  });

  expect(res.status).toHaveBeenCalledWith(200);

  expect(res.json).toHaveBeenCalledWith({
    totalTasks: 1,
    currentPage: 1,
    totalPages: 1,
    tasks,
  });
});

it("should handle pagination correctly", async () => {
  const tasks = [
    {
      _id: "task6",
      title: "Task 6",
    },
  ];

  const mockQuery = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(tasks),
  };

  mockTask.find.mockReturnValue(mockQuery);

  mockTask.countDocuments.mockResolvedValue(11);

  const req = {
    params: {
      workspaceId: "workspace123",
    },
    query: {
      page: "2",
      limit: "5",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await getTasks(req, res);

  expect(mockQuery.skip).toHaveBeenCalledWith(5);

  expect(mockQuery.limit).toHaveBeenCalledWith(5);

  expect(res.status).toHaveBeenCalledWith(200);

  expect(res.json).toHaveBeenCalledWith({
    totalTasks: 11,
    currentPage: 2,
    totalPages: 3,
    tasks,
  });
});

it("should return 500 if getting tasks fails", async () => {
  mockTask.find.mockImplementation(() => {
    throw new Error("Database error");
  });

  const req = {
    params: {
      workspaceId: "workspace123",
    },
    query: {},
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await getTasks(req, res);

  expect(res.status).toHaveBeenCalledWith(500);

  expect(res.json).toHaveBeenCalledWith({
    message: "Database error",
  });
});
});


describe("Get My Tasks controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should get tasks assigned to the logged-in user", async () => {
    const tasks = [
      {
        _id: "task1",
        title: "Build login page",
        assignedTo: "user123",
      },
      {
        _id: "task2",
        title: "Build dashboard",
        assignedTo: "user123",
      },
    ];

    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
    };

    // Final populate returns the tasks
    mockQuery.populate
      .mockReturnValueOnce(mockQuery)
      .mockReturnValueOnce(mockQuery)
      .mockResolvedValueOnce(tasks);

    mockTask.find.mockReturnValue(mockQuery);

    const req = {
      user: {
        id: "user123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getMyTasks(req, res);

    expect(mockTask.find).toHaveBeenCalledWith({
      assignedTo: "user123",
    });

    expect(mockQuery.populate).toHaveBeenNthCalledWith(
      1,
      "workspace",
      "name"
    );

    expect(mockQuery.populate).toHaveBeenNthCalledWith(
      2,
      "assignedTo",
      "name email"
    );

    expect(mockQuery.populate).toHaveBeenNthCalledWith(
      3,
      "createdBy",
      "name"
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(tasks);
  });

  it("should return 500 if getting my tasks fails", async () => {
  mockTask.find.mockImplementation(() => {
    throw new Error("Database error");
  });

  const req = {
    user: {
      id: "user123",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await getMyTasks(req, res);

  expect(res.status).toHaveBeenCalledWith(500);

  expect(res.json).toHaveBeenCalledWith({
    message: "Database error",
  });
});
});

describe("Update Task controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return 404 if task does not exist", async () => {
    mockTask.findById.mockResolvedValue(null);

    const req = {
      params: {
        id: "task123",
      },
      body: {
        title: "Updated Task",
      },
      user: {
        id: "user123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateTask(req, res);

    expect(mockTask.findById).toHaveBeenCalledWith("task123");

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      message: "Task not found",
    });
  });

  it("should update task successfully when user is workspace owner", async () => {
  const task = {
    _id: "task123",
    title: "Old Task",
    description: "Old description",
    status: "pending",
    priority: "low",
    dueDate: "2026-09-20",
    assignedTo: "user456",
    workspace: "workspace123",
    save: jest.fn().mockResolvedValue(true),
  };

  const workspace = {
    _id: "workspace123",
    owner: "user123",
  };

  mockTask.findById.mockResolvedValue(task);
  mockWorkspace.findById.mockResolvedValue(workspace);

  const req = {
    params: {
      id: "task123",
    },
    body: {
      title: "Updated Task",
      description: "Updated description",
      status: "completed",
      priority: "high",
      dueDate: "2026-09-30",
      assignedTo: "user789",
    },
    user: {
      id: "user123",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await updateTask(req, res);

  expect(mockTask.findById).toHaveBeenCalledWith("task123");

  expect(mockWorkspace.findById).toHaveBeenCalledWith("workspace123");

  expect(task.title).toBe("Updated Task");
  expect(task.description).toBe("Updated description");
  expect(task.status).toBe("completed");
  expect(task.priority).toBe("high");
  expect(task.dueDate).toBe("2026-09-30");
  expect(task.assignedTo).toBe("user789");

  expect(task.save).toHaveBeenCalled();

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(task);
});

it("should return 403 if user is not owner or assigned user", async () => {
  const task = {
    _id: "task123",
    title: "Test Task",
    workspace: "workspace123",
    assignedTo: "user456",
    save: jest.fn(),
  };

  const workspace = {
    _id: "workspace123",
    owner: "owner123",
  };

  mockTask.findById.mockResolvedValue(task);
  mockWorkspace.findById.mockResolvedValue(workspace);

  const req = {
    params: {
      id: "task123",
    },
    body: {
      title: "Updated Task",
    },
    user: {
      id: "user789",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await updateTask(req, res);

  expect(res.status).toHaveBeenCalledWith(403);

  expect(res.json).toHaveBeenCalledWith({
    message: "Not allowed to update this task",
  });

  expect(task.save).not.toHaveBeenCalled();
});

it("should allow assigned user to update the task", async () => {
  const task = {
    _id: "task123",
    title: "Old Task",
    description: "Old description",
    status: "pending",
    priority: "low",
    dueDate: "2026-09-20",
    assignedTo: "user123",
    workspace: "workspace123",
    save: jest.fn().mockResolvedValue(true),
  };

  const workspace = {
    _id: "workspace123",
    owner: "owner123",
  };

  mockTask.findById.mockResolvedValue(task);
  mockWorkspace.findById.mockResolvedValue(workspace);

  const req = {
    params: {
      id: "task123",
    },
    body: {
      title: "Updated by Assigned User",
      status: "completed",
    },
    user: {
      id: "user123",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await updateTask(req, res);

  expect(task.title).toBe("Updated by Assigned User");
  expect(task.status).toBe("completed");

  expect(task.save).toHaveBeenCalled();

  expect(res.status).toHaveBeenCalledWith(200);

  expect(res.json).toHaveBeenCalledWith(task);
});
});
