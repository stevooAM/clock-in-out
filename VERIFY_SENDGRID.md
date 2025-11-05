# Verify SendGrid Integration ✅

## Quick Verification Steps

### 1. Check Server Logs

When the server starts, you should see:

**✅ If SendGrid is configured:**
```
✅ SendGrid initialized successfully
📧 SendGrid configured with from email: noreply@esphotel.com
```

**⚠️ If not configured:**
```
⚠️ SENDGRID_API_KEY not set - email sending disabled
📧 Emails will be logged to console only
```

### 2. Test Email Sending

**Option A: Use the test script**
```bash
cd server
./test-sendgrid.sh
```

**Option B: Manual test**
```bash
# Ensure user has email
npx prisma db execute --stdin <<< \
  "UPDATE \"user\" SET email = 'your-test-email@example.com' WHERE uid = 'user005';"

# Request OTP
curl -X POST http://localhost:3000/otp/request \
  -H "Content-Type: application/json" \
  -d '{"userId":"user005","type":"in","method":"email"}'
```

### 3. Check Your Email

You should receive an email with:
- **Subject:** "Clock-In Verification Code"
- **From:** noreply@esphotel.com
- **Content:** 6-digit OTP code
- **Valid for:** 10 minutes

### 4. Verify OTP Works

```bash
# Use the code from the email
curl -X POST http://localhost:3000/in/otp \
  -H "Content-Type: application/json" \
  -d '{"code":"123456","reader":"web"}'
```

Expected response:
```json
{
  "status": 2,
  "msg": "Entrada - Charlie Brown"
}
```

---

## 🔍 Troubleshooting

### Email Not Received?

1. **Check SendGrid Dashboard:**
   - Go to https://app.sendgrid.com
   - Navigate to **Activity** → **Email Activity**
   - Look for your email delivery status

2. **Check Spam Folder:**
   - Emails might go to spam initially
   - Mark as "Not Spam" if found

3. **Verify Sender Email:**
   - Go to **Settings** → **Sender Authentication**
   - Ensure sender email is verified

4. **Check Server Logs:**
   - Look for error messages
   - Check if SendGrid API key is valid

### Common Issues

**"Unauthorized" Error:**
- API key is incorrect
- Regenerate API key in SendGrid dashboard

**"Invalid Email" Error:**
- Sender email not verified
- Verify sender in SendGrid dashboard

**"Rate Limit" Error:**
- Free tier: 100 emails/day limit
- Wait or upgrade plan

---

## ✅ Success Indicators

- ✅ Server logs show "SendGrid initialized successfully"
- ✅ Email received in inbox
- ✅ OTP code works for clock-in/out
- ✅ SendGrid dashboard shows "Delivered" status

---

## 📊 Monitor in SendGrid Dashboard

1. **Email Activity:**
   - View all sent emails
   - Check delivery status
   - See open rates

2. **Stats:**
   - Daily email volume
   - Delivery rates
   - Bounce rates

---

## 🎉 You're All Set!

If you see the email in your inbox and the OTP works, SendGrid is fully integrated and working! 🚀

