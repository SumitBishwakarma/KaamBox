import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ScreenResolution = () => {
    const [screenInfo, setScreenInfo] = useState({});
    const { toast } = useToast();

    const updateScreenInfo = () => {
        setScreenInfo({
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
            devicePixelRatio: window.devicePixelRatio,
            orientation: window.screen.orientation?.type || 'N/A'
        });
    };

    useEffect(() => {
        updateScreenInfo();
        window.addEventListener('resize', updateScreenInfo);
        return () => window.removeEventListener('resize', updateScreenInfo);
    }, []);

    const getDeviceType = () => {
        const width = screenInfo.viewportWidth;
        if (width <= 480) return { type: 'Mobile', icon: Smartphone, color: 'text-green-400' };
        if (width <= 768) return { type: 'Tablet', icon: Tablet, color: 'text-yellow-400' };
        return { type: 'Desktop', icon: Monitor, color: 'text-blue-400' };
    };

    const device = getDeviceType();
    const DeviceIcon = device.icon;

    const copyInfo = () => {
        const text = `Screen: ${screenInfo.screenWidth}x${screenInfo.screenHeight}
Viewport: ${screenInfo.viewportWidth}x${screenInfo.viewportHeight}
Pixel Ratio: ${screenInfo.devicePixelRatio}
Color Depth: ${screenInfo.colorDepth}-bit`;
        navigator.clipboard.writeText(text);
        toast.success('Screen info copied');
    };

    const commonResolutions = [
        { name: 'HD', width: 1280, height: 720 },
        { name: 'Full HD', width: 1920, height: 1080 },
        { name: 'QHD', width: 2560, height: 1440 },
        { name: '4K UHD', width: 3840, height: 2160 },
        { name: 'iPhone 14', width: 390, height: 844 },
        { name: 'iPad', width: 768, height: 1024 }
    ];

    return (
        <div className="space-y-6">
            <div className="text-center p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                <DeviceIcon size={48} className={`mx-auto mb-4 ${device.color}`} />
                <p className="text-sm text-[var(--text-muted)] mb-2">Your Device</p>
                <p className="text-4xl font-bold mb-2">
                    {screenInfo.viewportWidth} × {screenInfo.viewportHeight}
                </p>
                <p className={`text-lg ${device.color}`}>{device.type}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                    <p className="text-2xl font-bold text-blue-400">{screenInfo.screenWidth}</p>
                    <p className="text-sm text-[var(--text-muted)]">Screen Width</p>
                </div>
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                    <p className="text-2xl font-bold text-purple-400">{screenInfo.screenHeight}</p>
                    <p className="text-sm text-[var(--text-muted)]">Screen Height</p>
                </div>
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-400">{screenInfo.devicePixelRatio}x</p>
                    <p className="text-sm text-[var(--text-muted)]">Pixel Ratio</p>
                </div>
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                    <p className="text-2xl font-bold text-orange-400">{screenInfo.colorDepth}bit</p>
                    <p className="text-sm text-[var(--text-muted)]">Color Depth</p>
                </div>
            </div>

            <div className="flex gap-3 justify-center">
                <button onClick={updateScreenInfo} className="btn-secondary">
                    <RefreshCw size={18} />
                    Refresh
                </button>
                <button onClick={copyInfo} className="btn-secondary">
                    <Copy size={18} />
                    Copy Info
                </button>
            </div>

            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                <h4 className="font-medium mb-4">Detailed Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-[var(--text-muted)]">Full Screen Resolution</p>
                        <p className="font-mono">{screenInfo.screenWidth} × {screenInfo.screenHeight}</p>
                    </div>
                    <div>
                        <p className="text-[var(--text-muted)]">Available Screen</p>
                        <p className="font-mono">{screenInfo.availWidth} × {screenInfo.availHeight}</p>
                    </div>
                    <div>
                        <p className="text-[var(--text-muted)]">Browser Viewport</p>
                        <p className="font-mono">{screenInfo.viewportWidth} × {screenInfo.viewportHeight}</p>
                    </div>
                    <div>
                        <p className="text-[var(--text-muted)]">Orientation</p>
                        <p className="font-mono">{screenInfo.orientation}</p>
                    </div>
                    <div>
                        <p className="text-[var(--text-muted)]">Physical Pixels</p>
                        <p className="font-mono">{Math.round(screenInfo.viewportWidth * screenInfo.devicePixelRatio)} × {Math.round(screenInfo.viewportHeight * screenInfo.devicePixelRatio)}</p>
                    </div>
                    <div>
                        <p className="text-[var(--text-muted)]">Pixel Depth</p>
                        <p className="font-mono">{screenInfo.pixelDepth} bits</p>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-3">Common Resolutions Comparison</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {commonResolutions.map((res) => (
                        <div
                            key={res.name}
                            className={`p-3 rounded-lg ${screenInfo.viewportWidth === res.width && screenInfo.viewportHeight === res.height
                                    ? 'bg-green-500/20 border border-green-500'
                                    : 'bg-[var(--bg-tertiary)]'
                                }`}
                        >
                            <p className="font-medium text-sm">{res.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{res.width} × {res.height}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScreenResolution;
