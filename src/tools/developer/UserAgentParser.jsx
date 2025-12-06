import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Globe, Cpu, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const UserAgentParser = () => {
    const [userAgent, setUserAgent] = useState('');
    const [parsed, setParsed] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        setUserAgent(navigator.userAgent);
        parseUserAgent(navigator.userAgent);
    }, []);

    const parseUserAgent = (ua) => {
        const browser = detectBrowser(ua);
        const os = detectOS(ua);
        const device = detectDevice(ua);

        setParsed({
            browser,
            os,
            device,
            raw: ua
        });
    };

    const detectBrowser = (ua) => {
        const browsers = [
            { name: 'Edge', regex: /Edg\/(\d+)/ },
            { name: 'Chrome', regex: /Chrome\/(\d+)/ },
            { name: 'Firefox', regex: /Firefox\/(\d+)/ },
            { name: 'Safari', regex: /Version\/(\d+).*Safari/ },
            { name: 'Opera', regex: /OPR\/(\d+)/ },
            { name: 'IE', regex: /MSIE (\d+)|Trident.*rv:(\d+)/ }
        ];

        for (const b of browsers) {
            const match = ua.match(b.regex);
            if (match) {
                return { name: b.name, version: match[1] || match[2] };
            }
        }
        return { name: 'Unknown', version: 'N/A' };
    };

    const detectOS = (ua) => {
        const systems = [
            { name: 'Windows 11', regex: /Windows NT 10.*Win64/ },
            { name: 'Windows 10', regex: /Windows NT 10/ },
            { name: 'Windows 8.1', regex: /Windows NT 6.3/ },
            { name: 'Windows 8', regex: /Windows NT 6.2/ },
            { name: 'Windows 7', regex: /Windows NT 6.1/ },
            { name: 'macOS', regex: /Mac OS X (\d+[._]\d+)/ },
            { name: 'iOS', regex: /iPhone OS (\d+_\d+)|iPad.*OS (\d+_\d+)/ },
            { name: 'Android', regex: /Android (\d+\.?\d*)/ },
            { name: 'Linux', regex: /Linux/ },
            { name: 'Chrome OS', regex: /CrOS/ }
        ];

        for (const s of systems) {
            const match = ua.match(s.regex);
            if (match) {
                const version = match[1] || match[2] || '';
                return { name: s.name, version: version.replace(/_/g, '.') };
            }
        }
        return { name: 'Unknown', version: 'N/A' };
    };

    const detectDevice = (ua) => {
        if (/Mobile|Android.*Mobile|iPhone|iPod/.test(ua)) {
            return { type: 'Mobile', icon: Smartphone };
        }
        if (/iPad|Android(?!.*Mobile)|Tablet/.test(ua)) {
            return { type: 'Tablet', icon: Monitor };
        }
        return { type: 'Desktop', icon: Monitor };
    };

    const handleUAChange = (e) => {
        const ua = e.target.value;
        setUserAgent(ua);
        if (ua.trim()) {
            parseUserAgent(ua);
        }
    };

    const resetToCurrentUA = () => {
        setUserAgent(navigator.userAgent);
        parseUserAgent(navigator.userAgent);
    };

    const copyUA = () => {
        navigator.clipboard.writeText(userAgent);
        toast.success('User Agent copied');
    };

    const DeviceIcon = parsed?.device?.icon || Monitor;

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                        User Agent String
                    </label>
                    <button onClick={resetToCurrentUA} className="text-xs text-blue-400 hover:underline">
                        Reset to Current
                    </button>
                </div>
                <div className="relative">
                    <textarea
                        value={userAgent}
                        onChange={handleUAChange}
                        className="textarea-field !min-h-[80px] font-mono text-sm pr-12"
                        placeholder="Paste a user agent string to parse..."
                    />
                    <button
                        onClick={copyUA}
                        className="absolute right-2 top-2 p-2 hover:bg-[var(--bg-tertiary)] rounded"
                    >
                        <Copy size={16} />
                    </button>
                </div>
            </div>

            {parsed && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-6 bg-[var(--bg-tertiary)] rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <Globe size={24} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--text-muted)]">Browser</p>
                                <p className="text-xl font-bold">{parsed.browser.name}</p>
                            </div>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Version: <span className="font-mono">{parsed.browser.version}</span>
                        </p>
                    </div>

                    <div className="p-6 bg-[var(--bg-tertiary)] rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <Cpu size={24} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--text-muted)]">Operating System</p>
                                <p className="text-xl font-bold">{parsed.os.name}</p>
                            </div>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Version: <span className="font-mono">{parsed.os.version || 'N/A'}</span>
                        </p>
                    </div>

                    <div className="p-6 bg-[var(--bg-tertiary)] rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <DeviceIcon size={24} className="text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--text-muted)]">Device Type</p>
                                <p className="text-xl font-bold">{parsed.device.type}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                <h4 className="font-medium mb-3">Additional Info</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-[var(--text-muted)]">Platform</p>
                        <p className="font-mono">{navigator.platform}</p>
                    </div>
                    <div>
                        <p className="text-[var(--text-muted)]">Language</p>
                        <p className="font-mono">{navigator.language}</p>
                    </div>
                    <div>
                        <p className="text-[var(--text-muted)]">Cookies Enabled</p>
                        <p className="font-mono">{navigator.cookieEnabled ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                        <p className="text-[var(--text-muted)]">Do Not Track</p>
                        <p className="font-mono">{navigator.doNotTrack || 'Not set'}</p>
                    </div>
                    <div>
                        <p className="text-[var(--text-muted)]">Online Status</p>
                        <p className="font-mono">{navigator.onLine ? 'Online' : 'Offline'}</p>
                    </div>
                    <div>
                        <p className="text-[var(--text-muted)]">Hardware Concurrency</p>
                        <p className="font-mono">{navigator.hardwareConcurrency || 'N/A'} cores</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAgentParser;
