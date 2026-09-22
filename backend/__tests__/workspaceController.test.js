import { jest } from "@jest/globals";

const mockWorkspace = {
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

const mockUser = {
  findOne: jest.fn(),
};

jest.unstable_mockModule("../models/workspaceModel.js", () => ({
  default: mockWorkspace,
}));

jest.unstable_mockModule("../models/userModel.js", () => ({
  default: mockUser,
}));

jest.unstable_mockModule("mongoose", () => ({
  default: {
    Types: {
      ObjectId: jest.fn(function (id) {
        return id;
     }),
    },
  },
}));

const {
  createWorkspace,
  deleteWorkspace,
  addMember,
  getWorkspaces,
  updateWorkspace,
} = await import("../controllers/workspaceController.js");

describe("Workspace Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // CREATE WORKSPACE
  // ============================================================

  describe("createWorkspace", () => {
    test("should create a workspace successfully", async () => {
      const req = {
        body: {
          name: "Development",
        },
        user: {
          id: "user123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const workspace = {
        _id: "workspace123",
        name: "Development",
        owner: "user123",
        members: [
          {
            user: "user123",
            role: "owner",
          },
        ],
        populate: jest.fn().mockResolvedValue(),
      };

      mockWorkspace.create.mockResolvedValue(workspace);

      await createWorkspace(req, res);

      expect(mockWorkspace.create).toHaveBeenCalledWith({
        name: "Development",
        owner: "user123",
        members: [
          {
            user: "user123",
            role: "owner",
          },
        ],
      });

      expect(workspace.populate).toHaveBeenCalledWith(
        "members.user",
        "name email"
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(workspace);
    });

    test("should return 500 when workspace creation fails", async () => {
      const req = {
        body: {
          name: "Development",
        },
        user: {
          id: "user123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockWorkspace.create.mockRejectedValue(
        new Error("Database error")
      );

      await createWorkspace(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });

  // ============================================================
  // DELETE WORKSPACE
  // ============================================================

  describe("deleteWorkspace", () => {
    test("should delete workspace successfully when user is owner", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        user: {
          id: "user123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const workspace = {
        _id: "workspace123",
        owner: {
          toString: jest.fn().mockReturnValue("user123"),
        },
        deleteOne: jest.fn().mockResolvedValue(),
      };

      mockWorkspace.findById.mockResolvedValue(workspace);

      await deleteWorkspace(req, res);

      expect(mockWorkspace.findById).toHaveBeenCalledWith(
        "workspace123"
      );

      expect(workspace.deleteOne).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Workspace deleted successfully",
      });
    });

    test("should return 404 when workspace does not exist", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        user: {
          id: "user123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockWorkspace.findById.mockResolvedValue(null);

      await deleteWorkspace(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Workspace not found",
      });
    });

    test("should return 403 when user is not the owner", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        user: {
          id: "user456",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const workspace = {
        owner: {
          toString: jest.fn().mockReturnValue("user123"),
        },
      };

      mockWorkspace.findById.mockResolvedValue(workspace);

      await deleteWorkspace(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Only owner can delete workspace",
      });
    });

    test("should return 500 when delete fails", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        user: {
          id: "user123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockWorkspace.findById.mockRejectedValue(
        new Error("Database error")
      );

      await deleteWorkspace(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });

  // ============================================================
  // ADD MEMBER
  // ============================================================

  describe("addMember", () => {
    test("should add a member successfully", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        body: {
          email: "member@example.com",
          role: "member",
        },
        user: {
          id: "owner123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const user = {
        _id: "user456",
        name: "Test Member",
        email: "member@example.com",
      };

      const workspace = {
        owner: {
          toString: jest.fn().mockReturnValue("owner123"),
        },
        members: [],
        save: jest.fn().mockResolvedValue(),
        populate: jest.fn().mockResolvedValue(),
      };

      const findByIdQuery = {
        populate: jest.fn().mockResolvedValue(workspace),
      };

      mockWorkspace.findById.mockReturnValue(findByIdQuery);
      mockUser.findOne.mockResolvedValue(user);

      await addMember(req, res);

      expect(mockWorkspace.findById).toHaveBeenCalledWith(
        "workspace123"
      );

      expect(mockUser.findOne).toHaveBeenCalledWith({
        email: "member@example.com",
      });

      expect(workspace.members).toHaveLength(1);
      expect(workspace.members[0].user).toBe("user456");
      expect(workspace.members[0].role).toBe("member");

      expect(workspace.save).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Member added successfully",
        workspace,
      });
    });

    test("should return 404 when workspace does not exist", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        body: {
          email: "member@example.com",
          role: "member",
        },
        user: {
          id: "owner123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const findByIdQuery = {
        populate: jest.fn().mockResolvedValue(null),
      };

      mockWorkspace.findById.mockReturnValue(findByIdQuery);

      await addMember(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Workspace not found",
      });
    });

    test("should return 403 when requester is not owner", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        body: {
          email: "member@example.com",
          role: "member",
        },
        user: {
          id: "user456",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const workspace = {
        owner: {
          toString: jest.fn().mockReturnValue("owner123"),
        },
        members: [],
      };

      const findByIdQuery = {
        populate: jest.fn().mockResolvedValue(workspace),
      };

      mockWorkspace.findById.mockReturnValue(findByIdQuery);

      await addMember(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Only Owner can add members",
      });
    });

    test("should return 400 when user does not exist", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        body: {
          email: "unknown@example.com",
          role: "member",
        },
        user: {
          id: "owner123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const workspace = {
        owner: {
          toString: jest.fn().mockReturnValue("owner123"),
        },
        members: [],
      };

      const findByIdQuery = {
        populate: jest.fn().mockResolvedValue(workspace),
      };

      mockWorkspace.findById.mockReturnValue(findByIdQuery);
      mockUser.findOne.mockResolvedValue(null);

      await addMember(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });

    test("should return 400 when user is already a member", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        body: {
          email: "member@example.com",
          role: "member",
        },
        user: {
          id: "owner123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const user = {
        _id: "user456",
        email: "member@example.com",
      };

      const workspace = {
        owner: {
          toString: jest.fn().mockReturnValue("owner123"),
        },
        members: [
          {
            user: {
              _id: "user456",
              toString: jest.fn().mockReturnValue("user456"),
            },
          },
        ],
      };

      const findByIdQuery = {
        populate: jest.fn().mockResolvedValue(workspace),
      };

      mockWorkspace.findById.mockReturnValue(findByIdQuery);
      mockUser.findOne.mockResolvedValue(user);

      await addMember(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User already a member",
      });
    });

    test("should return 500 when adding member fails", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        body: {
          email: "member@example.com",
          role: "member",
        },
        user: {
          id: "owner123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockWorkspace.findById.mockImplementation(() => {
        throw new Error("Database error");
      });

      await addMember(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });

  // ============================================================
  // GET WORKSPACES
  // ============================================================

  describe("getWorkspaces", () => {
    test("should return workspaces for the logged-in user", async () => {
      const req = {
        user: {
          id: "user123",
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const workspaces = [
        {
          _id: "workspace1",
          name: "Development",
        },
        {
          _id: "workspace2",
          name: "Testing",
        },
      ];

      const findQuery = {
        populate: jest.fn(),
      };

      findQuery.populate
        .mockReturnValueOnce(findQuery)
        .mockReturnValueOnce(Promise.resolve(workspaces));

      mockWorkspace.find.mockReturnValue(findQuery);

      await getWorkspaces(req, res);

      expect(mockWorkspace.find).toHaveBeenCalledWith({
        $or: [
          { owner: "user123" },
          { "members.user": "user123" },
        ],
      });

      expect(res.json).toHaveBeenCalledWith(workspaces);
    });

    test("should return 500 when fetching workspaces fails", async () => {
      const req = {
        user: {
          id: "user123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockWorkspace.find.mockImplementation(() => {
        throw new Error("Database error");
      });

      await getWorkspaces(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });

  // ============================================================
  // UPDATE WORKSPACE
  // ============================================================

  describe("updateWorkspace", () => {
    test("should update workspace successfully", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        body: {
          name: "Updated Workspace",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const updatedWorkspace = {
        _id: "workspace123",
        name: "Updated Workspace",
      };

      mockWorkspace.findByIdAndUpdate.mockResolvedValue(
        updatedWorkspace
      );

      await updateWorkspace(req, res);

      expect(mockWorkspace.findByIdAndUpdate).toHaveBeenCalledWith(
        "workspace123",
        {
          name: "Updated Workspace",
        },
        {
          new: true,
        }
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Workspace updated successfully",
        workspace: updatedWorkspace,
      });
    });

    test("should return 404 when workspace does not exist", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        body: {
          name: "Updated Workspace",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockWorkspace.findByIdAndUpdate.mockResolvedValue(null);

      await updateWorkspace(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Workspace not found",
      });
    });

    test("should return 500 when update fails", async () => {
      const req = {
        params: {
          workspaceId: "workspace123",
        },
        body: {
          name: "Updated Workspace",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockWorkspace.findByIdAndUpdate.mockRejectedValue(
        new Error("Database error")
      );

      await updateWorkspace(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });
});
