# SendGrid Quick Start

## ⚡ Quick Setup (5 minutes)

### 1. Get SendGrid API Key

1. Sign up: https://sendgrid.com (free tier: 100 emails/day)
2. Go to **Settings** → **API Keys** → **Create API Key**
3. Copy the key (starts with `SG.`)

### 2. Verify Sender Email

1. Go to **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Create a sender with your email
3. Verify via email link

### 3. Set Environment Variables

**Local (.env):**
```env
SENDGRID_API_KEY=SG.your_key_here
SENDGRID_FROM_EMAIL=noreply@yourcompany.com
```

**Vercel:**
- Settings → Environment Variables
- Add both variables
- Redeploy

### 4. Test

```bash
# Update user with email
npx prisma db execute --stdin <<< "UPDATE \"user\" SET email = 'your@email.com' WHERE uid = 'user005';"

# Request OTP
curl -X POST http://localhost:3000/otp/request \
  -H "Content-Type: application/json" \
  -d '{"userId":"user005","type":"in","method":"email"}'

# Check your email!
```

---

## ✅ Verification

**Server logs should show:**
```
✅ SendGrid initialized successfully
📧 SendGrid configured with from email: noreply@yourcompany.com
✅ OTP email sent successfully to user@example.com
```

**If not configured:**
```
⚠️ SENDGRID_API_KEY not set - email sending disabled
```

---

## 📚 Full Documentation

See `server/SENDGRID_SETUP.md` for complete setup guide.

---

## 🎯 That's It!

Your system will now send real OTP emails via SendGrid!

