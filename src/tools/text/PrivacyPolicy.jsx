import { useState } from 'react';
import { Copy, FileText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const PrivacyPolicy = () => {
    const [formData, setFormData] = useState({
        websiteName: '',
        websiteUrl: '',
        email: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        collectsEmail: true,
        collectsName: true,
        collectsAnalytics: true,
        usesCookies: true,
        hasThirdPartyServices: true
    });
    const { toast } = useToast();

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const generatePolicy = () => {
        const { websiteName, websiteUrl, email, effectiveDate, collectsEmail, collectsName, collectsAnalytics, usesCookies, hasThirdPartyServices } = formData;
        const name = websiteName || '[Website Name]';
        const url = websiteUrl || '[Website URL]';
        const contactEmail = email || '[contact@email.com]';

        return `# Privacy Policy for ${name}

**Effective Date:** ${effectiveDate}

## Introduction

Welcome to ${name}. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit ${url}.

## Information We Collect

${collectsName || collectsEmail ? `### Personal Information
When you use our services, we may collect:
${collectsName ? '- Name' : ''}
${collectsEmail ? '- Email address' : ''}
` : ''}

${collectsAnalytics ? `### Usage Data
We automatically collect certain information when you visit our website, including:
- IP address
- Browser type and version
- Pages visited
- Time and date of visit
- Time spent on pages
` : ''}

${usesCookies ? `## Cookies

We use cookies and similar tracking technologies to enhance your experience. Cookies are small files stored on your device that help us:
- Remember your preferences
- Understand how you use our website
- Improve our services

You can control cookies through your browser settings.
` : ''}

## How We Use Your Information

We use the collected information for:
- Providing and maintaining our services
- Notifying you about changes to our services
- Providing customer support
- Analyzing usage to improve our services
- Communicating with you about updates and offers

${hasThirdPartyServices ? `## Third-Party Services

We may use third-party services that collect, monitor, and analyze data:
- Google Analytics for website analytics
- Payment processors for transactions
- Email service providers for communications

These third parties have their own privacy policies.
` : ''}

## Data Security

We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.

## Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Object to data processing
- Data portability

## Children's Privacy

Our services are not intended for children under 13. We do not knowingly collect personal information from children.

## Changes to This Policy

We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.

## Contact Us

If you have questions about this privacy policy, please contact us:
- Email: ${contactEmail}
- Website: ${url}

---
*This privacy policy was generated using KaamBox Privacy Policy Generator.*`;
    };

    const policy = generatePolicy();

    const copyPolicy = () => {
        navigator.clipboard.writeText(policy);
        toast.success('Privacy policy copied to clipboard');
    };

    const downloadPolicy = () => {
        const blob = new Blob([policy], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'privacy-policy.md';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Privacy policy downloaded');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Website Name
                    </label>
                    <input
                        type="text"
                        value={formData.websiteName}
                        onChange={(e) => updateField('websiteName', e.target.value)}
                        placeholder="e.g., KaamBox"
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Website URL
                    </label>
                    <input
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => updateField('websiteUrl', e.target.value)}
                        placeholder="e.g., https://kaambox.online"
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Contact Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="e.g., contact@kaambox.online"
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Effective Date
                    </label>
                    <input
                        type="date"
                        value={formData.effectiveDate}
                        onChange={(e) => updateField('effectiveDate', e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>

            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                <h4 className="font-medium mb-3">Data Collection Options</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                        { key: 'collectsName', label: 'Collect Names' },
                        { key: 'collectsEmail', label: 'Collect Emails' },
                        { key: 'collectsAnalytics', label: 'Use Analytics' },
                        { key: 'usesCookies', label: 'Use Cookies' },
                        { key: 'hasThirdPartyServices', label: 'Third-Party Services' }
                    ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData[key]}
                                onChange={(e) => updateField(key, e.target.checked)}
                                className="w-4 h-4 accent-blue-500"
                            />
                            <span className="text-sm">{label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={copyPolicy} className="btn-primary">
                    <Copy size={18} />
                    Copy Policy
                </button>
                <button onClick={downloadPolicy} className="btn-secondary">
                    <FileText size={18} />
                    Download .md
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Generated Privacy Policy (Markdown)
                </label>
                <textarea
                    value={policy}
                    readOnly
                    className="textarea-field !min-h-[400px] font-mono text-sm"
                />
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <p className="text-yellow-400 text-sm">
                    ⚠️ This is a template. Please review and customize it according to your specific needs and consult a legal professional for compliance.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
