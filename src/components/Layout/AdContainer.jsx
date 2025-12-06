import { motion } from 'framer-motion';

/**
 * AdContainer Component
 * 
 * Placeholder for ad integration. Replace the inner content with actual
 * ad network code (Google AdSense, Adsterra, etc.)
 * 
 * Types:
 * - banner: Horizontal banner (728x90 desktop, 320x50 mobile)
 * - sidebar: Vertical skyscraper (160x600 or 300x600)
 * - ingrid: Native in-grid ad (same size as tool cards)
 * - sticky: Bottom sticky banner for mobile
 */

const AdContainer = ({ type = 'banner', className = '' }) => {
    const sizeMap = {
        banner: 'h-[90px] w-full max-w-[728px]',
        sidebar: 'w-[300px] h-[600px]',
        ingrid: 'w-full aspect-[4/3]',
        sticky: 'h-[50px] w-full'
    };

    const labelMap = {
        banner: 'Ad Banner 728x90',
        sidebar: 'Ad Sidebar 300x600',
        ingrid: 'Native Ad',
        sticky: 'Sticky Ad'
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`ad-container ${sizeMap[type]} ${className}`}
        >
            {/* 
        INTEGRATION INSTRUCTIONS:
        ========================
        Replace this placeholder with your ad network code.
        
        For Google AdSense:
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-XXXXXXXX"
             data-ad-slot="XXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true">
        </ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        
        For Adsterra:
        <script type="text/javascript" src="//www.topcreativeformat.com/xxxxx/invoke.js"></script>
      */}
            <div className="flex flex-col items-center justify-center h-full">
                <span className="text-[var(--text-muted)] text-sm">{labelMap[type]}</span>
                <span className="text-[var(--text-muted)] text-xs opacity-50">Ad Placeholder</span>
            </div>
        </motion.div>
    );
};

export default AdContainer;
