# Build stage
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files and build React app
COPY . .
RUN npm run build

# Serve frontend using a lightweight web server
FROM node:18 AS serve

WORKDIR /app

# Copy built files from the previous step
COPY --from=build /app/dist /app/dist

# Install a simple HTTP server
RUN npm install -g serve

# Expose frontend port
EXPOSE 3000

# Start the frontend server
CMD ["serve", "-s", "dist", "-l", "3000"]
