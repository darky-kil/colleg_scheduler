import React, { useMemo } from 'react';
import type { ScheduleDay, ClassSession } from '../types';
import { SUBJECT_COLORS } from '../constants';
import { timeToMinutes, getDurationString } from '../utils';
import { Coffee, ArrowRight } from 'lucide-react';

interface Props {
  schedule: ScheduleDay;
}

const ScheduleList: React.FC<Props> = ({ schedule }) => {
  const sortedSessions = useMemo(() => {
    return [...schedule.sessions].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [schedule]);

  const timelineItems = useMemo(() => {
    const items: (ClassSession | { isBreak: true; duration: number; startTime: string; endTime: string })[] = [];
    
    for (let i = 0; i < sortedSessions.length; i++) {
      items.push(sortedSessions[i]);
      
      if (i < sortedSessions.length - 1) {
        const currentEnd = timeToMinutes(sortedSessions[i].endTime);
        const nextStart = timeToMinutes(sortedSessions[i + 1].startTime);
        
        // Only show break if it is longer than 5 minutes
        if (nextStart > currentEnd + 5) {
          items.push({
            isBreak: true,
            duration: nextStart - currentEnd,
            startTime: sortedSessions[i].endTime,
            endTime: sortedSessions[i + 1].startTime
          });
        }
      }
    }
    return items;
  }, [sortedSessions]);

  const getStyle = (subject: string, type: string) => {
    if (type === 'Lab') return SUBJECT_COLORS['Lab'];
    return SUBJECT_COLORS[subject] || 'border-gray-500 bg-white text-gray-700';
  };

  return (
    <div className="relative space-y-6 pl-4">
      {/* Vertical Timeline Line */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[#D1D1D1] doodle-border"></div>

      {timelineItems.length === 0 ? (
        <div className="text-center py-10 text-gray-500 font-doodle text-xl">
          No classes today! Enjoy your freedom.
        </div>
      ) : (
        timelineItems.map((item, idx) => {
          if ('isBreak' in item) {
            return (
              <div key={`break-${idx}`} className="relative pl-8 animate-fadeIn">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#2D2D2D] rounded-full z-10"></div>
                
                <div className="p-4 border-2 border-dashed border-gray-400 rounded-xl bg-white/50 backdrop-blur-sm flex items-center gap-4 hover:border-[#2D2D2D] transition-colors">
                  <div className="p-2 bg-[#ECECEC] rounded-lg text-[#2D2D2D] border border-gray-300">
                    <Coffee size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-mono tracking-wider">BREAK DETECTED</p>
                    <p className="text-[#2D2D2D] font-bold text-lg font-doodle">
                      {getDurationString(item.duration)} Free Time
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.startTime} - {item.endTime}
                    </p>
                  </div>
                </div>
              </div>
            );
          } else {
            const style = getStyle(item.subject, item.type);
            return (
              <div key={item.id} className="relative pl-8 group animate-slideIn">
                {/* Timeline Dot */}
                <div className={`absolute left-2 top-8 w-4 h-4 bg-[#2D2D2D] border-2 border-white rounded-full z-10 group-hover:scale-125 transition-transform shadow-[0_0_0_4px_rgba(255,255,255,0.5)]`}></div>
                
                <div className={`doodle-box p-5 border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${style}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold font-doodle tracking-wide">{item.subject}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-current bg-white/50 mt-1 inline-block">
                        {item.type}
                      </span>
                    </div>
                    <div className="text-right">
                       <div className="text-2xl font-bold font-mono opacity-90">{item.startTime}</div>
                       <div className="text-xs opacity-60 flex items-center justify-end gap-1 font-bold">
                         <ArrowRight size={12} />
                         {item.endTime}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })
      )}
    </div>
  );
};

export default ScheduleList;