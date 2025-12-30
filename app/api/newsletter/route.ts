import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Extract IP address from request headers
 * Checks multiple headers in order of priority:
 * 1. x-forwarded-for (for proxies/load balancers - takes first IP)
 * 2. x-real-ip (for nginx reverse proxy)
 * 3. cf-connecting-ip (for Cloudflare)
 * 4. x-client-ip (custom header)
 * 
 * Note: In Next.js App Router, IP addresses must be extracted from headers.
 * The request.ip property is not available in App Router API routes.
 */
function getClientIp(request: NextRequest): string | null {
  // Check x-forwarded-for header (first IP if comma-separated)
  // This is the most common header for proxied requests
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    // Take the first IP (original client IP before proxies)
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  // Check x-real-ip header (commonly used by nginx)
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Check cf-connecting-ip header (Cloudflare)
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Check x-client-ip header (custom header)
  const clientIp = request.headers.get('x-client-ip');
  if (clientIp) {
    return clientIp.trim();
  }

  // If no IP found in headers, return null (will be stored as NULL in database)
  // This can happen in development or if headers are not properly configured
  return null;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Verify reCAPTCHA token with Google's API
 * @param token - The reCAPTCHA token to verify
 * @param ip - Optional IP address of the user
 * @returns Promise that resolves to true if verification succeeds, false otherwise
 */
async function verifyRecaptcha(
  token: string,
  ip: string | null
): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not set');
    return false;
  }

  try {
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (ip) {
      formData.append('remoteip', ip);
    }

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    // reCAPTCHA v3 returns a score (0.0 to 1.0)
    // Get threshold from environment variable, default to 0.5
    const threshold = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5');

    // Ensure threshold is between 0.0 and 1.0
    const validThreshold = Math.max(0.0, Math.min(1.0, threshold));

    return data.success === true && (data.score ?? 0) >= validThreshold;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, recaptchaToken } = body;

    // Validate email is provided
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Extract IP address
    const ip = getClientIp(request);

    // Log IP extraction for debugging (remove in production if needed)
    if (process.env.NODE_ENV === 'development') {
      console.log('Extracted IP:', ip);
    }

    // Verify reCAPTCHA token only if secret key is configured and token is provided
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (secretKey && recaptchaToken && typeof recaptchaToken === 'string') {
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken, ip);
      if (!isRecaptchaValid) {
        return NextResponse.json(
          { success: false, message: 'Security verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Save to database
    try {
      await prisma.newsletter.create({
        data: {
          email: trimmedEmail,
          ip: ip || null, // Store IP or null if not available
        },
      });

      return NextResponse.json(
        { success: true, message: 'Successfully subscribed to newsletter' },
        { status: 200 }
      );
    } catch (error: any) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, message: 'This email is already subscribed' },
          { status: 400 }
        );
      }

      // Re-throw other database errors
      throw error;
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
