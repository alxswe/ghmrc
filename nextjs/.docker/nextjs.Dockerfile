# syntax=docker/dockerfile:1

# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Set up some environment variables
ENV NEXT_TELEMETRY_DISABLED=1

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV SERVER_URL=http://localhost:7080
ENV SOCKET_URL=ws://localhost:8000
ENV NEXTAUTH_URL=http://localhost:7080

# Set the working directory in the container
WORKDIR /home/app

# Copy package.json and yarn.lock to the working directory
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm config set registry https://registry.npmjs.org/
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that the Next.js application will run on
EXPOSE 3000

# Specify the command to run your application
CMD ["npm", "start"]
