'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CookiePreferences {
    necessary: boolean;
    statistics: boolean;
    marketing: boolean;
    security: boolean;
}

const STORAGE_KEY = 'bobcares-cookie-consent';
const CONSENT_GIVEN_KEY = 'bobcares-consent-given';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferenceCenter, setShowPreferenceCenter] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always enabled
        statistics: false,
        marketing: false,
        security: false,
    });

    useEffect(() => {
        // Check if consent has already been given
        if (typeof window !== 'undefined') {
            const consentGiven = localStorage.getItem(CONSENT_GIVEN_KEY);
            if (!consentGiven) {
                // Load saved preferences if any
                const savedPreferences = localStorage.getItem(STORAGE_KEY);
                if (savedPreferences) {
                    try {
                        const parsed = JSON.parse(savedPreferences);
                        setPreferences({ ...preferences, ...parsed });
                    } catch (e) {
                        // Ignore parse errors
                    }
                }
                // Show banner after a short delay for animation
                setTimeout(() => {
                    setIsVisible(true);
                }, 500);
            }
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            statistics: true,
            marketing: true,
            security: true,
        };
        savePreferences(allAccepted);
        setIsVisible(false);
    };

    const handlePrivacyPreferences = () => {
        setShowPreferenceCenter(true);
    };

    const handleSavePreferences = () => {
        savePreferences(preferences);
        setShowPreferenceCenter(false);
        setIsVisible(false);
    };

    const handleClosePreferenceCenter = () => {
        setShowPreferenceCenter(false);
    };

    const savePreferences = (prefs: CookiePreferences) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
            localStorage.setItem(CONSENT_GIVEN_KEY, 'true');
        }
    };

    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === 'necessary') return; // Cannot disable necessary cookies
        setPreferences((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop overlay when preference center is open */}
            {showPreferenceCenter && (
                <div
                    className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
                    onClick={handleClosePreferenceCenter}
                />
            )}

            {/* Cookie Consent Banner/Preference Center */}
            <div
                className={cn(
                    'gdpr-wrapper fixed bottom-0 left-1/2 -translate-x-1/2 right-0 z-[101] transition-all duration-300 ease-out w-fit',
                    isVisible && !showPreferenceCenter
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-full opacity-0',
                    showPreferenceCenter && 'translate-y-0 opacity-100'
                )}
            >
                {!showPreferenceCenter ? (
                    // Simple Banner View - matching exact design
                    <div className="bg-[#CCCCCC] rounded-t-[5px] px-[18px] py-[5px]">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
                ) : (
                    // Privacy Preference Center - matching exact structure
                    <div className="gdpr-wrapper bg-white border-t border-gray-300 shadow-lg max-h-[90vh] overflow-y-auto">
                        <div className="container mx-auto px-5 md:px-10 py-6 md:py-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-[22px] md:text-[26px] font-bold text-gray-900">
                                    Privacy Preference Center
                                </h2>
                                <button
                                    onClick={handleClosePreferenceCenter}
                                    className="text-gray-500 hover:text-gray-700 transition-colors p-2 text-2xl leading-none"
                                    aria-label="Close preference center"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Options Section */}
                            <div className="mb-6">
                                <h3 className="text-[16px] md:text-[18px] font-semibold text-gray-900 mb-4">
                                    Options
                                </h3>

                                {/* Consent Management */}
                                <CollapsibleSection
                                    title="Consent Management"
                                    isExpanded={expandedCategories.has('consent')}
                                    onToggle={() => toggleCategory('consent')}
                                >
                                    <p className="text-[14px] text-gray-600 mb-4 leading-relaxed">
                                        When you visit any website, it may store or retrieve information on your browser,
                                        mostly in the form of cookies. This information might be about you, your preferences
                                        or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalized web experience.
                                    </p>
                                    <p className="text-[14px] text-gray-600 mb-4 leading-relaxed">
                                        Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to find out more and change our default settings. However, blocking some types of cookies may impact your experience of the site and the services we are able to offer.
                                    </p>
                                    <div className="mb-4">
                                        <a
                                            href="https://bobcares.com/gdpr/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#0073ec] hover:text-[#005bb5] underline underline-offset-2 text-[14px] font-medium transition-colors"
                                        >
                                            Privacy Policy
                                        </a>
                                    </div>
                                    <p className="text-[14px] text-gray-600">
                                        <strong>Required</strong>
                                    </p>
                                    <p className="text-[14px] text-gray-600">
                                        By using this site, you agree to our Privacy Policy.
                                    </p>
                                </CollapsibleSection>

                                {/* Cookie Settings */}
                                <CollapsibleSection
                                    title="Cookie Settings"
                                    isExpanded={expandedCategories.has('settings')}
                                    onToggle={() => toggleCategory('settings')}
                                >
                                    <div className="space-y-6">
                                        {/* Necessary */}
                                        <CookieCategoryDetail
                                            id="necessary"
                                            label="Necessary"
                                            description="Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies."
                                            enabled={preferences.necessary}
                                            onToggle={() => togglePreference('necessary')}
                                            disabled={true}
                                            cookies={[
                                                { name: 'PHPSESSID', description: 'Preserves user session state across page requests.' },
                                                { name: 'gdpr[consent_types]', description: 'Used to store user consents.' },
                                                { name: 'gdpr[allowed_cookies]', description: 'Used to store user allowed cookies.' },
                                            ]}
                                            domains={[
                                                { domain: 'livechat.bobcares.com', cookies: ['PHPSESSID'] },
                                                { domain: 'my.bobcares.com', cookies: ['WHMCSpKDlPzh2chML'] },
                                            ]}
                                        />

                                        {/* Statistics */}
                                        <CookieCategoryDetail
                                            id="statistics"
                                            label="Statistics"
                                            description="Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously."
                                            enabled={preferences.statistics}
                                            onToggle={() => togglePreference('statistics')}
                                            cookies={[
                                                { name: '_ga', description: 'Preserves user session state across page requests.' },
                                                { name: '_gat', description: 'Used by Google Analytics to throttle request rate' },
                                                { name: '_gid', description: 'Registers a unique ID that is used to generate statistical data on how you use the website.' },
                                                { name: 'smartlookCookie', description: 'Used to collect user device and location information of the site visitors to improve the websites User Experience.' },
                                            ]}
                                            domains={[
                                                { domain: 'google.com', cookies: ['_ga', '_gat', '_gid'] },
                                                { domain: 'manager.smartlook.com', cookies: ['smartlookCookie'] },
                                                { domain: 'clarity.microsoft.com', cookies: ['_clck', '_clsk', 'CLID', 'ANONCHK', 'MR', 'MUID', 'SM'] },
                                            ]}
                                        />

                                        {/* Marketing */}
                                        <CookieCategoryDetail
                                            id="marketing"
                                            label="Marketing"
                                            description="Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers."
                                            enabled={preferences.marketing}
                                            onToggle={() => togglePreference('marketing')}
                                            cookies={[
                                                { name: 'IDE', description: 'Used by Google DoubleClick to register and report the website user\'s actions after viewing or clicking one of the advertiser\'s ads with the purpose of measuring the efficacy of an ad and to present targeted ads to the user.' },
                                                { name: 'test_cookie', description: 'Used to check if the user\'s browser supports cookies.' },
                                                { name: '1P_JAR', description: 'Google cookie. These cookies are used to collect website statistics and track conversion rates.' },
                                                { name: 'NID', description: 'Registers a unique ID that identifies a returning user\'s device. The ID is used for serving ads that are most relevant to the user.' },
                                                { name: 'DV', description: 'Google ad personalisation' },
                                            ]}
                                            domains={[
                                                { domain: 'doubleclick.net', cookies: ['IDE', 'test_cookie'] },
                                                { domain: 'google.co.in', cookies: ['1P_JAR', 'NID', 'DV'] },
                                                { domain: 'google.com', cookies: ['NID'] },
                                                { domain: 'olark.com', cookies: ['hblid'] },
                                                { domain: 'rb2b.com', cookies: ['_reb2bgeo', '_reb2bloaded', '_reb2bref', '_reb2bsessionID', '_reb2buid'] },
                                            ]}
                                        />

                                        {/* Security */}
                                        <CookieCategoryDetail
                                            id="security"
                                            label="Security"
                                            description="These are essential site cookies, used by the google reCAPTCHA. These cookies use an unique identifier to verify if a visitor is human or a bot."
                                            enabled={preferences.security}
                                            onToggle={() => togglePreference('security')}
                                            cookies={[
                                                { name: 'SID', description: '' },
                                                { name: 'APISID', description: '' },
                                                { name: 'HSID', description: '' },
                                                { name: 'NID', description: '' },
                                                { name: 'PREF', description: '' },
                                            ]}
                                            domains={[
                                                { domain: 'google.com', cookies: ['SID', 'APISID', 'HSID', 'NID', 'PREF'] },
                                            ]}
                                        />
                                    </div>
                                </CollapsibleSection>

                                {/* Privacy Policy */}
                                <CollapsibleSection
                                    title="Privacy Policy"
                                    isExpanded={expandedCategories.has('policy')}
                                    onToggle={() => toggleCategory('policy')}
                                >
                                    <a
                                        href="https://bobcares.com/gdpr/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#0073ec] hover:text-[#005bb5] underline underline-offset-2 text-[14px] font-medium transition-colors"
                                    >
                                        Privacy Policy
                                    </a>
                                </CollapsibleSection>
                            </div>

                            {/* Action Button */}
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleSavePreferences}
                                    className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-2 rounded text-[14px] md:text-[15px] font-medium transition-colors"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

interface CollapsibleSectionProps {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function CollapsibleSection({ title, isExpanded, onToggle, children }: CollapsibleSectionProps) {
    return (
        <div className="border-b border-gray-200 pb-4 mb-4">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between text-left text-[16px] md:text-[18px] font-semibold text-gray-900 py-2 hover:text-gray-700 transition-colors"
            >
                <span>{title}</span>
                <span className={cn('text-xl transition-transform', isExpanded && 'rotate-180')}>
                    ▼
                </span>
            </button>
            {isExpanded && (
                <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}

interface CookieCategoryDetailProps {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
    disabled?: boolean;
    cookies: Array<{ name: string; description: string }>;
    domains: Array<{ domain: string; cookies: string[] }>;
}

function CookieCategoryDetail({
    id,
    label,
    description,
    enabled,
    onToggle,
    disabled = false,
    cookies,
    domains,
}: CookieCategoryDetailProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border border-gray-200 rounded p-4">
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                    <h4 className="text-[16px] font-semibold text-gray-900 mb-2">{label}</h4>
                    <p className="text-[14px] text-gray-600 leading-relaxed">{description}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[14px] text-gray-600">
                        {enabled ? 'ON' : 'OFF'}
                    </span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        onClick={onToggle}
                        disabled={disabled}
                        className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
                            enabled ? 'bg-gray-700' : 'bg-gray-300',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        <span
                            className={cn(
                                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                                enabled ? 'translate-x-6' : 'translate-x-1'
                            )}
                        />
                    </button>
                </div>
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[14px] text-gray-600 hover:text-gray-800 underline mb-2"
            >
                Cookies Used
            </button>

            {isExpanded && (
                <div className="mt-3 space-y-3 text-[14px]">
                    <div>
                        <p className="font-semibold text-gray-900 mb-1">
                            {cookies.map((c) => c.name).join(', ')}
                        </p>
                    </div>
                    {domains.map((domainInfo, idx) => (
                        <div key={idx} className="border-t border-gray-200 pt-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-gray-700 font-medium">{domainInfo.domain}</span>
                                <button className="text-[#0073ec] hover:text-[#005bb5] underline text-[12px]">
                                    Opt Out
                                </button>
                            </div>
                            <p className="text-gray-600 text-[12px]">
                                {domainInfo.cookies.join(', ')}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
