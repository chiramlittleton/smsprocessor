# Use Node.js as base image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies (including express)
RUN npm install --production

# Copy the rest of the backend source code
COPY . .

# Expose backend port
EXPOSE 5050

# Start the server
CMD ["node", "src/server.js"]
