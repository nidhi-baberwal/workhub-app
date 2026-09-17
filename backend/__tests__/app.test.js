import request from "supertest";
import app from "../app.js";

describe("GET /", () => {
    it("should return API running message", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("TaskFlow API is running");
    });
});

describe("Unknown route", () => {
    it("should return 404 for an unknown route", async () => {
        const response = await request(app).get("/api/unknown");

        expect(response.statusCode).toBe(404);
    });
});

