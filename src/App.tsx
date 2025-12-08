
import React, { useState, useMemo } from 'react';
import { SCHEDULE_DATA, TIMER_URL, DAILY_QUOTES } from './constants';
import ScheduleList from './components/ScheduleList';
import TodoWidget from './components/TodoWidget';
import type { TodoItem, DayOfWeek } from './types';
import  { getCurrentDay, getDailyQuote } from './utils';
import { Calendar, Cpu, LayoutGrid, Clock, ExternalLink, Sparkles } from 'lucide-react';
<div className="bg-red-500 text-white p-4">
  TAILWIND TEST
</div>

const App: React.FC = () => {
  // Determine initial day based on real time, default to Monday if weekend
  const initialDay = getCurrentDay();
  const validDays: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const startDay = validDays.includes(initialDay as DayOfWeek) ? (initialDay as DayOfWeek) : 'Monday';

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(startDay);
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const currentSchedule = useMemo(() => 
    SCHEDULE_DATA.find(d => d.day === selectedDay) || SCHEDULE_DATA[0], 
  [selectedDay]);

  const dailyQuote = useMemo(() => getDailyQuote(DAILY_QUOTES), []);

  return (
    <div className="min-h-screen text-[#2D2D2D] overflow-x-hidden">
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl border-2 border-[#2D2D2D] shadow-[4px_4px_0_0_rgba(0,0,0,0.8)] rotate-[-2deg]">
               <LayoutGrid className="text-[#2D2D2D]" size={32} />
            </div>
            <div>
              <h1 className="text-5xl font-doodle font-bold text-[#2D2D2D] tracking-tighter">
                ChronoSketch
              </h1>
              <p className="text-gray-500 text-sm font-mono tracking-wider flex items-center gap-2 mt-1">
                <Cpu size={14} /> SYSTEM ONLINE // SEMESTER 02
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* Timer Button */}
            <a 
              href={TIMER_URL} 
              target="_blank" 
              rel="noreferrer"
              className="doodle-button px-6 py-3 bg-white flex items-center gap-2 font-bold text-[#2D2D2D] shadow-[3px_3px_0_0_#D1D1D1] hover:bg-[#F7F7F7]"
            >
              <Clock size={20} />
              <span>Timer</span>
              <ExternalLink size={16} className="opacity-50" />
            </a>
          </div>
        </header>

        {/* Navigation - Days */}
        <nav className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
          {SCHEDULE_DATA.map((dayData) => (
            <button
              key={dayData.day}
              onClick={() => setSelectedDay(dayData.day)}
              className={`px-6 py-3 font-bold transition-all duration-300 font-doodle text-xl border-2 rounded-lg doodle-button ${
                selectedDay === dayData.day
                  ? 'bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-[3px_3px_0_0_#D1D1D1] -translate-y-1 rotate-1'
                  : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400 hover:text-gray-800'
              }`}
            >
              {dayData.day.slice(0, 3)}
            </button>
          ))}
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Schedule Column */}
          <div className="lg:col-span-2">
            <div className="bg-[#ECECEC]/80 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 border-2 border-[#D1D1D1] relative">
               
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                   <h2 className="text-3xl font-bold flex items-center gap-3 text-[#2D2D2D] font-doodle">
                     <Calendar className="text-[#2D2D2D]" />
                     {selectedDay}
                   </h2>
                   <div className="text-xs font-mono font-bold text-[#2D2D2D] px-4 py-1.5 bg-white border-2 border-[#2D2D2D] rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                      {currentSchedule.sessions.length} CLASSES
                   </div>
                 </div>
                 
                 <ScheduleList schedule={currentSchedule} />
               </div>
            </div>
          </div>

          {/* Sidebar - Todo & Widgets */}
          <div className="lg:col-span-1 flex flex-col gap-6">
             <div className="flex-1">
                <TodoWidget 
                    todos={todos} 
                    setTodos={setTodos} 
                />
             </div>

             {/* Footer Info - Daily Quote */}
             <div className="text-center p-6 rounded-2xl border-2 border-dashed border-[#D1D1D1] text-[#2D2D2D] font-doodle bg-white/50 backdrop-blur-sm shadow-sm relative group hover:border-[#2D2D2D] transition-colors">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 border border-gray-200 rounded-full">
                  <Sparkles size={16} className="text-yellow-500" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans font-bold mb-3">Daily Wisdom</p>
                <p className="italic text-lg leading-relaxed">"{dailyQuote}"</p>
                <p className="text-xs font-bold text-gray-400 mt-3">— Mahabharata</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
