'use client';

import { useState, useEffect } from 'react';
import { cn, getCookie, setCookie } from '@/lib/utils';

interface CookiePreferences {
    necessary: boolean;
    statistics: boolean;
    marketing: boolean;
    security: boolean;
}

const STORAGE_KEY = 'bobcares-cookie-consent';
// Cookie name used by WordPress Moove GDPR Cookie Compliance plugin
// This ensures Next.js homepage respects and shares consent state with WordPress
// The cookie gdpr[privacy_bar]=1 indicates that the privacy bar has been shown/accepted
const MOOVE_GDPR_COOKIE = 'gdpr%5Bprivacy_bar%5D';

// Check if cookie consent is enabled via environment variable
// Defaults to 'false' (disabled) if not set - only enabled when explicitly set to 'true'
const isCookieConsentEnabled = process.env.NEXT_PUBLIC_ENABLE_COOKIE_CONSENT === 'true';

type MainTab = 'consent-management' | 'cookie-settings';
type SubTab = 'necessary' | 'advertising' | 'analytics' | 'other';

export default function CookieConsent() {
    // Early return if cookie consent is disabled
    if (!isCookieConsentEnabled) {
        return null;
    }
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [showPreferenceCenter, setShowPreferenceCenter] = useState(false);
    const [isModalMounted, setIsModalMounted] = useState(false);
    const [activeMainTab, setActiveMainTab] = useState<MainTab>('consent-management');
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('necessary');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always enabled
        statistics: true, // Default to true based on HTML (checked="checked")
        marketing: true, // Default to true based on HTML (checked="checked")
        security: true, // Default to true based on HTML (checked="checked")
    });

    useEffect(() => {
        // Check if consent has already been given via gdpr[privacy_bar] cookie
        // This cookie is set by WordPress Moove GDPR plugin and ensures Next.js
        // homepage respects WordPress consent state
        // Value of "1" indicates the privacy bar has been shown/accepted
        if (typeof window !== 'undefined') {
            const mooveConsent = getCookie(MOOVE_GDPR_COOKIE);
            // If cookie exists with value "1", don't show banner
            if (mooveConsent !== '1') {
                setShouldRender(true);
                // Load saved preferences from localStorage if any (for preference center)
                const savedPreferences = localStorage.getItem(STORAGE_KEY);
                if (savedPreferences) {
                    try {
                        const parsed = JSON.parse(savedPreferences);
                        setPreferences({ ...preferences, ...parsed });
                    } catch (e) {
                        // Ignore parse errors
                    }
                }
                // Show banner after 2 seconds delay for animation
                setTimeout(() => {
                    setIsVisible(true);
                }, 2000);
            }
        }
    }, []);

    const handleAcceptAll = async () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            statistics: true,
            marketing: true,
            security: true,
        };
        await savePreferences(allAccepted);
        setIsVisible(false);
        // Reload page after setting cookie to ensure WordPress integration works properly
        window.location.reload();
    };

    const handlePrivacyPreferences = () => {
        setShowPreferenceCenter(true);
    };

    const handleSavePreferences = async () => {
        await savePreferences(preferences);
        setShowMobileMenu(false);
        setIsModalMounted(false);
        setTimeout(() => {
            setShowPreferenceCenter(false);
            setIsVisible(false);
            // Reload page after setting cookie to ensure WordPress integration works properly
            window.location.reload();
        }, 300);
    };

    const handleClosePreferenceCenter = () => {
        setIsModalMounted(false);
        setTimeout(() => {
            setShowPreferenceCenter(false);
        }, 300);
    };

    useEffect(() => {
        if (showPreferenceCenter) {
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
            // Trigger fade-in animation after mount
            requestAnimationFrame(() => {
                setIsModalMounted(true);
            });
        } else {
            setIsModalMounted(false);
            // Restore body scroll when modal is closed
            document.body.style.overflow = '';
        }

        // Cleanup function to restore scroll if component unmounts
        return () => {
            document.body.style.overflow = '';
        };
    }, [showPreferenceCenter]);

    const sendConsentToWordPress = async (prefs: CookiePreferences) => {
        try {
            // Define cookie arrays for each category - matching HTML input values exactly
            // These match the checkbox values in the HTML form
            const necessaryCookies = ['PHPSESSID', 'gdpr[consent_types]', 'gdpr[allowed_cookies]'];
            const statisticsCookies = ['_ga', '_gat', '_gid'];
            const marketingCookies = ['IDE', 'test_cookie', '1P_JAR', 'NID', 'DV', 'NID'];
            const securityCookies = ['SID', 'APISID', 'HSID', 'NID', 'PREF'];

            // Build approved cookies array based on preferences
            const approvedCookies: string[][] = [];

            // Always include necessary cookies
            approvedCookies.push(necessaryCookies);

            if (prefs.statistics) {
                approvedCookies.push(statisticsCookies);
            }

            if (prefs.marketing) {
                approvedCookies.push(marketingCookies);
            }

            if (prefs.security) {
                approvedCookies.push(securityCookies);
            }

            // Build all cookies array (union of all approved cookies)
            const allCookiesSet = new Set<string>();
            approvedCookies.forEach(cookieArray => {
                cookieArray.forEach(cookie => allCookiesSet.add(cookie));
            });
            const allCookies = Array.from(allCookiesSet);

            // Build form data
            const formData = new URLSearchParams();
            formData.append('action', 'gdpr_update_privacy_preferences');
            formData.append('update-privacy-preferences-nonce', 'e5e36c2134');
            formData.append('_wp_http_referer', '/');
            formData.append('user_consents[]', 'privacy-policy');

            // Add approved cookies arrays
            approvedCookies.forEach(cookieArray => {
                formData.append('approved_cookies[]', JSON.stringify(cookieArray));
            });

            // Add all cookies array
            formData.append('all_cookies', JSON.stringify(allCookies));

            // Make the API call
            await fetch('https://bobcares.com/wp-admin/admin-ajax.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData.toString(),
            });
        } catch (error) {
            // Silently fail - don't break the UI if the API call fails
            console.error('Failed to send consent to WordPress:', error);
        }
    };

    const savePreferences = async (prefs: CookiePreferences) => {
        if (typeof window !== 'undefined') {
            // Save preferences to localStorage for preference center functionality
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));

            // Set gdpr[privacy_bar] cookie to match WordPress Moove plugin format
            // This ensures Next.js homepage shares consent state with WordPress
            // Format: gdpr[privacy_bar]=1; path=/; max-age=31536000
            // Value of "1" indicates the privacy bar has been shown/accepted
            // Max-age of 31536000 seconds = 1 year (matches Moove plugin)
            setCookie(MOOVE_GDPR_COOKIE, '1', 31536000);

            // Send consent to WordPress API
            await sendConsentToWordPress(prefs);
        }
    };

    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === 'necessary') return; // Cannot disable necessary cookies
        setPreferences((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleMainTabClick = (tab: MainTab) => {
        setActiveMainTab(tab);
        if (tab === 'cookie-settings') {
            setActiveSubTab('necessary');
        }
        setShowMobileMenu(false);
    };

    const handleSubTabClick = (subTab: SubTab) => {
        setActiveSubTab(subTab);
        setActiveMainTab('cookie-settings');
        setShowMobileMenu(false);
    };

    if (!shouldRender) return null;

    return (
        <>
            {/* Cookie Consent Banner - stays at bottom */}
            <div
                className={cn(
                    'fixed bottom-0 left-1/2 -translate-x-1/2 z-[101] transition-all duration-300 ease-out w-full md:w-fit',
                    isVisible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-full opacity-0'
                )}
            >
                <div className="bg-[#CCCCCC] md:rounded-t-[5px] px-[18px] py-[5px]">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-1 md:gap-4">
                        <p className="text-[13px] text-[#444444] text-center sm:text-left">
                            Bobcares uses cookies.
                        </p>
                        <button
                            onClick={handlePrivacyPreferences}
                            className="text-[13px] font-light underline underline-offset-2 transition-colors"
                        >
                            Privacy Preferences
                        </button>
                        <button
                            onClick={handleAcceptAll}
                            className="bg-[#666666] leading-[20px] text-[13px] px-1.5 shadow-[0_1px_0_#111111] text-white"
                        >
                            I Agree
                        </button>
                    </div>
                </div>
            </div>

            {/* Privacy Preference Center Modal */}
            {showPreferenceCenter && (
                <>
                    {/* Backdrop overlay */}
                    <div
                        className={cn(
                            'fixed inset-0 bg-black/80 z-[100] transition-opacity duration-300',
                            isModalMounted ? 'opacity-100' : 'opacity-0'
                        )}
                        onClick={handleClosePreferenceCenter}
                        data-lenis-prevent
                    />
                    {/* Modal Content */}
                    <div
                        className={cn(
                            'fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none'
                        )}
                        data-lenis-prevent
                    >
                        <div
                            className={cn(
                                'relative w-full max-w-5xl max-h-[500px] bg-white overflow-hidden flex flex-col transition-all duration-300 pointer-events-auto',
                                isModalMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                            )}
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxHeight: '500px' }}
                            data-lenis-prevent
                        >
                            {/* Header */}
                            <header className="bg-[#23282d] px-6 py-4 flex items-center justify-center relative">
                                <h3 className="text-white text-lg font-semibold">Privacy Preference Center</h3>
                                <button
                                    onClick={handleClosePreferenceCenter}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                                    aria-label="Close preference center"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </header>

                            {/* Mobile Menu Button */}
                            <div className="md:hidden bg-[#23282d] px-6 py-2 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    className="w-full text-left text-white py-2 px-4 bg-[#32373c] rounded hover:bg-[#3d4145] transition-colors"
                                >
                                    Options
                                </button>
                            </div>

                            {/* Mobile Menu Backdrop */}
                            {showMobileMenu && (
                                <div
                                    className="md:hidden fixed inset-0 bg-black/50 z-[102]"
                                    onClick={() => setShowMobileMenu(false)}
                                />
                            )}

                            {/* Content Area */}
                            <div className="flex flex-1 overflow-hidden relative min-h-0">
                                {/* Left Sidebar - Navigation */}
                                <div
                                    className={cn(
                                        'bg-[#23282d] w-64 shrink-0 border-r border-gray-700 overflow-y-auto scrollbar-hide min-h-0',
                                        'md:block',
                                        showMobileMenu ? 'block absolute inset-y-0 left-0 z-103 md:relative md:z-auto' : 'hidden'
                                    )}
                                    data-lenis-prevent
                                >
                                    <div className="p-4">
                                        {/* Main Tabs */}
                                        <ul className="space-y-1">
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => handleMainTabClick('consent-management')}
                                                    className={cn(
                                                        'w-full text-left px-3 py-2 text-sm text-white rounded transition-colors flex items-center justify-between',
                                                        activeMainTab === 'consent-management' ? 'bg-[#0073aa]' : 'hover:bg-[#32373c]'
                                                    )}
                                                >
                                                    <span>Consent Management</span>
                                                    {activeMainTab === 'consent-management' && (
                                                        <span className="text-white">→</span>
                                                    )}
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => handleMainTabClick('cookie-settings')}
                                                    className={cn(
                                                        'w-full text-left px-3 py-2 text-sm text-white rounded transition-colors flex items-center justify-between',
                                                        activeMainTab === 'cookie-settings' ? 'bg-[#0073aa]' : 'hover:bg-[#32373c]'
                                                    )}
                                                >
                                                    <span>Cookie Settings</span>
                                                    {activeMainTab === 'cookie-settings' && (
                                                        <span className="text-white">→</span>
                                                    )}
                                                </button>

                                                {/* Sub-tabs - Always visible */}
                                                <ul className="mt-1 ml-4 space-y-1">
                                                    <li>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSubTabClick('necessary')}
                                                            className={cn(
                                                                'w-full text-left px-3 py-2 text-sm text-white rounded transition-colors',
                                                                activeMainTab === 'cookie-settings' && activeSubTab === 'necessary' ? 'bg-[#0073aa]' : 'hover:bg-[#32373c]'
                                                            )}
                                                        >
                                                            Necessary
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSubTabClick('advertising')}
                                                            className={cn(
                                                                'w-full text-left px-3 py-2 text-sm text-white rounded transition-colors',
                                                                activeMainTab === 'cookie-settings' && activeSubTab === 'advertising' ? 'bg-[#0073aa]' : 'hover:bg-[#32373c]'
                                                            )}
                                                        >
                                                            Statistics
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSubTabClick('analytics')}
                                                            className={cn(
                                                                'w-full text-left px-3 py-2 text-sm text-white rounded transition-colors',
                                                                activeMainTab === 'cookie-settings' && activeSubTab === 'analytics' ? 'bg-[#0073aa]' : 'hover:bg-[#32373c]'
                                                            )}
                                                        >
                                                            Marketing
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSubTabClick('other')}
                                                            className={cn(
                                                                'w-full text-left px-3 py-2 text-sm text-white rounded transition-colors',
                                                                activeMainTab === 'cookie-settings' && activeSubTab === 'other' ? 'bg-[#0073aa]' : 'hover:bg-[#32373c]'
                                                            )}
                                                        >
                                                            Security
                                                        </button>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>

                                        {/* Privacy Policy Link */}
                                        <ul className="mt-6 pt-6 border-t border-gray-700">
                                            <li>
                                                <a
                                                    href="https://bobcares.com/privacy-policy/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white text-sm px-3 py-2 block hover:text-gray-300 transition-colors"
                                                >
                                                    Privacy Policy
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Content Area */}
                                <div className="flex-1 bg-white overflow-hidden min-h-0" data-lenis-prevent>
                                    <div className="p-6 h-full flex flex-col min-h-0">
                                        {/* Consent Management Content */}
                                        {activeMainTab === 'consent-management' && (
                                            <div className="flex-1 overflow-y-auto min-h-0">
                                                <header className="mb-4">
                                                    <h4 className="text-xl font-semibold text-gray-900">Consent Management</h4>
                                                </header>
                                                <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                                                    <p>
                                                        When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalized web experience.
                                                    </p>
                                                    <p>
                                                        Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to find out more and change our default settings. However, blocking some types of cookies may impact your experience of the site and the services we are able to offer.
                                                    </p>

                                                    {/* Privacy Policy Section */}
                                                    <div className="mt-6 border border-gray-200 rounded p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="font-medium text-gray-900">Privacy Policy</p>
                                                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Required</span>
                                                        </div>
                                                        <div className="text-sm text-gray-700">
                                                            <span>By using this site, you agree to our <a href="https://bobcares.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-[#0073ec] hover:underline">Privacy Policy</a>.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Necessary Cookies Content */}
                                        {activeMainTab === 'cookie-settings' && activeSubTab === 'necessary' && (
                                            <div className="flex-1 overflow-y-auto min-h-0">
                                                <header className="mb-4">
                                                    <h4 className="text-xl font-semibold text-gray-900">Necessary</h4>
                                                </header>
                                                <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                                                    <p>
                                                        Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.
                                                    </p>
                                                    <p>
                                                        PHPSESSID - Preserves user session state across page requests.
                                                    </p>
                                                    <p>
                                                        gdpr[consent_types] - Used to store user consents.
                                                    </p>
                                                    <p>
                                                        gdpr[allowed_cookies] - Used to store user allowed cookies.
                                                    </p>

                                                    {/* Cookies Used Section */}
                                                    <div className="mt-6 space-y-4">
                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">Cookies Used</p>
                                                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Required</span>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>PHPSESSID, gdpr[consent_types], gdpr[allowed_cookies]</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">livechat.bobcares.com</p>
                                                                <a href="https://bobcares.com/privacy-policy/" target="_blank" rel="noreferrer" className="text-[#0073ec] hover:underline text-sm">Opt Out</a>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>PHPSESSID</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">my.bobcares.com</p>
                                                                <a href="https://bobcares.com/privacy-policy-cookie-restriction-mode/" target="_blank" rel="noreferrer" className="text-[#0073ec] hover:underline text-sm">Opt Out</a>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>WHMCSpKDlPzh2chML</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Statistics Cookies Content */}
                                        {activeMainTab === 'cookie-settings' && activeSubTab === 'advertising' && (
                                            <div className="flex-1 overflow-y-auto min-h-0">
                                                <header className="mb-4">
                                                    <h4 className="text-xl font-semibold text-gray-900">Statistics</h4>
                                                </header>
                                                <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                                                    <p>
                                                        Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.
                                                    </p>
                                                    <p>
                                                        _ga - Preserves user session state across page requests.
                                                    </p>
                                                    <p>
                                                        _gat - Used by Google Analytics to throttle request rate
                                                    </p>
                                                    <p>
                                                        _gid - Registers a unique ID that is used to generate statistical data on how you use the website.
                                                    </p>
                                                    <p>
                                                        smartlookCookie - Used to collect user device and location information of the site visitors to improve the websites User Experience.
                                                    </p>

                                                    {/* Cookies Used Section */}
                                                    <div className="mt-6 space-y-4">
                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">Cookies Used</p>
                                                                <ToggleSwitch
                                                                    enabled={preferences.statistics}
                                                                    onToggle={() => togglePreference('statistics')}
                                                                />
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>_ga, _gat, _gid</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">google.com</p>
                                                                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-[#0073ec] hover:underline text-sm">Opt Out</a>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>_ga, _gat, _gid</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">manager.smartlook.com</p>
                                                                <a href="https://www.smartlook.com/opt-out" target="_blank" rel="noreferrer" className="text-[#0073ec] hover:underline text-sm">Opt Out</a>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>smartlookCookie</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">clarity.microsoft.com</p>
                                                                <a href="https://learn.microsoft.com/en-us/clarity/faq#how-can-i-prevent-clarity-from-gathering-data-on-my-page-views-when-i-visit-websites-that-use-clarity-" target="_blank" rel="noreferrer" className="text-[#0073ec] hover:underline text-sm">Opt Out</a>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>_clck, _clsk, CLID, ANONCHK, MR, MUID, SM</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Marketing Cookies Content */}
                                        {activeMainTab === 'cookie-settings' && activeSubTab === 'analytics' && (
                                            <div className="flex-1 overflow-y-auto min-h-0">
                                                <header className="mb-4">
                                                    <h4 className="text-xl font-semibold text-gray-900">Marketing</h4>
                                                </header>
                                                <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                                                    <p>
                                                        Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.
                                                    </p>
                                                    <p>
                                                        IDE - Used by Google DoubleClick to register and report the website user's actions after viewing or clicking one of the advertiser's ads with the purpose of measuring the efficacy of an ad and to present targeted ads to the user.
                                                    </p>
                                                    <p>
                                                        test_cookie - Used to check if the user's browser supports cookies.
                                                    </p>
                                                    <p>
                                                        1P_JAR - Google cookie. These cookies are used to collect website statistics and track conversion rates.
                                                    </p>
                                                    <p>
                                                        NID - Registers a unique ID that identifies a returning user's device. The ID is used for serving ads that are most relevant to the user.
                                                    </p>
                                                    <p>
                                                        DV - Google ad personalisation
                                                    </p>
                                                    <p>
                                                        _reb2bgeo - The visitor's geographical location
                                                    </p>
                                                    <p>
                                                        _reb2bloaded - Whether or not the script loaded for the visitor
                                                    </p>
                                                    <p>
                                                        _reb2bref - The referring URL for the visit
                                                    </p>
                                                    <p>
                                                        _reb2bsessionID - The visitor's RB2B session ID
                                                    </p>
                                                    <p>
                                                        _reb2buid - The visitor's RB2B user ID
                                                    </p>

                                                    {/* Cookies Used Section */}
                                                    <div className="mt-6 space-y-4">
                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">Cookies Used</p>
                                                                <ToggleSwitch
                                                                    enabled={preferences.marketing}
                                                                    onToggle={() => togglePreference('marketing')}
                                                                />
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>IDE, test_cookie, 1P_JAR, NID, DV, NID</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">doubleclick.net</p>
                                                                <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-[#0073ec] hover:underline text-sm">Opt Out</a>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>IDE, test_cookie</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">google.co.in</p>
                                                                <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-[#0073ec] hover:underline text-sm">Opt Out</a>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>1P_JAR, NID, DV</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">google.com</p>
                                                                <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-[#0073ec] hover:underline text-sm">Opt Out</a>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>NID</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">olark.com</p>
                                                                <a href="https://bobcares.com/contact-us/" target="_blank" rel="noreferrer" className="text-[#0073ec] hover:underline text-sm">Opt Out</a>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>hblid</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">rb2b.com</p>
                                                                <a href="https://app.retention.com/optout" target="_blank" rel="noreferrer" className="text-[#0073ec] hover:underline text-sm">Opt Out</a>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>_reb2bgeo, _reb2bloaded, _reb2bref, _reb2bsessionID, _reb2buid</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Security Cookies Content */}
                                        {activeMainTab === 'cookie-settings' && activeSubTab === 'other' && (
                                            <div className="flex-1 overflow-y-auto min-h-0">
                                                <header className="mb-4">
                                                    <h4 className="text-xl font-semibold text-gray-900">Security</h4>
                                                </header>
                                                <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                                                    <p>
                                                        These are essential site cookies, used by the google reCAPTCHA. These cookies use an unique identifier to verify if a visitor is human or a bot.
                                                    </p>

                                                    {/* Cookies Used Section */}
                                                    <div className="mt-6 space-y-4">
                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">Cookies Used</p>
                                                                <ToggleSwitch
                                                                    enabled={preferences.security}
                                                                    onToggle={() => togglePreference('security')}
                                                                />
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>SID, APISID, HSID, NID, PREF</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-gray-200 rounded p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="font-medium text-gray-900">google.com</p>
                                                                <a href="https://policies.google.com/privacy?hl=en#infochoices" target="_blank" rel="noreferrer" className="text-[#0073ec] hover:underline text-sm">Opt Out</a>
                                                            </div>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <span>SID, APISID, HSID, NID, PREF</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <footer className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={handleSavePreferences}
                                                className="bg-[#0073aa] hover:bg-[#005a87] text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                                            >
                                                Save Preferences
                                            </button>
                                        </footer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

interface ToggleSwitchProps {
    enabled: boolean;
    onToggle: () => void;
}

function ToggleSwitch({ enabled, onToggle }: ToggleSwitchProps) {
    return (
        <label className="relative inline-flex items-center cursor-pointer gap-2">
            <input
                type="checkbox"
                checked={enabled}
                onChange={onToggle}
                className="sr-only peer"
            />
            <div className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                enabled ? "bg-[#0073aa]" : "bg-gray-300"
            )}>
                <span className={cn(
                    "absolute top-1/2 -translate-y-1/2 text-xs font-medium text-white transition-opacity",
                    enabled ? "left-2 opacity-100" : "left-2 opacity-0"
                )}>
                    ON
                </span>
                <span className={cn(
                    "absolute top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600 transition-opacity",
                    enabled ? "right-2 opacity-0" : "right-2 opacity-100"
                )}>
                    OFF
                </span>
                <span className={cn(
                    "absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform duration-200",
                    enabled ? "translate-x-5" : "translate-x-0"
                )} />
            </div>
        </label>
    );
}
