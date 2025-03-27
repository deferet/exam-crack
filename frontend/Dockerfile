# Use official Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to optimize caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose the port your Vite app runs on (usually 5173)
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]
