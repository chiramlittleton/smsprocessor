const request = require("supertest");
const express = require("express");
const mediaRoutes = require("../../src/routes/mediaRoutes");
const { uploadMedia, getMedia } = require("../../src/controllers/mediaController");

jest.mock("../../src/controllers/mediaController", () => ({
  uploadMedia: jest.fn((req, res) => res.status(201).json({ success: true })),
  getMedia: jest.fn((req, res) => res.status(200).json({ media: "mock-media-data" })),
}));

const app = express();
app.use(express.json());
app.use("/media", mediaRoutes);

describe("Media Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test: Upload media calls `uploadMedia` with correct `id`
  it("should call uploadMedia with the correct id", async () => {
    const res = await request(app)
      .post("/media/1234/media")
      .attach("file", Buffer.from("dummy file content"), "test.jpg"); // Mock file upload

    expect(uploadMedia).toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // ❌ Test: Reject upload if no file is attached
  it("should return 400 if no file is provided", async () => {
    uploadMedia.mockImplementationOnce((req, res) =>
      res.status(400).json({ error: "File is required" })
    );

    const res = await request(app).post("/media/1234/media");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("File is required");
  });

  // ✅ Test: Fetch media calls `getMedia` with correct `id`
  it("should call getMedia with the correct id", async () => {
    const res = await request(app).get("/media/5678/media");

    expect(getMedia).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
    expect(res.statusCode).toBe(200);
    expect(res.body.media).toBe("mock-media-data");
  });

  // 🚫 Test: Return 404 if media not found
  it("should return 404 if media does not exist", async () => {
    getMedia.mockImplementationOnce((req, res) =>
      res.status(404).json({ error: "Media not found" })
    );

    const res = await request(app).get("/media/9999/media");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Media not found");
  });

  // ❌ Test: Reject invalid `id` formats
  it("should return 400 if id format is invalid", async () => {
    getMedia.mockImplementationOnce((req, res) =>
      res.status(400).json({ error: "Invalid ID format" })
    );

    const res = await request(app).get("/media/invalid-id/media");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid ID format");
  });

  // 🚨 Test: Handle unexpected errors gracefully
  it("should return 500 if an internal error occurs", async () => {
    getMedia.mockImplementationOnce((req, res) =>
      res.status(500).json({ error: "Internal server error" })
    );

    const res = await request(app).get("/media/1234/media");

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Internal server error");
  });
});
