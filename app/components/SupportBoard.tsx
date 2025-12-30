'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Global state to track Support Board loading status
declare global {
    interface Window {
        supportBoardReady?: boolean;
        supportBoardLoading?: boolean;
    }
}

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

    // Initialize loading state
    useEffect(() => {
        window.supportBoardLoading = true;
        window.supportBoardReady = false;
    }, []);

    const handleMainScriptLoad = () => {
        // Scripts are loaded, but widget may need time to initialize
        // Wait a bit before marking as ready
        setTimeout(() => {
            window.supportBoardLoading = false;
            window.supportBoardReady = true;
            
            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('supportBoardReady'));
            
            if (process.env.NODE_ENV === 'development') {
                console.log('Support Board: Ready');
            }
        }, 300);
    };

    const handleScriptError = () => {
        window.supportBoardLoading = false;
        window.supportBoardReady = false;
        
        if (process.env.NODE_ENV === 'development') {
            console.error('Support Board: Failed to load scripts');
        }
    };

    return (
        <>
            {/* jQuery - Required by Support Board */}
            <Script
                id="jquery-support-board"
                src={`${cleanUrl}/js/min/jquery.min.js`}
                strategy="afterInteractive"
                onError={handleScriptError}
            />

            {/* Support Board Main Script - Loads in order after jQuery */}
            <Script
                id="support-board-init"
                src={`${cleanUrl}/js/main.js`}
                strategy="afterInteractive"
                onLoad={handleMainScriptLoad}
                onError={handleScriptError}
            />
        </>
    );
}

