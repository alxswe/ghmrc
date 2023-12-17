# syntax=docker/dockerfile:1

# Set up base image
FROM python:3.11

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV DEBUG=0

# Copy the content of the build
WORKDIR /home/app
COPY . .

# Install dependencies
RUN --mount=type=cache,target=/home/.cache/pip pip install -r requirements.txt

# Expose port
EXPOSE 8000

# Set up entrypoint
ENTRYPOINT [ "./entrypoint.sh" ]
