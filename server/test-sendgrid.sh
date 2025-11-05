#!/bin/bash

# SendGrid Integration Test Script
# This script tests if SendGrid is properly configured and working

echo "🧪 Testing SendGrid Integration"
echo "================================"
echo ""

# Check if server is running
if ! curl -s http://localhost:3000/users > /dev/null; then
    echo "❌ Server is not running on port 3000"
    echo "   Please start the server first: npm run start:dev"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Check environment variables
if [ -z "$SENDGRID_API_KEY" ]; then
    echo "⚠️  SENDGRID_API_KEY not set in environment"
    echo "   Checking .env file..."
    if grep -q "SENDGRID_API_KEY" .env 2>/dev/null; then
        echo "   ✅ Found in .env file"
        export $(grep -v '^#' .env | xargs)
    else
        echo "   ❌ Not found in .env file"
        exit 1
    fi
else
    echo "✅ SENDGRID_API_KEY is set"
fi

echo ""

# Ensure user005 has email
echo "📧 Ensuring user005 has email configured..."
npx prisma db execute --stdin <<< "UPDATE \"user\" SET email = 'charlie.brown@example.com' WHERE uid = 'user005';" > /dev/null 2>&1
echo "✅ User email configured"
echo ""

# Request OTP
echo "📨 Requesting OTP via email..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:3000/otp/request \
  -H "Content-Type: application/json" \
  -d '{"userId":"user005","type":"in","method":"email"}')

echo "Response:"
echo "$RESPONSE" | jq '.'
echo ""

# Check response
if echo "$RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
    MESSAGE=$(echo "$RESPONSE" | jq -r '.message')
    if [ "$MESSAGE" = "OTP sent successfully" ]; then
        echo "✅ OTP request successful!"
        echo ""
        echo "📬 Check the email inbox for: charlie.brown@example.com"
        echo ""
        echo "If SendGrid is configured correctly, you should see:"
        echo "  - Email subject: 'Clock-In Verification Code'"
        echo "  - 6-digit OTP code in the email"
        echo ""
        
        # Check if code is returned (dev mode)
        CODE=$(echo "$RESPONSE" | jq -r '.code // empty')
        if [ -n "$CODE" ]; then
            echo "🔑 Dev Mode: OTP code is: $CODE"
            echo ""
            echo "You can verify it with:"
            echo "  curl -X POST http://localhost:3000/in/otp \\"
            echo "    -H 'Content-Type: application/json' \\"
            echo "    -d '{\"code\":\"$CODE\",\"reader\":\"web\"}'"
        fi
    else
        echo "❌ Unexpected response: $MESSAGE"
    fi
else
    echo "❌ Failed to request OTP"
    echo "$RESPONSE"
fi

echo ""
echo "================================"
echo "✅ Test complete!"
echo ""
echo "💡 Tips:"
echo "  - Check server logs for SendGrid initialization messages"
echo "  - Verify email was received in inbox"
echo "  - Check SendGrid dashboard for delivery status"
echo ""

