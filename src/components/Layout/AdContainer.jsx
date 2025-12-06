import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * AdContainer Component
 * 
 * Integrated with Google AdSense
 * 
 * Types:
 * - banner: Horizontal banner (728x90 desktop, 320x50 mobile)
 * - sidebar: Vertical skyscraper (300x600)
 * - ingrid: Native in-grid ad (same size as tool cards)
 * - sticky: Bottom sticky banner for mobile
 */

const AdContainer = ({ type = 'banner', className = '' }) => {
    const adRef = useRef(null);
    const adLoaded = useRef(false);

    const sizeMap = {
        banner: 'h-[90px] w-full max-w-[728px]',
        sidebar: 'w-[300px] h-[600px]',
        ingrid: 'w-full aspect-[4/3]',
        sticky: 'h-[50px] w-full'
    };

    // AdSense slot configuration
    const adConfig = {
        sidebar: {
            slot: '4437585799',
            style: { display: 'inline-block', width: '300px', height: '600px' }
        },
        banner: {
            slot: '',
            style: { display: 'block' },
            format: 'auto',
            responsive: true
        },
        ingrid: {
            slot: '9653419307',
            style: { display: 'block' },
            format: 'auto',
            responsive: true
        },
        sticky: {
            slot: '',
            style: { display: 'block' },
            format: 'auto'
        }
    };

    useEffect(() => {
        if (adConfig[type]?.slot && !adLoaded.current && typeof window !== 'undefined') {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                adLoaded.current = true;
            } catch (err) {
                console.error('AdSense error:', err);
            }
        }
    }, [type]);

    const config = adConfig[type];

    if (!config?.slot) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`ad-container ${sizeMap[type]} ${className}`}
            >
                <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-[var(--text-muted)] text-sm">Ad Space</span>
                    <span className="text-[var(--text-muted)] text-xs opacity-50">{type}</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={adRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`ad-container ${sizeMap[type]} ${className}`}
        >
            <ins
                className="adsbygoogle"
                style={config.style}
                data-ad-client="ca-pub-4591054030401824"
                data-ad-slot={config.slot}
                {...(config.format && { 'data-ad-format': config.format })}
                {...(config.responsive && { 'data-full-width-responsive': 'true' })}
            />
        </motion.div>
    );
};

export default AdContainer;
