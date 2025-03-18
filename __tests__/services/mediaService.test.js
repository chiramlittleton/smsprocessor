const fs = require("fs");
const path = require("path");
const { saveMedia, getMediaByMessageId } = require("../../src/services/mediaService");

jest.mock("fs"); // ✅ Mock the filesystem

describe("Media Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test: Save a valid image file
  it("should save an image file successfully", async () => {
    const mockFile = {
      originalname: "image.png",
      mimetype: "image/png",
      buffer: Buffer.from("mock image data"),
    };

    fs.existsSync.mockReturnValue(false); // Simulate file does not exist
    fs.writeFileSync.mockImplementation(() => {}); // Mock file writing

    const result = await saveMedia("uuid-1234", mockFile);

    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(result).toHaveProperty("filePath");
  });

  // ✅ Test: Reject non-image files
  it("should throw an error if the file is not an image", async () => {
    const invalidFile = {
      originalname: "document.pdf",
      mimetype: "application/pdf",
      buffer: Buffer.from("mock pdf data"),
    };

    await expect(saveMedia("uuid-1234", invalidFile)).rejects.toThrow("Invalid file type. Only images are allowed.");
  });

  // ✅ Test: Deduplication (Prevent saving duplicate files)
  it("should not save the file if it already exists", async () => {
    fs.existsSync.mockReturnValue(true); // Simulate file already exists

    const mockFile = {
      originalname: "image.png",
      mimetype: "image/png",
      buffer: Buffer.from("mock image data"),
    };

    const result = await saveMedia("uuid-1234", mockFile);

    expect(fs.writeFileSync).not.toHaveBeenCalled(); // ✅ Ensure writeFileSync was NOT called
    expect(result).toHaveProperty("filePath");
  });

  // ✅ Test: Retrieve media by message ID
  it("should return media file paths for a given message ID", async () => {
    fs.readdirSync.mockReturnValue(["uuid-1234_image.png", "uuid-1234_image.jpg"]);

    const result = await getMediaByMessageId("uuid-1234");

    expect(fs.readdirSync).toHaveBeenCalled();
    expect(result.length).toBe(2);
  });

  // ✅ Test: Handle case when no media is found
  it("should throw an error if no media is found for the given message ID", async () => {
    fs.readdirSync.mockReturnValue([]);

    await expect(getMediaByMessageId("uuid-5678")).rejects.toThrow("No media found for this message.");
  });
});
