'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { GlobalScrollbar } from 'mac-scrollbar';
import 'mac-scrollbar/dist/mac-scrollbar.css';

// Store Lenis instance globally so it can be accessed from other components
declare global {
    interface Window {
        lenis?: Lenis;
    }
}

export default function SmoothScroll() {
    useEffect(() => {
        // Initialize Lenis for smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        // Store instance globally
        window.lenis = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            window.lenis = undefined;
        };
    }, []);

    // GlobalScrollbar component applies Mac-style scrollbar to body
    // It works alongside Lenis without interfering with smooth scrolling
    return <GlobalScrollbar />;
}

