import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import axios from 'axios';

const Chat = ({ fullTranscript, history, onUpdateHistory }) => {
  const { apiKey, chatPrompt } = useSettings();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  useEffect(() => {
    const handleSuggestionClick = (e) => {
      handleSend(e.detail);
    };
    window.addEventListener('suggestion-click', handleSuggestionClick);
    return () => window.removeEventListener('suggestion-click', handleSuggestionClick);
  }, [fullTranscript, history, apiKey]);

  const handleSend = async (messageText) => {
    const text = messageText || input;
    if (!text.trim() || !apiKey || loading) return;

    const newMessage = { role: 'user', content: text };
    const updatedHistory = [...history, newMessage];
    onUpdateHistory(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          message: text,
          transcript: fullTranscript,
          history: history,
          customPrompt: chatPrompt,
          stream: true
        })
      });

      const assistantMessage = { role: 'assistant', content: '' };
      onUpdateHistory([...updatedHistory, assistantMessage]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              assistantContent += data.content;
              onUpdateHistory([...updatedHistory, { role: 'assistant', content: assistantContent }]);
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-container glass flex flex-col h-full bg-secondary/5">
      <div className="mb-6">
        <h2 className="text-sm uppercase tracking-widest font-bold text-textDim flex items-center gap-2">
          <Bot size={16} className="text-secondary" />
          3. Chat (Detailed Answers)
        </h2>
        <p className="text-[10px] text-textDim font-bold mt-1 uppercase tracking-tighter">Session-Only Memory</p>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 space-y-6 scroll-smooth"
      >
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
             <div className="w-16 h-16 rounded-full border-2 border-dashed border-secondary/50 mb-4 flex items-center justify-center">
                <Bot size={32} className="text-secondary" />
             </div>
             <p className="text-sm font-medium">Click a suggestion or ask a question to start the conversation.</p>
          </div>
        ) : (
          history.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-2">
                {msg.role === 'assistant' ? <Bot size={12} className="text-secondary" /> : <User size={12} className="text-primary" />}
                <span className="text-[10px] font-bold uppercase tracking-widest text-textDim">{msg.role}</span>
              </div>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-primary/20 text-primary border border-primary/20 rounded-tr-none' 
                : 'bg-white/5 border border-white/10 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center gap-2 text-textDim animate-pulse">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs font-medium">TwinMind is thinking...</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask anything about the meeting..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-textDim/50"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-2.5 bg-primary text-white rounded-xl hover:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
