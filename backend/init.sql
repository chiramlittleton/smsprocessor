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
    message_id UUID REFERENCES sms_messages(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(file_path) -- Prevent duplicate uploads
);
