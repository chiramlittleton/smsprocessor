# 📡 SMSProcessor

A **scalable SMS processing and querying backend** using **Node.js** and **PostgreSQL**. This service allows users to send, store, and retrieve SMS messages, ensuring **rate-limiting**, **deduplication**, and **media attachments**.

---

## 🚀 Features
- 📩 **REST API** for sending and retrieving SMS messages
- 🔒 **Rate-limiting** (max 5 messages per minute per sender)
- 🚫 **Deduplication** (prevents duplicate messages within 2 seconds)
- 📂 **Media attachment support** (image uploads)
- 📊 **Pagination** for querying messages
- 🐳 **Dockerized Deployment**

---

## 🛠️ Installation (Using Docker)

### **1️⃣ Pull the Docker Image**
```bash
docker pull chiramlittleton/smsprocessor:latest
```

### **2️⃣ Start a PostgreSQL Container**
Ensure PostgreSQL is running before starting the application.
```bash
docker run --name smsprocessor-db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=smsprocessor -p 5432:5432 -d postgres
```

### **3️⃣ Run Database Migrations**
Run migrations inside the container (if applicable):
```bash
docker run --rm --network host chiramlittleton/smsprocessor:latest npm run migrate
```

### **4️⃣ Start the SMSProcessor Container**
```bash
docker run --name smsprocessor-api --network host -e DATABASE_URL="postgres://user:password@localhost:5432/smsprocessor" -p 3000:3000 -d chiramlittleton/smsprocessor:latest
```

### **5️⃣ Check If the Service is Running**
```bash
curl http://localhost:3000/health
```

---

## 🏗️ Architecture
```mermaid
graph TD;
    User-->API[SMSProcessor API];
    API-->DB[PostgreSQL Database];
    API-->Storage[Local Media Storage];
    API-->RateLimiter[Rate Limiter];
    API-->Deduplication[Duplicate Check];
    API-->Validation[Input Validation];
```

---

## 📡 API Endpoints

### **1️⃣ Send SMS**
#### **POST** `/api/messages`
```json
{
  "from": "+1234567890",
  "to": "+0987654321",
  "message": "Hello, world!"
}
```
📌 **Validation**
- Phone numbers must follow **E.164 format** (`+<country_code><number>`)
- Messages **cannot exceed 160 characters**
- **Rate-limiting** applies (5 messages per minute per sender)

---

### **2️⃣ Query Messages**
#### **GET** `/api/messages?from=+1234567890&to=+0987654321`
📌 **Query Parameters**
- `from` → Filter by sender
- `to` → Filter by recipient
- `status` → Filter by message status
- `limit` → Limit number of results per page (default: 10)
- `offset` → Offset for pagination

📌 **Example Response**
```json
[
  {
    "id": "uuid-1234",
    "from": "+1234567890",
    "to": "+0987654321",
    "message": "Hello, world!",
    "status": "received",
    "received_at": "2025-03-17T10:00:00.000Z"
  }
]
```

---

### **3️⃣ Upload Media Attachment**
#### **POST** `/api/messages/:id/media`
📌 **Supported File Types**: `.png, .jpg, .jpeg`
```bash
curl -X POST -F "file=@image.png" http://localhost:3000/api/messages/uuid-1234/media
```

---

## 🛠️ Running Tests
Run the unit tests (mocks database calls):
```bash
docker run --rm chiramlittleton/smsprocessor:latest npm test
```

---

## 🛠️ Stopping & Removing Containers
Stop the running containers:
```bash
docker stop smsprocessor-api smsprocessor-db
```
Remove containers:
```bash
docker rm smsprocessor-api smsprocessor-db
```

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 📬 Contact
For any issues or questions, open an issue in the repository:  
[GitHub Issues](https://github.com/chiramlittleton/smsprocessor/issues)

