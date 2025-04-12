FROM node:alpine

# Install serve
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built files
COPY dist/ .

# Expose port
EXPOSE 3000

# Start serve
CMD ["serve", "-s", ".", "-l", "3000"]