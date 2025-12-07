import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AdContainer Component
 * 
 * Integrated with Adsterra Banner Ad (728x90)
 * Using banner ad for all placements since native has single instance limitation
 */

// Generate unique ID for each ad instance
let adInstanceCounter = 0;

const AdContainer = ({ type = 'banner', className = '' }) => {
    const adRef = useRef(null);
    const adLoaded = useRef(false);
    const [instanceId] = useState(() => ++adInstanceCounter);

    const sizeMap = {
        banner: 'min-h-[90px] w-full max-w-[728px]',
        native: 'w-full min-h-[100px]',
        sidebar: 'w-full min-h-[100px]',
        ingrid: 'w-full min-h-[100px]',
        sticky: 'min-h-[90px] w-full max-w-[728px]'
    };

    // Using Banner ad for all placements
    const adKey = '519e011b12e0cc6fa27b8789d7392c40';

    useEffect(() => {
        if (adLoaded.current || !adRef.current) return;

        // Small delay to avoid duplicate loading
        const timer = setTimeout(() => {
            try {
                // Create unique options for this instance
                const optionsScript = document.createElement('script');
                optionsScript.type = 'text/javascript';
                optionsScript.text = `
                    var atOptions_${instanceId} = {
                        'key' : '${adKey}',
                        'format' : 'iframe',
                        'height' : 90,
                        'width' : 728,
                        'params' : {}
                    };
                    atOptions = atOptions_${instanceId};
                `;

                const invokeScript = document.createElement('script');
                invokeScript.type = 'text/javascript';
                invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
                invokeScript.async = true;

                if (adRef.current) {
                    adRef.current.appendChild(optionsScript);
                    adRef.current.appendChild(invokeScript);
                }

                adLoaded.current = true;
            } catch (err) {
                console.error('Ad load error:', err);
            }
        }, instanceId * 200); // Stagger loading to avoid conflicts

        return () => {
            clearTimeout(timer);
        };
    }, [instanceId]);

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
