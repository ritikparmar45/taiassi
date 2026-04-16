import React from 'react';
import { X, Save, Key, MessageSquare, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Settings = ({ onClose }) => {
  const { 
    apiKey, setApiKey, 
    suggestionPrompt, setSuggestionPrompt, 
    chatPrompt, setChatPrompt,
    interval, setIntervalTime
  } = useSettings();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-panel border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/2">
          <div className="flex items-center gap-3">
             <div className="p-2 glass text-primary rounded-lg">
                <Clock size={20} />
             </div>
             <h2 className="text-lg font-bold">App Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-textDim transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* API Key Section */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-textDim flex items-center gap-2">
               <Key size={14} />
               Groq API Key
            </label>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-textDim/30"
            />
            <p className="text-[10px] text-textDim leading-relaxed">
              Your API key is stored locally in your browser and never sent to our servers beyond model inference requests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Refresh Interval */}
            <div className="space-y-4">
               <label className="text-xs font-bold uppercase tracking-widest text-textDim flex items-center gap-2">
                  <Clock size={14} />
                  Refresh Interval (s)
               </label>
               <input 
                 type="number"
                 value={interval}
                 onChange={(e) => setIntervalTime(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 transition-all"
               />
            </div>
          </div>

          {/* Prompts Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-textDim flex items-center gap-2">
                 <MessageSquare size={14} />
                 Suggestion Prompt
              </label>
              <textarea 
                value={suggestionPrompt}
                onChange={(e) => setSuggestionPrompt(e.target.value)}
                placeholder="Custom prompt for generating suggestions..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm h-32 focus:outline-none focus:border-primary/50 transition-all placeholder:text-textDim/30"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-textDim flex items-center gap-2">
                 <Bot size={14} />
                 Chat Prompt
              </label>
              <textarea 
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="Custom prompt for the chat assistant..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm h-32 focus:outline-none focus:border-primary/50 transition-all placeholder:text-textDim/30"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/2 border-t border-white/5 flex gap-4">
           <button 
             onClick={onClose}
             className="flex-1 py-4 glass hover:bg-white/5 rounded-2xl font-bold text-sm transition-all"
           >
             Close
           </button>
           <button 
             onClick={onClose}
             className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:translate-y-[-2px] hover:shadow-lg transition-all flex items-center justify-center gap-2"
           >
             <Save size={18} />
             Save Settings
           </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
