# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the entire backend source code
COPY . .

# Debug: List all files in the container after copying
RUN ls -la /usr/src/app

# Expose backend port
EXPOSE 5050

# Start the server (ensure the correct path)
CMD ["node", "/usr/src/app/server.js"]
