

# Use the Node.js 18 Alpine image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install GCC (for C/C++), Python3, and Java (OpenJDK 17)
RUN apk update && apk add --no-cache \
    g++ \
    python3 \
    py3-pip \
    bash \
    openjdk17

# Set environment variables for Java (OpenJDK)
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Install dependencies for Node.js
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 8080

# Specify the command to run when the container starts
CMD ["node", "index.js"]

