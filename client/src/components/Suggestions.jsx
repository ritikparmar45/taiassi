import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCcw, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Suggestions = ({ fullTranscript, suggestionBatches, onNewBatch }) => {
  const { apiKey, suggestionPrompt, interval } = useSettings();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interval);
  const timerRef = useRef(null);

  const fetchSuggestions = async () => {
    if (!apiKey || !fullTranscript || loading) return;
    
    setLoading(true);
    try {
      // Use only recent transcript part for efficiency
      const recentTranscript = fullTranscript.slice(-2000); 
      
      const response = await axios.post('/api/suggest', {
        transcript: recentTranscript,
        customPrompt: suggestionPrompt
      }, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });

      if (response.data.suggestions) {
        onNewBatch({
          items: response.data.suggestions,
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now()
        });
      }
    } catch (err) {
      console.error('Suggestions error:', err);
    } finally {
      setLoading(false);
      setTimeLeft(interval);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      fetchSuggestions();
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="panel-container glass flex flex-col h-full bg-accent/5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm uppercase tracking-widest font-bold text-textDim flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            2. Live Suggestions
          </h2>
          <p className="text-[10px] text-textDim font-bold mt-1 uppercase tracking-tighter">
            {suggestionBatches.length} Batches Generated
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
             <p className="text-[10px] text-textDim font-bold uppercase tracking-tighter">Auto-refresh in</p>
             <p className="text-sm font-mono font-bold text-accent">{timeLeft}s</p>
          </div>
          <button
            onClick={fetchSuggestions}
            disabled={loading}
            className={`p-3 rounded-xl transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/10 text-accent border border-accent/30'}`}
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8 scroll-smooth">
        {suggestionBatches.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
             <div className="w-16 h-16 rounded-full border-2 border-dashed border-accent/50 mb-4 flex items-center justify-center">
                <Sparkles size={32} className="text-accent" />
             </div>
             <p className="text-sm font-medium">Suggestions appear here once recording starts.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {suggestionBatches.map((batch, index) => (
              <motion.div 
                key={batch.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: index === 0 ? 1 : 0.4, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-bold text-textDim uppercase tracking-tighter">Batch {suggestionBatches.length - index} — {batch.timestamp}</span>
                   {index === 0 && <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">New</span>}
                </div>
                {batch.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => window.dispatchEvent(new CustomEvent('suggestion-click', { detail: item }))}
                    className="w-full text-left p-4 rounded-2xl glass hover:bg-white/5 border border-white/10 group transition-all hover:translate-x-1"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-textMain group-hover:text-primary transition-colors">
                        {item}
                      </p>
                      <ArrowRight size={16} className="text-textDim group-hover:text-primary transition-all shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
