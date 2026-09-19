import { jest } from "@jest/globals";

const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const mockGenerateToken = jest.fn();

jest.unstable_mockModule("../models/userModel.js", () => ({
  default: mockUser,
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: mockBcrypt,
}));

jest.unstable_mockModule("../utils/generateToken.js", () => ({
    default: mockGenerateToken,
}));

const { register, login } = await import("../controllers/authController.js");

describe("Register controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
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

it("should login successfully with valid credentials", async () => {
    const user = {
    _id: "123",
    name: "Test User",
    email: "test@example.com",
    password: "hashedPassword",
    _doc: {
      _id: "123",
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
    },
  };

  mockUser.findOne.mockResolvedValue(user);

  mockBcrypt.compare.mockResolvedValue(true);

  mockGenerateToken.mockReturnValue("fake-jwt-token");

  const req = {
    body: {
        email: "test@example.com",
        password: "password123",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await login(req, res);

  expect(mockUser.findOne).toHaveBeenCalledWith({
    email: "test@example.com",
  });

  expect(mockBcrypt.compare).toHaveBeenCalledWith(
    "password123",
    "hashedPassword"
  );

  expect(mockGenerateToken).toHaveBeenCalledWith("123");

  expect(res.status).toHaveBeenCalledWith(200);

  expect(res.json).toHaveBeenCalledWith({
    message: "Login successfull",
    token: "fake-jwt-token",
    user: {
      _id: "123",
      name: "Test User",
      email: "test@example.com",
    },
  });
});

it("should return 400 if user does not exist", async () => {
  mockUser.findOne.mockResolvedValue(null);

  const req = {
    body: {
      email: "unknown@example.com",
      password: "password123",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await login(req, res);

  expect(mockUser.findOne).toHaveBeenCalledWith({
    email: "unknown@example.com",
  });

  expect(res.status).toHaveBeenCalledWith(400);

  expect(res.json).toHaveBeenCalledWith({
    message: "user not found",
  });
});

it("should return 400 if password is incorrect", async () => {
  const user = {
    _id: "123",
    name: "Test User",
    email: "test@example.com",
    password: "hashedPassword",
  };

  mockUser.findOne.mockResolvedValue(user);

  mockBcrypt.compare.mockResolvedValue(false);

  const req = {
    body: {
      email: "test@example.com",
      password: "wrongPassword",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await login(req, res);

  expect(mockUser.findOne).toHaveBeenCalledWith({
    email: "test@example.com",
  });

  expect(mockBcrypt.compare).toHaveBeenCalledWith(
    "wrongPassword",
    "hashedPassword"
  );

  expect(res.status).toHaveBeenCalledWith(400);

  expect(res.json).toHaveBeenCalledWith({
    message: "Invalid credentials",
  });
});
