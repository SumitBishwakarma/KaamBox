import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AdContainer Component
 * 
 * Adsterra Ads Integration:
 * - Banner (728x90): For header and in-grid ads
 * - Native Banner: For sidebar only (only works once per page)
 * - Social Bar: For mobile sticky footer
 */

let adInstanceCounter = 0;

const AdContainer = ({ type = 'banner', className = '' }) => {
    const adRef = useRef(null);
    const adLoaded = useRef(false);
    const [instanceId] = useState(() => ++adInstanceCounter);

    const sizeMap = {
        banner: 'min-h-[90px] w-full max-w-[728px]',
        native: 'w-full min-h-[200px]',
        sidebar: 'w-full min-h-[250px]',
        ingrid: 'w-full min-h-[100px]',
        sticky: 'min-h-[50px] w-full',
        socialbar: 'min-h-[50px] w-full'
    };

    // Ad configurations
    const bannerKey = '519e011b12e0cc6fa27b8789d7392c40';
    const nativeKey = '2b7d591f67e0fd4183ea4a0ecde7453b';
    const socialBarSrc = '//pl28206404.effectivegatecpm.com/37/53/79/375379009c3c38417f9731725ff53509.js';

    // Determine which ad type to use
    const getAdType = () => {
        if (type === 'sidebar') return 'native';
        if (type === 'ingrid') return 'banner';
        if (type === 'sticky' || type === 'socialbar') return 'socialbar';
        return 'banner';
    };

    const adType = getAdType();

    useEffect(() => {
        if (adLoaded.current || !adRef.current) return;

        const timer = setTimeout(() => {
            try {
                if (adType === 'native') {
                    // Native Banner Ad - only for sidebar
                    const container = document.createElement('div');
                    container.id = `container-${nativeKey}`;

                    // Also inject the script for native
                    const script = document.createElement('script');
                    script.async = true;
                    script.setAttribute('data-cfasync', 'false');
                    script.src = `//pl28206264.effectivegatecpm.com/${nativeKey}/invoke.js`;

                    if (adRef.current) {
                        adRef.current.appendChild(script);
                        adRef.current.appendChild(container);
                    }
                } else if (adType === 'socialbar') {
                    // Social Bar Ad
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = socialBarSrc;
                    script.async = true;

                    if (adRef.current) {
                        adRef.current.appendChild(script);
                    }
                } else {
                    // Banner Ad (728x90) - for header and in-grid
                    const optionsScript = document.createElement('script');
                    optionsScript.type = 'text/javascript';
                    optionsScript.text = `
                        atOptions = {
                            'key' : '${bannerKey}',
                            'format' : 'iframe',
                            'height' : 90,
                            'width' : 728,
                            'params' : {}
                        };
                    `;

                    const invokeScript = document.createElement('script');
                    invokeScript.type = 'text/javascript';
                    invokeScript.src = `//www.highperformanceformat.com/${bannerKey}/invoke.js`;
                    invokeScript.async = true;

                    if (adRef.current) {
                        adRef.current.appendChild(optionsScript);
                        adRef.current.appendChild(invokeScript);
                    }
                }

                adLoaded.current = true;
            } catch (err) {
                console.error('Ad load error:', err);
            }
        }, instanceId * 150);

        return () => {
            clearTimeout(timer);
        };
    }, [adType, instanceId]);

    return (
        <motion.div
            ref={adRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`ad-container ${sizeMap[type]} ${className} flex items-center justify-center overflow-hidden`}
        />
    );
};

export default AdContainer;
