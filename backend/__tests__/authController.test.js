import { jest } from "@jest/globals";

const mockUser = {
findOne: jest.fn(),
create: jest.fn(),
};

jest.unstable_mockModule("../models/userModel.js", () => ({
default: mockUser,
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


});
