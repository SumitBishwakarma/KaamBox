import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Users, Calculator } from 'lucide-react';

const MeetingCostCalculator = () => {
    const [attendees, setAttendees] = useState(5);
    const [duration, setDuration] = useState(60);
    const [avgSalary, setAvgSalary] = useState(50000);

    const calculateCost = () => {
        const hourlyRate = avgSalary / (52 * 40); // Annual salary / (weeks * hours)
        const durationHours = duration / 60;
        return hourlyRate * durationHours * attendees;
    };

    const meetingCost = calculateCost();
    const perPerson = meetingCost / attendees;
    const perMinute = meetingCost / duration;

    const durationPresets = [15, 30, 45, 60, 90, 120];

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Meeting Cost Calculator</h2>
                <p className="text-[var(--text-muted)] text-sm">Calculate the true cost of meetings</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Number of Attendees</label>
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setAttendees(Math.max(1, attendees - 1))}
                            className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] text-2xl font-bold"
                        >
                            -
                        </motion.button>
                        <div className="flex-1 text-center">
                            <span className="text-4xl font-bold">{attendees}</span>
                            <Users className="inline-block ml-2 w-6 h-6 text-[var(--text-muted)]" />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setAttendees(attendees + 1)}
                            className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] text-2xl font-bold"
                        >
                            +
                        </motion.button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Meeting Duration: {duration} minutes</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {durationPresets.map(d => (
                            <button
                                key={d}
                                onClick={() => setDuration(d)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${duration === d ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {d}m
                            </button>
                        ))}
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="240"
                        step="5"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Average Annual Salary</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                            type="number"
                            value={avgSalary}
                            onChange={(e) => setAvgSalary(parseFloat(e.target.value) || 0)}
                            className="input w-full pl-10 text-xl"
                        />
                    </div>
                    <div className="flex gap-2 mt-2">
                        {[40000, 60000, 80000, 100000, 150000].map(s => (
                            <button
                                key={s}
                                onClick={() => setAvgSalary(s)}
                                className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded hover:bg-[var(--bg-secondary)]"
                            >
                                ${(s / 1000)}k
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl text-center"
                >
                    <p className="text-sm text-[var(--text-muted)] mb-2">This Meeting Costs</p>
                    <p className="text-5xl font-bold text-red-400">${meetingCost.toFixed(2)}</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                        <p className="text-xl font-bold">${perPerson.toFixed(2)}</p>
                        <p className="text-xs text-[var(--text-muted)]">Per Person</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                        <p className="text-xl font-bold">${perMinute.toFixed(2)}</p>
                        <p className="text-xs text-[var(--text-muted)]">Per Minute</p>
                    </div>
                </div>

                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <p className="text-sm font-medium mb-2">💡 Meeting Tips</p>
                    <ul className="text-xs text-[var(--text-muted)] space-y-1">
                        <li>• Every 10 min less = ${(perMinute * 10).toFixed(2)} saved</li>
                        <li>• One less attendee = ${(meetingCost / attendees).toFixed(2)} saved</li>
                        <li>• Consider async alternatives for updates</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MeetingCostCalculator;
