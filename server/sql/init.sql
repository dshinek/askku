CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    user_pw VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 6)
);

CREATE TABLE docs (
    doc_id SERIAL PRIMARY KEY,
    doc_name VARCHAR(255) NOT NULL,
    doc_content TEXT NOT NULL,
    doc_thumbnail TEXT  -- URL or base64 or path
);

CREATE TABLE chats (
    chat_id SERIAL PRIMARY KEY,
    chat_summary TEXT,
    user_id INTEGER NOT NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    chat_id INTEGER NOT NULL,
    source VARCHAR(10) NOT NULL CHECK (source IN ('AI', 'Human')),
    content TEXT NOT NULL,
    ref_doc_id INTEGER,
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE,
    FOREIGN KEY (ref_doc_id) REFERENCES docs(doc_id) ON DELETE SET NULL
);
