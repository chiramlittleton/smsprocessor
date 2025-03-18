# 🚀 SMSProcessor - Quick Review Setup

This guide provides the quickest way to run the SMSProcessor application using Docker Compose for review purposes.

## Steps

1.  **Download `docker-compose.yml`:**

    * Download the `docker-compose.yml` file directly from this link: [https://github.com/chiramlittleton/smsprocessor/blob/main/docker-compose.yml](https://github.com/chiramlittleton/smsprocessor/blob/main/docker-compose.yml)
    * Save it to a directory on your local machine.

2.  **Run Docker Compose:**

    * Open a terminal or command prompt.
    * Navigate to the directory where you saved the `docker-compose.yml` file.
    * Run the command:

        ```bash
        docker-compose up -d
        ```

3.  **Access the Application:**

    * Open a web browser and access the application at:

        * Frontend: `http://localhost:3000`
        * Backend API: `http://localhost:5050/api/...`

4.  **Stop the Application:**

    * When finished, run:

        ```bash
        docker-compose down
        ```

**Note:**

* This assumes you have Docker and Docker Compose installed.
* This setup uses pre-built Docker images from Docker Hub. Ensure you have network access to pull the images.
* If database migrations are needed, please refer to the project's main documentation for those steps.

## Testing with cURL

After starting the application, you can use the following cURL commands to test various functionalities:

### 1. Send a Message:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "from": "+1234567890",
  "to": "+0987654321",
  "message": "Hello from cURL!"
}' http://localhost:5050/api/messages

### 1. Send a Message:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "from": "+1234567890",
  "to": "+0987654321",
  "message": "Hello from cURL!"
}' http://localhost:5050/api/messages

### 1. Send a Message:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "from": "+1234567890",
  "to": "+0987654321",
  "message": "Hello from cURL!"
}' http://localhost:5050/api/messages

### 1. Send a Message:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "from": "+1234567890",
  "to": "+0987654321",
  "message": "Hello from cURL!"
}' http://localhost:5050/api/messages
