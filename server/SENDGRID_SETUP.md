# SendGrid Email Setup Guide

This guide will help you configure SendGrid for sending OTP verification emails in your Clock-In/Out system.

---

## 📋 Prerequisites

1. **SendGrid Account** (Free tier available)
   - Sign up at: https://sendgrid.com
   - Free tier: 100 emails/day forever

2. **Verified Sender Identity**
   - Single Sender Verification (for testing)
   - Or Domain Authentication (for production)

---

## 🚀 Step-by-Step Setup

### Step 1: Create SendGrid Account

1. Go to https://sendgrid.com
2. Click "Start for Free"
3. Complete signup process
4. Verify your email address

### Step 2: Create API Key

1. Log in to SendGrid Dashboard
2. Navigate to **Settings** → **API Keys**
3. Click **"Create API Key"**
4. Name: `Clock-In-Out Production` (or your preferred name)
5. **Permissions:** Select **"Full Access"** or **"Mail Send"** (restricted)
6. Click **"Create & View"**
7. **⚠️ IMPORTANT:** Copy the API key immediately - you won't be able to see it again!
   - It will look like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Verify Sender Identity

You have two options:

#### Option A: Single Sender Verification (Quick - for testing)

1. Navigate to **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Click **"Create a Sender"**
3. Fill in the form:
   - **From Email Address:** `noreply@yourcompany.com` (or your domain email)
   - **From Sender Name:** `Clock-In/Out System`
   - **Reply To:** (your support email)
   - **Company Address:** Your company address
4. Click **"Create"**
5. Check your email and click the verification link
6. **Note the verified email** - this will be your `SENDGRID_FROM_EMAIL`

#### Option B: Domain Authentication (Recommended for production)

1. Navigate to **Settings** → **Sender Authentication** → **Domain Authentication**
2. Click **"Authenticate Your Domain"**
3. Select your DNS provider
4. Add the provided DNS records to your domain
5. Click **"Verify"**
6. Once verified, you can use any email from your domain

---

## 🔧 Environment Configuration

### Local Development (.env file)

Add these variables to your `server/.env` file:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourcompany.com
```

### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   **Name:** `SENDGRID_API_KEY`  
   **Value:** `SG.your_api_key_here`  
   **Environment:** Production, Preview, Development

   **Name:** `SENDGRID_FROM_EMAIL`  
   **Value:** `noreply@yourcompany.com`  
   **Environment:** Production, Preview, Development

4. Click **"Save"**
5. **Redeploy** your application for changes to take effect

---

## 🧪 Testing the Setup

### Test Email Sending

1. **Update a user with email:**
   ```bash
   cd server
   npx prisma db execute --stdin <<< "UPDATE \"user\" SET email = 'your-test-email@example.com' WHERE uid = 'user005';"
   ```

2. **Request OTP via API:**
   ```bash
   curl -X POST http://localhost:3000/otp/request \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "user005",
       "type": "in",
       "method": "email"
     }'
   ```

3. **Check your email inbox** - you should receive the OTP code

### Check Server Logs

If SendGrid is configured correctly, you'll see:
```
✅ SendGrid initialized successfully
📧 SendGrid configured with from email: noreply@yourcompany.com
✅ OTP email sent successfully to user@example.com
```

If not configured, you'll see:
```
⚠️ SENDGRID_API_KEY not set - email sending disabled
📧 Emails will be logged to console only
```

---

## 📧 Email Template

The system sends beautifully formatted HTML emails with:
- **Subject:** "Clock-In Verification Code" or "Clock-Out Verification Code"
- **Large, easy-to-read OTP code** (6 digits)
- **Expiration time:** 10 minutes
- **Professional styling** with your branding

---

## 🔒 Security Best Practices

1. **Never commit API keys to Git**
   - Keep `.env` in `.gitignore`
   - Use environment variables in production

2. **Use Restricted API Keys**
   - Create API keys with only "Mail Send" permission
   - Don't use full-access keys unless necessary

3. **Rotate API Keys Regularly**
   - Update keys every 90 days
   - Revoke old keys after rotation

4. **Monitor SendGrid Activity**
   - Check SendGrid dashboard for email delivery
   - Set up alerts for failed deliveries

---

## 📊 SendGrid Dashboard

### Monitor Email Activity

1. Go to **Activity** → **Email Activity**
2. View:
   - **Delivered:** Successfully sent emails
   - **Opened:** Recipients who opened emails
   - **Bounced:** Failed deliveries
   - **Spam Reports:** Marked as spam

### Check Stats

- **Stats** → **Overview**
- View daily/monthly email volume
- Monitor API usage

---

## 🐛 Troubleshooting

### Emails Not Sending

**Check:**
1. ✅ API key is correct
2. ✅ Sender email is verified
3. ✅ Environment variables are set
4. ✅ Server logs for error messages

**Common Issues:**
- **"Unauthorized"** → API key is incorrect
- **"Invalid Email"** → Sender email not verified
- **"Rate Limit"** → Too many requests (free tier: 100/day)

### Email Goes to Spam

**Solutions:**
1. Use Domain Authentication (not Single Sender)
2. Set up SPF/DKIM records properly
3. Warm up your domain gradually
4. Use a professional "From" name

### Rate Limits

**Free Tier Limits:**
- 100 emails/day
- 40,000 emails for first 30 days (trial)

**Upgrade:**
- If you need more, upgrade to Essentials plan ($19.95/month for 50,000 emails)

---

## 💰 Pricing

### Free Tier (Recommended to start)
- ✅ 100 emails/day forever
- ✅ Perfect for testing and small deployments
- ✅ Full API access

### Essentials Plan
- $19.95/month
- 50,000 emails/month
- Best for production use

### Pro Plan
- $89.95/month
- 100,000 emails/month
- Advanced features

---

## 🔄 Alternative Email Services

If SendGrid doesn't meet your needs, you can integrate:

- **AWS SES** (cheaper, but requires AWS setup)
- **Mailgun** (similar to SendGrid)
- **Postmark** (transactional emails)
- **Resend** (developer-friendly)

To switch, update `NotificationService` with the new service's SDK.

---

## ✅ Verification Checklist

Before going to production:

- [ ] SendGrid account created
- [ ] API key generated and stored securely
- [ ] Sender email verified (Single Sender or Domain)
- [ ] Environment variables set in Vercel
- [ ] Test email received successfully
- [ ] Server logs show SendGrid initialized
- [ ] OTP emails are being delivered
- [ ] Email template looks good

---

## 📚 Additional Resources

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid Node.js SDK](https://github.com/sendgrid/sendgrid-nodejs)
- [Email Best Practices](https://docs.sendgrid.com/for-developers/sending-email/best-practices)
- [API Key Management](https://docs.sendgrid.com/ui/account-and-settings/api-keys)

---

## 🎉 You're All Set!

Your Clock-In/Out system is now ready to send professional OTP emails via SendGrid!

**Next Steps:**
1. Test with a real email address
2. Monitor email delivery in SendGrid dashboard
3. Set up alerts for failed deliveries
4. Consider implementing SMS (Twilio) for complete coverage

---

**Need Help?** Check the troubleshooting section or review SendGrid's documentation.

