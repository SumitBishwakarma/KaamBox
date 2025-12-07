import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AdContainer Component
 * 
 * Integrated with Adsterra Ads
 * 
 * Types:
 * - banner: Horizontal banner (728x90)
 * - native: Native Banner ad
 * - sidebar: Sidebar ad (uses native)
 * - ingrid: In-grid ad (uses native)
 */

// Generate unique ID for each ad instance
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
        sticky: 'h-[90px] w-full max-w-[728px]'
    };

    // Adsterra ad configurations
    const adConfig = {
        banner: {
            type: 'banner',
            key: '519e011b12e0cc6fa27b8789d7392c40',
            width: 728,
            height: 90
        },
        native: {
            type: 'native',
            key: '2b7d591f67e0fd4183ea4a0ecde7453b',
            src: '//pl28206264.effectivegatecpm.com/2b7d591f67e0fd4183ea4a0ecde7453b/invoke.js'
        },
        sidebar: {
            type: 'native',
            key: '2b7d591f67e0fd4183ea4a0ecde7453b',
            src: '//pl28206264.effectivegatecpm.com/2b7d591f67e0fd4183ea4a0ecde7453b/invoke.js'
        },
        ingrid: {
            type: 'native',
            key: '2b7d591f67e0fd4183ea4a0ecde7453b',
            src: '//pl28206264.effectivegatecpm.com/2b7d591f67e0fd4183ea4a0ecde7453b/invoke.js'
        },
        sticky: {
            type: 'banner',
            key: '519e011b12e0cc6fa27b8789d7392c40',
            width: 728,
            height: 90
        }
    };

    useEffect(() => {
        if (adLoaded.current || !adRef.current) return;

        const config = adConfig[type];
        if (!config) return;

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            if (config.type === 'banner') {
                // Banner Ad (728x90)
                const optionsScript = document.createElement('script');
                optionsScript.type = 'text/javascript';
                optionsScript.text = `
                    atOptions = {
                        'key' : '${config.key}',
                        'format' : 'iframe',
                        'height' : ${config.height},
                        'width' : ${config.width},
                        'params' : {}
                    };
                `;

                const invokeScript = document.createElement('script');
                invokeScript.type = 'text/javascript';
                invokeScript.src = `//www.highperformanceformat.com/${config.key}/invoke.js`;
                invokeScript.async = true;

                if (adRef.current) {
                    adRef.current.appendChild(optionsScript);
                    adRef.current.appendChild(invokeScript);
                }
            } else if (config.type === 'native') {
                // Native Banner Ad - each instance gets unique container ID
                const uniqueContainerId = `container-${config.key}-${instanceId}`;

                const container = document.createElement('div');
                container.id = uniqueContainerId;

                const invokeScript = document.createElement('script');
                invokeScript.async = true;
                invokeScript.setAttribute('data-cfasync', 'false');
                invokeScript.src = config.src;

                if (adRef.current) {
                    adRef.current.appendChild(container);
                    adRef.current.appendChild(invokeScript);
                }
            }

            adLoaded.current = true;
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [type, instanceId]);

    const config = adConfig[type];

    if (!config) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`ad-container ${sizeMap[type] || ''} ${className}`}
            >
                <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-[var(--text-muted)] text-sm">Ad Space</span>
                </div>
            </motion.div>
        );
    }

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
