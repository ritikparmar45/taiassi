import React, { useState, useEffect } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import Transcript from './components/Transcript';
import Suggestions from './components/Suggestions';
import Chat from './components/Chat';
import Settings from './components/Settings';
import { Settings as SettingsIcon, Download } from 'lucide-react';

function App() {
  const [transcriptSegments, setTranscriptSegments] = useState([]);
  const [suggestionBatches, setSuggestionBatches] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  const fullTranscript = transcriptSegments.map(s => s.text).join(' ');

  const handleExport = () => {
    const data = {
      transcript: transcriptSegments,
      suggestions: suggestionBatches,
      chat: chatHistory,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `twinmind-session-${new Date().getTime()}.json`;
    a.click();
  };

  return (
    <SettingsProvider>
      <div className="min-h-screen bg-background text-textMain p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse-slow"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">TwinMind <span className="text-primary italic">Live</span></h1>
              <p className="text-xs text-textDim uppercase tracking-widest font-semibold">AI Meeting Copilot</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="px-4 py-2 glass hover:bg-white/5 rounded-xl flex items-center gap-2 transition-all"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export Session</span>
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 glass hover:bg-white/5 rounded-xl transition-all"
            >
              <SettingsIcon size={24} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          <section className="lg:col-span-1 min-h-0 flex flex-col relative">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>
             <Transcript 
                transcriptSegments={transcriptSegments} 
                onNewSegment={(seg) => setTranscriptSegments(prev => [...prev, seg])} 
             />
          </section>

          <section className="lg:col-span-1 min-h-0">
             <Suggestions 
                fullTranscript={fullTranscript}
                suggestionBatches={suggestionBatches}
                onNewBatch={(batch) => setSuggestionBatches(prev => [batch, ...prev])}
             />
          </section>

          <section className="lg:col-span-1 min-h-0">
             <Chat 
                fullTranscript={fullTranscript}
                history={chatHistory}
                onUpdateHistory={setChatHistory}
             />
          </section>
        </main>

        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      </div>
    </SettingsProvider>
  );
}

export default App;
