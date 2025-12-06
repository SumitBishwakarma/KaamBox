import { useState } from 'react';
import { Download, Youtube, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const YoutubeThumbnail = () => {
    const [url, setUrl] = useState('');
    const [videoId, setVideoId] = useState('');
    const [thumbnails, setThumbnails] = useState([]);
    const { toast } = useToast();

    const extractVideoId = (input) => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^#&?]*)/,
            /^[a-zA-Z0-9_-]{11}$/
        ];

        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match) return match[1] || match[0];
        }
        return null;
    };

    const getThumbnails = () => {
        const id = extractVideoId(url.trim());
        if (!id) {
            toast.error('Invalid YouTube URL or Video ID');
            return;
        }

        setVideoId(id);
        setThumbnails([
            { name: 'Max Resolution', quality: 'maxresdefault', size: '1280x720' },
            { name: 'Standard Definition', quality: 'sddefault', size: '640x480' },
            { name: 'High Quality', quality: 'hqdefault', size: '480x360' },
            { name: 'Medium Quality', quality: 'mqdefault', size: '320x180' },
            { name: 'Default', quality: 'default', size: '120x90' }
        ]);
        toast.success('Thumbnails loaded');
    };

    const getThumbnailUrl = (quality) => {
        return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    };

    const downloadThumbnail = async (quality, name) => {
        try {
            const response = await fetch(getThumbnailUrl(quality));
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `youtube-thumbnail-${videoId}-${quality}.jpg`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success(`Downloaded ${name}`);
        } catch (err) {
            toast.error('Failed to download. Try opening in new tab.');
        }
    };

    const copyUrl = (quality) => {
        navigator.clipboard.writeText(getThumbnailUrl(quality));
        toast.success('URL copied to clipboard');
    };

    const openInNewTab = (quality) => {
        window.open(getThumbnailUrl(quality), '_blank');
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    YouTube Video URL or ID
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        className="input-field flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && getThumbnails()}
                    />
                    <button onClick={getThumbnails} className="btn-primary">
                        <Youtube size={18} />
                        Get Thumbnails
                    </button>
                </div>
            </div>

            {videoId && thumbnails.length > 0 && (
                <div className="space-y-4">
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                        <p className="text-sm text-[var(--text-muted)]">Video ID: <span className="font-mono text-blue-400">{videoId}</span></p>
                    </div>

                    <div className="grid gap-4">
                        {thumbnails.map((thumb) => (
                            <div key={thumb.quality} className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="sm:w-48 flex-shrink-0">
                                        <img
                                            src={getThumbnailUrl(thumb.quality)}
                                            alt={thumb.name}
                                            className="w-full rounded-lg"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium mb-1">{thumb.name}</h3>
                                        <p className="text-sm text-[var(--text-muted)] mb-3">{thumb.size}</p>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => downloadThumbnail(thumb.quality, thumb.name)}
                                                className="btn-primary !py-1.5 !px-3 text-sm"
                                            >
                                                <Download size={14} />
                                                Download
                                            </button>
                                            <button
                                                onClick={() => copyUrl(thumb.quality)}
                                                className="btn-secondary !py-1.5 !px-3 text-sm"
                                            >
                                                <Copy size={14} />
                                                Copy URL
                                            </button>
                                            <button
                                                onClick={() => openInNewTab(thumb.quality)}
                                                className="btn-secondary !py-1.5 !px-3 text-sm"
                                            >
                                                <ExternalLink size={14} />
                                                Open
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium mb-2">Supported URL Formats</h4>
                <ul className="text-sm text-[var(--text-secondary)] space-y-1 font-mono">
                    <li>• youtube.com/watch?v=VIDEO_ID</li>
                    <li>• youtu.be/VIDEO_ID</li>
                    <li>• youtube.com/embed/VIDEO_ID</li>
                    <li>• Just the 11-character Video ID</li>
                </ul>
            </div>
        </div>
    );
};

export default YoutubeThumbnail;
