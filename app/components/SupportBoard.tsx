'use client';

import Script from 'next/script';

export default function SupportBoard() {
    // Get Support Board URL from environment variable
    // You can set this in .env.local as: NEXT_PUBLIC_SUPPORT_BOARD_URL=https://your-support-board-url.com
    const supportBoardUrl = process.env.NEXT_PUBLIC_SUPPORT_BOARD_URL || '';

    // Don't render if URL is not configured
    if (!supportBoardUrl) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Support Board URL not configured. Set NEXT_PUBLIC_SUPPORT_BOARD_URL in .env.local');
        }
        return null;
    }

    // Remove trailing slash if present
    const cleanUrl = supportBoardUrl.replace(/\/$/, '');

    return (
        <>
            {/* jQuery - Required by Support Board (not required if jQuery is already loaded) */}
            <Script
                id="jquery-support-board"
                src={`${cleanUrl}/js/min/jquery.min.js`}
                strategy="afterInteractive"
            />

            {/* Support Board Main Script - Loads in order after jQuery */}
            <Script
                id="support-board-init"
                src={`${cleanUrl}/js/main.js`}
                strategy="afterInteractive"
            />
        </>
    );
}

