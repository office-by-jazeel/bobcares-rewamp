/**
 * Google reCAPTCHA v3 TypeScript types and utility functions
 */

// TypeScript declarations for the global grecaptcha object
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

/**
 * Execute reCAPTCHA v3 and get a token
 * @param action - The action name for reCAPTCHA (e.g., 'submit', 'newsletter')
 * @returns Promise that resolves to the reCAPTCHA token, or null if failed
 */
export async function executeRecaptcha(
  action: string = 'submit'
): Promise<string | null> {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    console.error('reCAPTCHA can only be executed in the browser');
    return null;
  }

  // Check if grecaptcha is available
  if (!window.grecaptcha) {
    console.error('reCAPTCHA script not loaded');
    return null;
  }

  // Get site key from environment variable
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    console.error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set');
    return null;
  }

  try {
    return new Promise((resolve) => {
      window.grecaptcha!.ready(() => {
        window
          .grecaptcha!.execute(siteKey, { action })
          .then((token) => {
            resolve(token);
          })
          .catch((error) => {
            console.error('reCAPTCHA execution error:', error);
            resolve(null);
          });
      });
    });
  } catch (error) {
    console.error('reCAPTCHA error:', error);
    return null;
  }
}

