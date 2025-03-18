# SMSProcessor Setup

This guide provides the quickest way to run the SMSProcessor application using Docker Compose for review purposes.

## Steps

1. **Clone the Repository**

  ```bash
  git clone https://github.com/chiramlittleton/smsprocessor.git
  cd smsprocessor
  ```

1.  **Run Docker Compose:**

    * Open a terminal or command prompt.
    * Navigate to the directory where you saved the `docker-compose.yml` file.
    * Run the command:

        ```bash
        docker-compose up -d
        ```

1.  **Access the Application:**

    * Open a web browser and access the application at:

        * Frontend: `http://localhost:3000`
        * Backend API: `http://localhost:5050/api/...`

1.  **Stop the Application:**

    * When finished, run:

        ```bash
        docker-compose down
        ```

**Note:**

* This assumes you have Docker and Docker Compose installed.
* This setup uses pre-built Docker images from Docker Hub. Ensure you have network access to pull the images.

## Testing with cURL

After starting the application, you can use the following cURL commands to test various functionalities:

### 1. Send a Message:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "from": "+1234567890",
  "to": "+0987654321",
  "message": "Hello from cURL!"
}' http://localhost:5050/api/messages
```
### 2. Send a Message with Media Attachment:

```bash
curl -X POST -F "from=+1234567890" -F "to=+0987654321" -F "message=Image attached" -F "file=@/path/to/your/image.jpg" http://localhost:5050/api/messages
```
Replace /path/to/your/image.jpg with the actual path to an image file.
### 3. Send Multiple Messages Within a Time Limit (Rate Limiting Test):

```bash
for i in {1..6}; do
  curl -X POST -H "Content-Type: application/json" -d '{
    "from": "+1234567890",
    "to": "+0987654321",
    "message": "Message $i"
  }' http://localhost:5050/api/messages
  sleep 12; 
done
```
The 6th message should be rate-limited.
### 4. Query Messages:

```bash
curl "http://localhost:5050/api/messages?from=+1234567890&to=+0987654321&limit=2&offset=0"
```
Adjust from, to, limit, and offset as needed.

### 5. Query Media for a Message:
1. First, send a message with media (as in step 2).
2. Then, use the messageId from the response to query the media:

```bash
curl "http://localhost:5050/api/messages/{messageId}/media"
```
### 6. Input Validation (Invalid Phone Numbers):

```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "from": "1234567890", # Invalid format
    "to": "+0987654321",
    "message": "Invalid phone number test"
}' http://localhost:5050/api/messages
```
### 7. Input Validation (Message Length):
```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "from": "+1234567890",
    "to": "+0987654321",
    "message": "This is a very long message that exceeds 160 characters. This is a very long message that exceeds 160 characters. This is a very long message that exceeds 160 characters. This is a very long message that exceeds 160 characters."
}' http://localhost:5050/api/messages
```
### 8. Deduplication Test:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "from": "+1234567890",
    "to": "+0987654321",
    "message": "Duplicate test message"
}' http://localhost:5050/api/messages
curl -X POST -H "Content-Type: application/json" -d '{
    "from": "+1234567890",
    "to": "+0987654321",
    "message": "Duplicate test message"
}' http://localhost:5050/api/messages
```
The second message should be rejected.
### 9. Query Endpoint (Various Filters):

```bash
curl "http://localhost:5050/api/messages?from=+1234567890"
curl "http://localhost:5050/api/messages?to=+0987654321"
curl "http://localhost:5050/api/messages?status=received"
curl "http://localhost:5050/api/messages?limit=5&offset=10"
curl "http://localhost:5050/api/messages" # No filters
```
### 10. Media Attachment (Invalid File Type):
```bash
curl -X POST -F "from=+1234567890" -F "to=+0987654321" -F "message=Invalid file type" -F "file=@/path/to/your/textfile.txt" http://localhost:5050/api/messages
```
Replace /path/to/your/textfile.txt with an actual text file.
### 11.Input Validation (Missing Required Fields):

```bash
curl -X POST -H "Content-Type: application/json" -d '{}' http://localhost:5050/api/messages
```
