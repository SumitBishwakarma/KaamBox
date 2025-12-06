import { useState, useMemo } from 'react';
import { Calendar, Cake, Clock } from 'lucide-react';

const AgeCalculator = () => {
    const [birthDate, setBirthDate] = useState('');
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

    const result = useMemo(() => {
        if (!birthDate) return null;

        const birth = new Date(birthDate);
        const today = new Date(toDate);

        if (birth > today) return { error: 'Birth date cannot be in the future' };

        // Calculate years, months, days
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Total calculations
        const diffTime = Math.abs(today - birth);
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const totalSeconds = totalMinutes * 60;

        // Next birthday
        let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
        if (nextBirthday <= today) {
            nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
        }
        const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

        // Day of week born
        const dayOfWeek = birth.toLocaleDateString('en-US', { weekday: 'long' });

        // Zodiac sign
        const zodiacSigns = [
            { sign: 'Capricorn', start: [12, 22], end: [1, 19], emoji: '♑' },
            { sign: 'Aquarius', start: [1, 20], end: [2, 18], emoji: '♒' },
            { sign: 'Pisces', start: [2, 19], end: [3, 20], emoji: '♓' },
            { sign: 'Aries', start: [3, 21], end: [4, 19], emoji: '♈' },
            { sign: 'Taurus', start: [4, 20], end: [5, 20], emoji: '♉' },
            { sign: 'Gemini', start: [5, 21], end: [6, 20], emoji: '♊' },
            { sign: 'Cancer', start: [6, 21], end: [7, 22], emoji: '♋' },
            { sign: 'Leo', start: [7, 23], end: [8, 22], emoji: '♌' },
            { sign: 'Virgo', start: [8, 23], end: [9, 22], emoji: '♍' },
            { sign: 'Libra', start: [9, 23], end: [10, 22], emoji: '♎' },
            { sign: 'Scorpio', start: [10, 23], end: [11, 21], emoji: '♏' },
            { sign: 'Sagittarius', start: [11, 22], end: [12, 21], emoji: '♐' }
        ];

        const month = birth.getMonth() + 1;
        const day = birth.getDate();
        let zodiac = zodiacSigns.find(z => {
            if (z.start[0] === z.end[0]) {
                return month === z.start[0] && day >= z.start[1] && day <= z.end[1];
            } else if (z.start[0] === 12 && z.end[0] === 1) {
                return (month === 12 && day >= z.start[1]) || (month === 1 && day <= z.end[1]);
            } else {
                return (month === z.start[0] && day >= z.start[1]) || (month === z.end[0] && day <= z.end[1]);
            }
        }) || zodiacSigns[0];

        return {
            years,
            months,
            days,
            totalDays,
            totalWeeks,
            totalMonths,
            totalHours,
            totalMinutes,
            totalSeconds,
            daysUntilBirthday,
            dayOfWeek,
            zodiac
        };
    }, [birthDate, toDate]);

    const formatNumber = (num) => num.toLocaleString();

    return (
        <div className="space-y-6">
            {/* Date Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        max={toDate}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        Calculate Age On
                    </label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>

            {result?.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                    {result.error}
                </div>
            )}

            {result && !result.error && (
                <>
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 text-center">
                        <p className="text-sm text-[var(--text-muted)] mb-2">Your age is</p>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <div>
                                <span className="text-5xl font-bold text-gradient">{result.years}</span>
                                <p className="text-sm text-[var(--text-muted)]">Years</p>
                            </div>
                            <div>
                                <span className="text-5xl font-bold text-gradient">{result.months}</span>
                                <p className="text-sm text-[var(--text-muted)]">Months</p>
                            </div>
                            <div>
                                <span className="text-5xl font-bold text-gradient">{result.days}</span>
                                <p className="text-sm text-[var(--text-muted)]">Days</p>
                            </div>
                        </div>
                    </div>

                    {/* Birthday Countdown */}
                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Cake size={24} className="text-pink-500" />
                            <span>Next Birthday</span>
                        </div>
                        <span className="text-lg font-bold text-pink-500">
                            {result.daysUntilBirthday === 0
                                ? "🎉 Today!"
                                : `${result.daysUntilBirthday} days away`}
                        </span>
                    </div>

                    {/* Detailed Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                            { label: 'Total Months', value: formatNumber(result.totalMonths) },
                            { label: 'Total Weeks', value: formatNumber(result.totalWeeks) },
                            { label: 'Total Days', value: formatNumber(result.totalDays) },
                            { label: 'Total Hours', value: formatNumber(result.totalHours) },
                            { label: 'Total Minutes', value: formatNumber(result.totalMinutes) },
                            { label: 'Total Seconds', value: formatNumber(result.totalSeconds) }
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-[var(--bg-tertiary)] rounded-xl p-4 text-center"
                            >
                                <p className="text-lg font-bold text-[var(--text-primary)]">{stat.value}</p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Fun Facts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                            <p className="text-sm text-[var(--text-muted)]">Born on a</p>
                            <p className="text-xl font-bold text-[var(--text-primary)]">{result.dayOfWeek}</p>
                        </div>
                        <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                            <p className="text-sm text-[var(--text-muted)]">Zodiac Sign</p>
                            <p className="text-xl font-bold text-[var(--text-primary)]">
                                {result.zodiac.emoji} {result.zodiac.sign}
                            </p>
                        </div>
                    </div>
                </>
            )}

            {!birthDate && (
                <div className="text-center py-12 text-[var(--text-muted)]">
                    <Clock size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Enter your date of birth to calculate your age</p>
                </div>
            )}
        </div>
    );
};

export default AgeCalculator;
