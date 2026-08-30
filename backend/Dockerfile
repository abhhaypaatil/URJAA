FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download || true
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /server cmd/api/main.go

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /server /app/server
COPY migrations /app/migrations
COPY seeds /app/seeds
EXPOSE 8080
CMD ["/app/server"]
