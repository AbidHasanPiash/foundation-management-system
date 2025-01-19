# Use the Node.js 23 base image
FROM node:23-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the application's port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
