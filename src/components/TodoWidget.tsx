import React, { useState, useEffect, useCallback } from 'react';
import type { TodoItem } from '../types';
import { Plus, Trash2, CheckSquare, Square, Settings, RefreshCw, AlertCircle, HelpCircle} from 'lucide-react';

interface Props {
  todos: TodoItem[];
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
}

const TodoWidget: React.FC<Props> = ({ todos, setTodos }) => {
  const [newTodo, setNewTodo] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chronoTodos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    const savedUrl = localStorage.getItem('chronoSheetUrl');
    if (savedUrl) setSheetUrl(savedUrl);
  }, [setTodos]);

  // Save to local storage when todos change
  useEffect(() => {
    localStorage.setItem('chronoTodos', JSON.stringify(todos));
  }, [todos]);

  // Sync to Sheet Function
  const syncToSheet = useCallback(async (currentTodos: TodoItem[]) => {
    if (!sheetUrl) return;
    
    setIsSyncing(true);
    setSyncStatus('idle');

    try {
      // We use no-cors mode because Google Apps Scripts usually don't return proper CORS headers for simple POSTs 
      // unless specifically handled, but the data still gets sent.
      await fetch(sheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            todos: currentTodos
        }),
      });
      
      // Since 'no-cors' returns an opaque response, we assume success if no network error occurred.
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error("Sync failed", error);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  }, [sheetUrl]);

  // Auto-sync effect with debounce
  useEffect(() => {
    if (!sheetUrl) return;
    
    const timeoutId = setTimeout(() => {
       syncToSheet(todos);
    }, 2000); // Auto-sync 2 seconds after last change

    return () => clearTimeout(timeoutId);
  }, [todos, sheetUrl, syncToSheet]);

  const saveSettings = () => {
    localStorage.setItem('chronoSheetUrl', sheetUrl);
    setShowSettings(false);
    if(sheetUrl) syncToSheet(todos);
  };

  const handleAdd = (text: string = newTodo) => {
    if (!text.trim()) return;
    const item: TodoItem = {
      id: Date.now().toString() + Math.random(),
      text,
      completed: false,
      category: 'Personal',
      createdAt: Date.now(),
    };
    setTodos(prev => [item, ...prev]);
    if (text === newTodo) setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const setupCode = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var timestamp = data.timestamp;
  var todos = data.todos;
  
  // Format todos as a readable string
  var taskList = todos.map(function(t) {
    return (t.completed ? "[x] " : "[ ] ") + t.text;
  }).join("\\n");
  
  sheet.appendRow([timestamp, taskList]);
  
  return ContentService.createTextOutput("Success");
}`;

  return (
    <div className="bg-white border-2 border-[#2D2D2D] rounded-2xl p-6 h-full flex flex-col shadow-[8px_8px_0_0_#D1D1D1] relative overflow-hidden">
      
      {/* Notebook Holes Visual */}
      <div className="absolute top-0 left-0 w-full h-8 flex justify-evenly items-center border-b-2 border-gray-100 opacity-50 pointer-events-none">
          {[...Array(8)].map((_, i) => (
             <div key={i} className="w-3 h-3 rounded-full bg-[#F7F7F7] border border-gray-300 shadow-inner"></div>
          ))}
      </div>

      <div className="flex justify-between items-center mb-6 mt-4">
        <h2 className="text-2xl font-doodle text-[#2D2D2D] font-bold">Mission Log</h2>
        <div className="flex items-center gap-2">
            {/* Sync Indicator */}
            {sheetUrl && (
                <div title={syncStatus === 'error' ? 'Sync Failed' : isSyncing ? 'Syncing...' : 'Synced'} className="transition-all">
                    {isSyncing ? (
                        <RefreshCw size={16} className="text-blue-500 animate-spin" />
                    ) : syncStatus === 'error' ? (
                         <AlertCircle size={16} className="text-red-500" />
                    ) : (
                         <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                </div>
            )}
            <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-[#F7F7F7] rounded-full text-gray-500 transition-colors"
            title="Configure Google Sheet Sync"
            >
            <Settings size={20} />
            </button>
        </div>
      </div>

      {showSettings && (
          <div className="mb-4 p-4 bg-[#F7F7F7] rounded-xl border border-gray-300 text-sm animate-fadeIn relative z-20">
              <div className="flex justify-between items-center mb-2">
                 <label className="font-bold text-[#2D2D2D]">Google Apps Script URL</label>
                 <button onClick={() => setShowHelp(!showHelp)} className="text-blue-500 text-xs flex items-center gap-1">
                   <HelpCircle size={12} /> How to setup?
                 </button>
              </div>
              
              <input 
                 type="text" 
                 placeholder="https://script.google.com/macros/s/..." 
                 value={sheetUrl}
                 onChange={(e) => setSheetUrl(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded mb-2 font-mono text-xs"
              />
              <div className="flex justify-end gap-2">
                  <button onClick={() => setShowSettings(false)} className="px-3 py-1 text-gray-500">Cancel</button>
                  <button onClick={saveSettings} className="px-3 py-1 bg-[#2D2D2D] text-white rounded shadow-sm">Save & Sync</button>
              </div>

              {showHelp && (
                <div className="mt-3 p-3 bg-white border border-gray-200 rounded text-xs">
                   <p className="mb-2 font-bold">1. Create a Google Sheet</p>
                   <p className="mb-2">2. Extensions &gt; Apps Script. Paste this:</p>
                   <div className="bg-gray-100 p-2 rounded font-mono text-[10px] overflow-x-auto relative mb-2">
                      <pre>{setupCode}</pre>
                   </div>
                   <p className="mb-2">3. Click <b>Deploy &gt; New Deployment</b>.</p>
                   <p className="mb-2">4. Select type: <b>Web App</b>.</p>
                   <p className="mb-2">5. Set "Who has access" to <b>Anyone</b>.</p>
                   <p className="mb-2">6. Copy the URL and paste it above.</p>
                </div>
              )}
          </div>
      )}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="New directive..."
          className="flex-1 bg-[#F7F7F7] border border-[#D1D1D1] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#2D2D2D] focus:ring-1 focus:ring-[#2D2D2D] font-mono text-[#2D2D2D]"
        />
        <button 
          onClick={() => handleAdd()}
          className="bg-[#2D2D2D] hover:bg-black text-white p-2 rounded-lg transition-colors border-2 border-transparent"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {todos.length === 0 && (
          <div className="text-center text-gray-400 mt-10 font-doodle">
            No active directives.
          </div>
        )}
        {todos.map(todo => (
          <div 
            key={todo.id} 
            className={`group flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
              todo.completed 
                ? 'bg-[#F7F7F7] border-[#ECECEC] opacity-60' 
                : 'bg-white border-[#D1D1D1] hover:border-[#2D2D2D] shadow-[2px_2px_0_0_rgba(0,0,0,0.05)]'
            }`}
          >
            <button 
              onClick={() => toggleTodo(todo.id)}
              className={`transition-colors ${todo.completed ? 'text-green-600' : 'text-gray-400 hover:text-[#2D2D2D]'}`}
            >
              {todo.completed ? <CheckSquare size={20} /> : <Square size={20} />}
            </button>
            <span className={`flex-1 font-mono text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-[#2D2D2D]'}`}>
              {todo.text}
            </span>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-center text-gray-400 font-mono">
        {sheetUrl ? "SYNC: ACTIVE (G-SHEETS)" : "SYNC: LOCAL STORAGE ONLY"}
      </div>
    </div>
  );
};

export default TodoWidget;