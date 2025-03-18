-- Create sms_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS sms_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "from" VARCHAR(15) NOT NULL CHECK ("from" ~ '^\+\d{10,15}$'),
    "to" VARCHAR(15) NOT NULL CHECK ("to" ~ '^\+\d{10,15}$'),
    message TEXT CHECK (LENGTH(message) <= 160) NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('received', 'stored', 'processed'))
);

-- Create media_attachments table if it doesn't exist
CREATE TABLE IF NOT EXISTS media_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES sms_messages(id) ON DELETE CASCADE, -- ✅ Ensure media is always linked to a message
    file_path TEXT NOT NULL,
    file_type VARCHAR(50) CHECK (file_type IN ('image/jpeg', 'image/png', 'image/gif')), -- ✅ Track file type (images only)
    file_size INTEGER NOT NULL CHECK (file_size > 0), -- ✅ Track file size
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, file_path) -- ✅ Ensure no duplicate files for the same message
);
