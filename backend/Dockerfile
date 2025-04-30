# FROM python:3.13-slim

# COPY . /app
# WORKDIR /app
# RUN pip install --no-cache-dir -r req.txt
# EXPOSE 8000
# RUN chmod +x docker-entrypoint.sh
# ENTRYPOINT [ "./docker-entrypoint.sh" ]

# FROM python:3.13-slim

# WORKDIR /app

# COPY req.txt .
# RUN pip install --no-cache-dir -r req.txt

# COPY docker-entrypoint.sh /app/docker-entrypoint.sh
# RUN chmod +x /app/docker-entrypoint.sh

# COPY . .

# EXPOSE 8000
# # ENTRYPOINT ["/app/docker-entrypoint.sh"]
# ENTRYPOINT ["sh", "-c", "./docker-entrypoint.sh"]



FROM python:3.13-slim

WORKDIR /application

# Install dependencies first for better caching
COPY req.txt .
RUN pip install --no-cache-dir -r req.txt

# Copy all files at once
COPY . .


RUN apt-get update && apt-get install -y dos2unix && \
    dos2unix docker-entrypoint.sh && \
    chmod +x docker-entrypoint.sh


EXPOSE 8000
CMD ["./docker-entrypoint.sh"]