const MessageModel = require('../../src/models/messageModel');
const { saveMessage } = require('../../src/services/messageService');

// Mock MessageModel methods
jest.mock('../../src/models/messageModel', () => ({
    isDuplicateMessage: jest.fn(),
    saveMessage: jest.fn()
}));

describe('Message Service', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    it('should save a message when it is not a duplicate', async () => {
        // ✅ Ensure `isDuplicateMessage` resolves to `false` (not a duplicate)
        MessageModel.isDuplicateMessage.mockResolvedValue(false);

        // ✅ Mock `saveMessage` to return a fake saved message
        const mockMessage = {
            id: 'uuid-1234',
            from: '+1234567890',
            to: '+0987654321',
            message: 'Hello, world!',
            status: 'received'
        };
        MessageModel.saveMessage.mockResolvedValue(mockMessage);

        // ✅ Call the service function
        const result = await saveMessage('+1234567890', '+0987654321', 'Hello, world!');

        // ✅ Assertions
        expect(MessageModel.isDuplicateMessage).toHaveBeenCalledWith('+1234567890', '+0987654321', 'Hello, world!');
        expect(MessageModel.saveMessage).toHaveBeenCalledWith('+1234567890', '+0987654321', 'Hello, world!');
        expect(result).toEqual(mockMessage);
    });

    it('should throw an error if the message is a duplicate', async () => {
        // ✅ Ensure `isDuplicateMessage` resolves to `true`
        MessageModel.isDuplicateMessage.mockResolvedValue(true);

        // ✅ Expect `saveMessage` to throw an error
        await expect(saveMessage('+1234567890', '+0987654321', 'Duplicate test'))
            .rejects
            .toThrow('Duplicate message detected.');

        expect(MessageModel.isDuplicateMessage).toHaveBeenCalledWith('+1234567890', '+0987654321', 'Duplicate test');
        expect(MessageModel.saveMessage).not.toHaveBeenCalled(); // Ensure it didn't try to save the message
    });
});
