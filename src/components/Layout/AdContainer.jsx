import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AdContainer Component
 * 
 * Google AdSense Integration
 * Publisher ID: ca-pub-4591054030401824
 */

let adInstanceCounter = 0;

const AdContainer = ({ type = 'banner', className = '' }) => {
    const adRef = useRef(null);
    const adLoaded = useRef(false);
    const [instanceId] = useState(() => ++adInstanceCounter);

    const sizeMap = {
        banner: 'min-h-[90px] w-full max-w-[728px]',
        sidebar: 'w-[300px] min-h-[250px]',
        ingrid: 'w-full min-h-[100px]',
        sticky: 'min-h-[50px] w-full'
    };

    // AdSense configurations for different placements
    const adConfig = {
        banner: {
            style: { display: 'block' },
            format: 'auto',
            responsive: true
        },
        sidebar: {
            style: { display: 'inline-block', width: '300px', height: '250px' }
        },
        ingrid: {
            style: { display: 'block' },
            format: 'fluid',
            layoutKey: '-fb+5w+4e-db+86'
        },
        sticky: {
            style: { display: 'inline-block', width: '320px', height: '50px' }
        }
    };

    useEffect(() => {
        if (adLoaded.current || !adRef.current) return;

        const timer = setTimeout(() => {
            try {
                const config = adConfig[type] || adConfig.banner;

                // Create AdSense ad unit
                const ins = document.createElement('ins');
                ins.className = 'adsbygoogle';
                ins.style.cssText = Object.entries(config.style)
                    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`)
                    .join(';');
                ins.setAttribute('data-ad-client', 'ca-pub-4591054030401824');
                ins.setAttribute('data-ad-slot', 'auto');

                if (config.format) {
                    ins.setAttribute('data-ad-format', config.format);
                }
                if (config.responsive) {
                    ins.setAttribute('data-full-width-responsive', 'true');
                }
                if (config.layoutKey) {
                    ins.setAttribute('data-ad-layout-key', config.layoutKey);
                }

                if (adRef.current) {
                    adRef.current.appendChild(ins);

                    // Push ad
                    try {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                    } catch (e) {
                        console.error('AdSense push error:', e);
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
    }, [type, instanceId]);

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
