#!/bin/bash

# Script to generate SSL certificates for local development
# This is required for Kontent.ai custom apps as they must run over HTTPS

echo "🔐 Generating SSL certificates for local development..."

APP_DIR="/Users/fpayan/HUGE/KOERBER/tutorials/kontent.ai/kai-custom/custom-apps/content-type-migrator"

cd "$APP_DIR" || exit 1

# Check if certificates already exist
if [ -f "localhost.pem" ] && [ -f "localhost-key.pem" ]; then
    echo "✅ SSL certificates already exist"
    exit 0
fi

# Try to use mkcert if available (preferred method)
if command -v mkcert &> /dev/null; then
    echo "📋 Using mkcert to generate certificates..."
    mkcert localhost 127.0.0.1 ::1
    echo "✅ SSL certificates generated using mkcert"
else
    echo "📋 mkcert not found, using OpenSSL..."
    # Generate using OpenSSL as fallback
    openssl req -x509 -newkey rsa:2048 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"
    echo "✅ SSL certificates generated using OpenSSL"
    echo "⚠️  Note: You may need to accept the self-signed certificate in your browser"
fi

echo "🚀 Certificates are ready for local development!"
echo "   - localhost.pem (certificate)"
echo "   - localhost-key.pem (private key)"
echo ""
echo "💡 To install mkcert for better certificate management:"
echo "   macOS: brew install mkcert && mkcert -install"
echo "   Linux: See https://github.com/FiloSottile/mkcert#installation"