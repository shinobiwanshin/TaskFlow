# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install root dependencies
RUN npm install

# Build the frontend and install backend dependencies
# This script is defined in the root package.json
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Define environment variable for production
ENV NODE_ENV=production

# Run the app when the container launches
CMD ["npm", "start"]
