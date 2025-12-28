/**
 * Utility functions for interacting with Support Board widget
 */

// Maximum time to wait for Support Board to load (10 seconds)
const MAX_WAIT_TIME = 10000;
// Polling interval to check if Support Board is ready (100ms)
const POLL_INTERVAL = 100;
// Delay after scripts load to allow widget initialization (ms)
const INITIALIZATION_DELAY = 300;

/**
 * Checks if Support Board scripts are loaded and ready
 */
function isSupportBoardReady(): boolean {
    if (typeof window === 'undefined') return false;

    // Check if scripts are marked as ready
    if (window.supportBoardReady) {
        return true;
    }

    // Check for jQuery (required dependency)
    const hasJQuery = typeof (window as any).jQuery !== 'undefined' || typeof (window as any).$ !== 'undefined';
    if (!hasJQuery) {
        return false;
    }

    // Check for SBChat (primary API)
    return !!(window as any).SBChat;
}

/**
 * Attempts to open the Support Board widget
 */
function attemptOpenSupportBoard(): boolean {
    if (typeof window === 'undefined') return false;

    // Primary method: SBChat.open()
    if ((window as any).SBChat?.open) {
        try {
            (window as any).SBChat.open();
            if (process.env.NODE_ENV === 'development') {
                console.log('Support Board: Opened via SBChat.open()');
            }
            return true;
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Support Board: Error calling SBChat.open()', error);
            }
        }
    }

    // Fallback: Try alternative methods if SBChat is not available
    const $ = (window as any).jQuery || (window as any).$;

    // Fallback 1: Alternative global objects
    const fallbacks = [
        () => (window as any).SupportBoard?.open?.(),
        () => (window as any).supportBoard?.open?.(),
        () => typeof (window as any).openSupportBoard === 'function' && (window as any).openSupportBoard(),
    ];

    for (const fallback of fallbacks) {
        try {
            if (fallback()) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('Support Board: Opened via fallback method');
                }
                return true;
            }
        } catch (error) {
            // Continue to next fallback
        }
    }

    // Fallback 2: Try clicking widget button if jQuery is available
    if ($) {
        const selectors = [
            '#support-board',
            '#support-board-widget',
            '.support-board-widget',
            '[data-support-board]',
        ];

        for (const selector of selectors) {
            try {
                const element = $(selector);
                if (element.length > 0) {
                    element[0]?.click();
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`Support Board: Opened via clicking ${selector}`);
                    }
                    return true;
                }
            } catch (error) {
                continue;
            }
        }
    }

    if (process.env.NODE_ENV === 'development') {
        console.warn('Support Board: Could not open widget. SBChat may not be initialized yet.');
    }

    return false;
}

/**
 * Waits for Support Board to be ready, then opens it
 */
function waitForSupportBoardAndOpen(): Promise<boolean> {
    return new Promise((resolve) => {
        const startTime = Date.now();

        // Check if already ready
        if (isSupportBoardReady()) {
            setTimeout(() => {
                resolve(attemptOpenSupportBoard());
            }, INITIALIZATION_DELAY);
            return;
        }

        // Set up event listener for when Support Board becomes ready
        const handleReady = () => {
            setTimeout(() => {
                resolve(attemptOpenSupportBoard());
            }, INITIALIZATION_DELAY);
        };

        window.addEventListener('supportBoardReady', handleReady, { once: true });

        // Poll as a fallback (in case event doesn't fire)
        const pollInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;

            // Timeout check
            if (elapsed >= MAX_WAIT_TIME) {
                clearInterval(pollInterval);
                window.removeEventListener('supportBoardReady', handleReady);

                if (process.env.NODE_ENV === 'development') {
                    console.warn('Support Board: Timeout waiting for scripts to load');
                }
                // Try to open anyway
                setTimeout(() => {
                    resolve(attemptOpenSupportBoard());
                }, INITIALIZATION_DELAY);
                return;
            }

            // Check if ready
            if (isSupportBoardReady() || window.supportBoardReady) {
                clearInterval(pollInterval);
                window.removeEventListener('supportBoardReady', handleReady);
                setTimeout(() => {
                    resolve(attemptOpenSupportBoard());
                }, INITIALIZATION_DELAY);
            }
        }, POLL_INTERVAL);
    });
}

/**
 * Opens the Support Board widget.
 * If the widget is not yet loaded, it will wait for it to load before opening.
 * 
 * @returns Promise that resolves to true if opened successfully, false otherwise
 */
export async function openSupportBoard(): Promise<boolean> {
    if (typeof window === 'undefined') {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Support Board: Cannot open in server environment');
        }
        return false;
    }

    // Check if Support Board URL is configured
    const supportBoardUrl = process.env.NEXT_PUBLIC_SUPPORT_BOARD_URL;
    if (!supportBoardUrl) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Support Board: URL not configured');
        }
        return false;
    }

    // Set loading cursor by adding a class to html element
    // This ensures it overrides all cursor styles including button/link cursor-pointer
    const htmlElement = document.documentElement;
    htmlElement.classList.add('support-board-loading');

    // Inject a style tag to ensure cursor override works globally
    let styleElement = document.getElementById('support-board-cursor-style') as HTMLStyleElement;
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'support-board-cursor-style';
        document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
        html.support-board-loading *,
        html.support-board-loading *::before,
        html.support-board-loading *::after {
            cursor: wait !important;
        }
    `;

    try {
        // If already ready, try to open immediately (with small delay for initialization)
        if (isSupportBoardReady() || window.supportBoardReady) {
            const result = await new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    resolve(attemptOpenSupportBoard());
                }, INITIALIZATION_DELAY);
            });
            return result;
        }

        // Otherwise, wait for it to load
        return await waitForSupportBoardAndOpen();
    } finally {
        // Remove the class and style element
        htmlElement.classList.remove('support-board-loading');
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
    }
}
