import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AdContainer Component
 * 
 * Adsterra Ads Integration:
 * - Banner (728x90): Uses inline script
 * - Native: Uses global script + container div
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
        ingrid: 'w-full min-h-[200px]',
        sticky: 'min-h-[90px] w-full max-w-[728px]'
    };

    // Ad configurations
    const bannerKey = '519e011b12e0cc6fa27b8789d7392c40';
    const nativeKey = '2b7d591f67e0fd4183ea4a0ecde7453b';

    // Which ad type to use
    const useNative = type === 'sidebar' || type === 'ingrid' || type === 'native';

    useEffect(() => {
        if (adLoaded.current || !adRef.current) return;

        const timer = setTimeout(() => {
            try {
                if (useNative) {
                    // Native Banner Ad - just create container div
                    // Script is already loaded globally in index.html
                    const container = document.createElement('div');
                    container.id = `container-${nativeKey}`;

                    if (adRef.current) {
                        adRef.current.appendChild(container);
                    }
                } else {
                    // Banner Ad (728x90)
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
        }, instanceId * 100);

        return () => {
            clearTimeout(timer);
        };
    }, [useNative, instanceId]);

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
