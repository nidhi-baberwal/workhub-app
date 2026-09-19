import { jest } from "@jest/globals";

const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockBcrypt = {
  hash: jest.fn(),
};

jest.unstable_mockModule("../models/userModel.js", () => ({
  default: mockUser,
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: mockBcrypt,
}));

const { register } = await import("../controllers/authController.js");

describe("Register controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if user already exists", async () => {
    mockUser.findOne.mockResolvedValue({
      email: "test@example.com",
    });

    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(mockUser.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "User already exists",
    });
  });

  it("should register a new user successfully", async () => {
    mockUser.findOne.mockResolvedValue(null);

    mockBcrypt.hash.mockResolvedValue("hashedPassword");

    const createdUser = {
      _id: "123",
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
    };

    mockUser.create.mockResolvedValue(createdUser);

    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(mockUser.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });

    expect(mockBcrypt.hash).toHaveBeenCalledWith(
      "password123",
      10
    );

    expect(mockUser.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
    });

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(createdUser);
  });
});