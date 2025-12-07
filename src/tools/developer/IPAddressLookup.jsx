import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Copy, Check, RefreshCw } from 'lucide-react';

const IPAddressLookup = () => {
    const [ip, setIp] = useState('');
    const [myIp, setMyIp] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchMyIP();
    }, []);

    const fetchMyIP = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            setMyIp(data.ip);
        } catch (e) {
            console.error('Failed to fetch IP:', e);
        }
    };

    const lookupIP = async () => {
        const targetIp = ip.trim() || myIp;
        if (!targetIp) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch(`https://ipapi.co/${targetIp}/json/`);
            const data = await response.json();

            if (data.error) {
                setError(data.reason || 'Invalid IP address');
            } else {
                setResult(data);
            }
        } catch (e) {
            setError('Failed to lookup IP. Please try again.');
        }

        setLoading(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">IP Address Lookup</h2>
                <p className="text-[var(--text-muted)] text-sm">Get geolocation information for any IP</p>
            </div>

            <div className="space-y-4">
                {myIp && (
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Your IP Address</p>
                            <p className="font-mono font-bold">{myIp}</p>
                        </div>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => copyToClipboard(myIp)}
                                className="p-2 rounded-lg bg-[var(--bg-secondary)]"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { setIp(myIp); lookupIP(); }}
                                className="p-2 rounded-lg bg-[var(--bg-secondary)]"
                            >
                                <Globe className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder="Enter IP address (or leave empty for your IP)"
                        className="input flex-1 font-mono"
                        onKeyPress={(e) => e.key === 'Enter' && lookupIP()}
                    />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={lookupIP}
                        disabled={loading}
                        className="btn-primary px-6"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                    </motion.button>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl text-center">
                            <MapPin className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-xl font-bold">
                                {result.city}, {result.region}
                            </p>
                            <p className="text-[var(--text-muted)]">{result.country_name}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'IP Address', value: result.ip },
                                { label: 'Country', value: `${result.country_name} ${result.country_emoji || ''}` },
                                { label: 'Region', value: result.region },
                                { label: 'City', value: result.city },
                                { label: 'Postal Code', value: result.postal || 'N/A' },
                                { label: 'Timezone', value: result.timezone },
                                { label: 'ISP', value: result.org || 'N/A' },
                                { label: 'Coordinates', value: `${result.latitude}, ${result.longitude}` }
                            ].map(item => (
                                <div key={item.label} className="p-3 bg-[var(--bg-tertiary)] rounded-xl">
                                    <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
                                    <p className="font-medium text-sm truncate">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {result.latitude && result.longitude && (
                            <a
                                href={`https://www.google.com/maps?q=${result.latitude},${result.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 bg-[var(--bg-tertiary)] rounded-xl text-center hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                <MapPin className="w-5 h-5 mx-auto mb-1" />
                                <p className="text-sm">View on Google Maps</p>
                            </a>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default IPAddressLookup;
