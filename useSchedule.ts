
import { useState, useEffect } from 'react';
import { ScheduleDay, ClassSession, DayOfWeek } from '../types';
import { SCHEDULE_DATA } from '../constants';

const STORAGE_KEY = 'chronosketch_schedule_v1';

export const useSchedule = () => {
    // Initialize state from local storage or default data
    const [scheduleData, setScheduleData] = useState<ScheduleDay[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to parse schedule from local storage', e);
        }
        return SCHEDULE_DATA;
    });

    // Persist to local storage whenever scheduleData changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleData));
    }, [scheduleData]);

    const addClass = (day: DayOfWeek, newClass: ClassSession) => {
        setScheduleData(prev => prev.map(d => {
            if (d.day === day) {
                return {
                    ...d,
                    sessions: [...d.sessions, newClass]
                };
            }
            return d;
        }));
    };

    const removeClass = (day: DayOfWeek, classId: string) => {
        setScheduleData(prev => prev.map(d => {
            if (d.day === day) {
                return {
                    ...d,
                    sessions: d.sessions.filter(s => s.id !== classId)
                };
            }
            return d;
        }));
    };

    const resetSchedule = () => {
        setScheduleData(SCHEDULE_DATA);
    };

    return {
        scheduleData,
        addClass,
        removeClass,
        resetSchedule
    };
};
