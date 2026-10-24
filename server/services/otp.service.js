import bcryptPkg from 'bcryptjs';
const { hash, compare } = bcryptPkg;

export const HARDCODED_ADMIN_PHONE = process.env.ADMIN_PHONE || '+91 98117 98761';

/**
 * Mask a phone number for UI display (e.g., "+91 98117 98761" -> "+91 98117 •••61")
 */
export function maskPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return '+91 98117 •••61';
  const clean = phone.trim();
  if (clean.length < 6) return clean;
  const start = clean.slice(0, Math.min(8, clean.length - 4));
  const end = clean.slice(-2);
  return `${start} •••${end}`;
}

/**
 * Clean phone to pure digits for SMS APIs
 */
export function cleanDigits(phone) {
  return (phone || '').replace(/\D+/g, '');
}

/**
 * Generate a random 6-digit numerical OTP code
 */
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Dispatch OTP via SMS or mock console in development
 */
export async function dispatchOtp(phone, otp) {
  const targetPhone = phone || HARDCODED_ADMIN_PHONE;
  const masked = maskPhoneNumber(targetPhone);
  const smsBody = `Saraswati Motors Security: Your verification code for Admin password reset is ${otp}. Valid for 10 minutes. Do not share with anyone.`;

  console.log(`\n============================================================`);
  console.log(`[OTP DISPATCH] 📱 Saraswati Motors Admin Authentication`);
  console.log(`[RECIPIENT]    : ${targetPhone} (${masked})`);
  console.log(`[OTP CODE]     : >>> ${otp} <<<`);
  console.log(`[EXPIRES IN]   : 10 minutes`);
  console.log(`[TIMESTAMP]    : ${new Date().toISOString()}`);
  console.log(`============================================================\n`);

  // Optional: Fast2SMS API integration for Indian numbers (+91)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const numbers = cleanDigits(targetPhone).slice(-10);
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=otp&variables_values=${otp}&numbers=${numbers}`;
      const res = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
      const data = await res.json().catch(() => ({}));
      console.log('[Fast2SMS Status]', data);
    } catch (apiErr) {
      console.warn('[Fast2SMS Warning] Could not dispatch external SMS:', apiErr.message);
    }
  }

  // Optional: Twilio API integration
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const params = new URLSearchParams({
        To: targetPhone.startsWith('+') ? targetPhone : `+${targetPhone}`,
        From: process.env.TWILIO_PHONE_NUMBER,
        Body: smsBody,
      });

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      const data = await res.json().catch(() => ({}));
      console.log('[Twilio Status]', data?.sid || data?.message);
    } catch (twilioErr) {
      console.warn('[Twilio Warning] Could not dispatch SMS:', twilioErr.message);
    }
  }

  return {
    success: true,
    phone: targetPhone,
    maskedPhone: masked,
    expiresInSeconds: 600,
  };
}

/**
 * Save OTP to MongoDB admin_otps collection
 */
export async function saveOtpToDB(db, { username = 'admin', phone, otp, expiresInMinutes = 10 }) {
  const collection = db.collection('admin_otps');
  const targetPhone = phone || HARDCODED_ADMIN_PHONE;
  const otpHash = await hash(otp, 10);
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  // Invalidate any older OTPs for this admin
  await collection.deleteMany({ username });

  await collection.insertOne({
    username,
    phone: targetPhone,
    otpHash,
    // Store in-flight raw OTP for verified dev testing if not in strict production
    rawOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
    expiresAt,
    attempts: 0,
    createdAt: new Date(),
  });

  return { expiresAt };
}

/**
 * Verify OTP against MongoDB admin_otps collection
 */
export async function verifyOtpFromDB(db, { username = 'admin', otp }) {
  if (!otp || typeof otp !== 'string') {
    return { valid: false, error: 'Please enter a valid 6-digit OTP' };
  }

  const cleanOtp = otp.trim();
  if (cleanOtp.length !== 6) {
    return { valid: false, error: 'OTP must be exactly 6 digits' };
  }

  const collection = db.collection('admin_otps');
  const record = await collection.findOne({
    username,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    return { valid: false, error: 'OTP has expired or was not requested. Please request a new code.' };
  }

  if (record.attempts >= 5) {
    await collection.deleteOne({ _id: record._id });
    return { valid: false, error: 'Too many incorrect attempts. Please request a fresh OTP.' };
  }

  const isMatch = await compare(cleanOtp, record.otpHash);
  if (!isMatch) {
    await collection.updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
    const remaining = Math.max(0, 4 - record.attempts);
    return {
      valid: false,
      error: `Invalid OTP code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'Please request a fresh OTP.'}`,
    };
  }

  return { valid: true, record };
}

/**
 * Clear OTP after successful password reset
 */
export async function clearOtpFromDB(db, { username = 'admin' }) {
  try {
    const collection = db.collection('admin_otps');
    await collection.deleteMany({ username });
  } catch (err) {
    console.warn('[clearOtpFromDB Warning]', err.message);
  }
}
