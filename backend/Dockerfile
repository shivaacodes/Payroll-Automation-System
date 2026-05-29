# Stage 1: Build
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install necessary build tools and CGO requirements if needed
RUN apk add --no-cache gcc musl-dev

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api/main.go

# Stage 2: Run
FROM alpine:latest

WORKDIR /app

# Install CA certificates and tzdata for secure HTTPS and timezone handling
RUN apk add --no-cache ca-certificates tzdata

# Copy the compiled binary from the builder stage
COPY --from=builder /app/main .

# Copy fonts if needed for PDF generation
# If fonts are embedded via //go:embed, this isn't strictly necessary, 
# but we'll copy the internal/pdf directory just in case it reads dynamically.
COPY --from=builder /app/internal/pdf/fonts ./internal/pdf/fonts

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./main"]
