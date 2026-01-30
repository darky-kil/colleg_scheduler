
import React, { useState, useMemo } from 'react';
import { TIMER_URL, DAILY_QUOTES } from './constants';
import ScheduleList from './components/ScheduleList';
import TodoWidget from './components/TodoWidget';
import { TodoItem, DayOfWeek, ClassSession } from './types';
import { getCurrentDay, getDailyQuote } from './utils';
import { Calendar, Cpu, LayoutGrid, Clock, ExternalLink, Sparkles, Edit2, Check, Plus, X, Trash2 } from 'lucide-react';
import { useSchedule } from './hooks/useSchedule';

const App: React.FC = () => {
  // Determine initial day based on real time, default to Monday if weekend
  const initialDay = getCurrentDay();
  const validDays: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const startDay = validDays.includes(initialDay as DayOfWeek) ? (initialDay as DayOfWeek) : 'Monday';

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(startDay);
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const { scheduleData, addClass, removeClass, resetSchedule } = useSchedule();
  const [isEditing, setIsEditing] = useState(false);

  // New Class Form State
  const [newSubject, setNewSubject] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [newType, setNewType] = useState<'Lecture' | 'Lab'>('Lecture');

  const currentSchedule = useMemo(() =>
    scheduleData.find(d => d.day === selectedDay) || scheduleData[0],
    [selectedDay, scheduleData]);

  const dailyQuote = useMemo(() => getDailyQuote(DAILY_QUOTES), []);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newStartTime || !newEndTime) return;

    const newClass: ClassSession = {
      id: Date.now().toString(),
      subject: newSubject,
      startTime: newStartTime,
      endTime: newEndTime,
      type: newType
    };

    addClass(selectedDay, newClass);
    // Reset form fields
    setNewSubject('');
    setNewStartTime('');
    setNewEndTime('');
  };

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
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`doodle-button px-6 py-3 flex items-center gap-2 font-bold shadow-[3px_3px_0_0_#D1D1D1] transition-all ${isEditing
                  ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
                  : 'bg-white text-[#2D2D2D] border-gray-300 hover:bg-[#F7F7F7]'
                }`}
            >
              {isEditing ? <Check size={20} /> : <Edit2 size={20} />}
              <span>{isEditing ? 'Done Editing' : 'Edit Schedule'}</span>
            </button>

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
          {scheduleData.map((dayData) => (
            <button
              key={dayData.day}
              onClick={() => setSelectedDay(dayData.day)}
              className={`px-6 py-3 font-bold transition-all duration-300 font-doodle text-xl border-2 rounded-lg doodle-button ${selectedDay === dayData.day
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

            {/* Edit Mode Bar */}
            {isEditing && (
              <div className="mb-8 bg-white p-6 rounded-2xl border-2 border-[#2D2D2D] shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] animate-slideIn">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold font-doodle text-xl flex items-center gap-2">
                    <Edit2 size={18} /> Add New Class to {selectedDay}
                  </h3>
                  <button
                    onClick={resetSchedule}
                    className="text-xs text-red-500 hover:text-red-700 underline font-mono"
                  >
                    Reset to Default
                  </button>
                </div>

                <form onSubmit={handleAddClass} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Subject</label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="e.g. Adv. Algorithms"
                      className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-[#2D2D2D] outline-none transition-colors font-doodle"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as 'Lecture' | 'Lab')}
                      className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-[#2D2D2D] outline-none transition-colors appearance-none font-doodle"
                    >
                      <option value="Lecture">Lecture</option>
                      <option value="Lab">Lab</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Start</label>
                    <input
                      type="time"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-[#2D2D2D] outline-none transition-colors font-mono text-sm"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">End</label>
                    <input
                      type="time"
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-[#2D2D2D] outline-none transition-colors font-mono text-sm"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-[#2D2D2D] text-white font-bold rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> Add
                    </button>
                  </div>
                </form>
              </div>
            )}

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

                <ScheduleList
                  schedule={currentSchedule}
                  isEditing={isEditing}
                  onDelete={(id) => removeClass(selectedDay, id)}
                />
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
