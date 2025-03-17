const pool = require('./database'); // Import the database connection
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class MessageModel {
    // ✅ Save a new message
    static async saveMessage(from, to, message) {
        try {
            const insertQuery = `
                INSERT INTO sms_messages (id, "from", "to", message, status) 
                VALUES ($1, $2, $3, $4, 'received') RETURNING *
            `;
            const result = await pool.query(insertQuery, [uuidv4(), from, to, message]);
            logger.info(`✅ Message stored: From ${from} to ${to}`);
            return result.rows[0];
        } catch (error) {
            logger.error("❌ Database error:", error);
            throw new Error("Failed to save message.");
        }
    }

    // ✅ Fetch messages with optional filters (from, to, status)
    static async fetchMessages({ from, to, status }) {
        try {
            let query = 'SELECT * FROM sms_messages WHERE 1=1';
            const values = [];

            if (from) {
                values.push(from);
                query += ` AND "from" = $${values.length}`;
            }
            if (to) {
                values.push(to);
                query += ` AND "to" = $${values.length}`;
            }
            if (status) {
                values.push(status);
                query += ` AND status = $${values.length}`;
            }

            query += ' ORDER BY received_at DESC LIMIT 10 OFFSET 0';
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            logger.error("❌ Error fetching messages:", error);
            throw new Error("Failed to fetch messages.");
        }
    }

    // ✅ Check for duplicate messages within 2 seconds
    static async isDuplicateMessage(from, to, message) {
        try {
            const checkQuery = `
                SELECT id FROM sms_messages 
                WHERE "from" = $1 AND "to" = $2 AND message = $3 
                AND received_at >= NOW() - INTERVAL '2 seconds'
            `;
            const result = await pool.query(checkQuery, [from, to, message]);
            return result.rows.length > 0;
        } catch (error) {
            logger.error("❌ Error checking for duplicate message:", error);
            throw new Error("Duplicate message check failed.");
        }
    }
}

module.exports = MessageModel;
