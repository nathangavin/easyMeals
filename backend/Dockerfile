# use an official Node.js runtime as a base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build Typescript code
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
