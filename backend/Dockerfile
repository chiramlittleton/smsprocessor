# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install ALL dependencies (including dev dependencies for tests)
COPY package.json package-lock.json ./
RUN npm ci # ✅ Installs all dependencies, including Jest for testing

# Copy the entire backend source code
COPY . .

# Debug: List all files in the container after copying
RUN ls -la /usr/src/app

# Run tests inside the container
RUN npm test # ✅ Run tests before the final build

# Remove dev dependencies after tests (keep only production dependencies)
RUN npm prune --production

# Expose backend port
EXPOSE 5050

# Start the server
CMD ["node", "/usr/src/app/server.js"]
