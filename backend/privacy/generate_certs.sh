#!/bin/bash
# Generate self-signed certificates for FedMed gRPC TLS

CERTS_DIR="$(dirname "$0")/.certs"
mkdir -p "$CERTS_DIR"

echo "Generating Root CA..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$CERTS_DIR/ca.key" -out "$CERTS_DIR/ca.crt" \
    -subj "/C=US/ST=State/L=City/O=FedMed/CN=FedMedRootCA"

echo "Generating Server Key and CSR..."
openssl req -nodes -newkey rsa:2048 \
    -keyout "$CERTS_DIR/server.key" -out "$CERTS_DIR/server.csr" \
    -subj "/C=US/ST=State/L=City/O=FedMed/CN=127.0.0.1"

echo "Signing Server Certificate with Root CA..."
openssl x509 -req -days 365 -in "$CERTS_DIR/server.csr" \
    -CA "$CERTS_DIR/ca.crt" -CAkey "$CERTS_DIR/ca.key" -CAcreateserial \
    -out "$CERTS_DIR/server.pem" \
    -extfile <(printf "subjectAltName=IP:127.0.0.1,DNS:localhost")

echo "Certificates generated in $CERTS_DIR"
ls -la "$CERTS_DIR"
