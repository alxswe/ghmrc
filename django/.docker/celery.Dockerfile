# syntax=docker/dockerfile:1

FROM python:3.11

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Set up container user and group
RUN addgroup --system --gid 1001 pygroup
RUN adduser --system --uid 1001 celery

# Copy the content of the build
WORKDIR /home/app
COPY --chown=celery:pygroup . .

# Install dependencies
RUN --mount=type=cache,target=/home/.cache/pip pip install -r requirements.txt

# Expose port
EXPOSE 8001

# # Toggle non-root user
# USER celery