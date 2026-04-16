import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import axios from 'axios';

const Transcript = ({ transcriptSegments, onNewSegment }) => {
  const { apiKey } = useSettings();
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Idle');
  const mediaRecorderRef = useRef(null);
  const scrollRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptSegments]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          processAudio(event.data);
        }
      };

      // The user wants 30s chunks. We can call requestData() every 30s.
      // Or we can just start(30000) which triggers ondataavailable every 30s.
      mediaRecorderRef.current.start(30000); 
      setIsRecording(true);
      setStatus('Recording');
    } catch (err) {
      console.error('Mic error:', err);
      setStatus('Error: Mic blocked');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setStatus('Idle');
    }
  };

  const processAudio = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'chunk.webm');

    try {
      const response = await axios.post('/api/transcribe', formData, {
        headers: {
          'Authorization': apiKey ? `Bearer ${apiKey}` : '',
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.text) {
        onNewSegment({
          text: response.data.text,
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now()
        });
      }
    } catch (err) {
      console.error('Transcription error:', err);
    }
  };

  return (
    <div className="panel-container glass flex flex-col h-full bg-panel/30">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm uppercase tracking-widest font-bold text-textDim">1. Mic & Transcript</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-textDim'}`}></span>
            <span className="text-xs font-medium text-textDim">{status}</span>
          </div>
        </div>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-4 rounded-2xl transition-all shadow-lg ${
            isRecording 
            ? 'bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30' 
            : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
          }`}
        >
          {isRecording ? <Square fill="currentColor" size={24} /> : <Mic size={24} />}
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 space-y-4 scroll-smooth"
      >
        {transcriptSegments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
             <div className="w-16 h-16 rounded-full border-2 border-dashed border-textDim mb-4 flex items-center justify-center">
                <Mic size={32} />
             </div>
             <p className="text-sm font-medium">Click the microphone to start transcribing your meeting.</p>
          </div>
        ) : (
          transcriptSegments.map((seg) => (
            <div key={seg.id} className="group animate-fade-in-up">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={12} className="text-textDim" />
                <span className="text-[10px] font-bold text-textDim tracking-tighter">{seg.timestamp}</span>
              </div>
              <p className="text-sm leading-relaxed text-textMain/90 group-hover:text-textMain transition-colors">
                {seg.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transcript;
