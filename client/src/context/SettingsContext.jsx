import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_api_key') || '');
  const [suggestionPrompt, setSuggestionPrompt] = useState(localStorage.getItem('suggestion_prompt') || '');
  const [chatPrompt, setChatPrompt] = useState(localStorage.getItem('chat_prompt') || '');
  const [interval, setIntervalTime] = useState(parseInt(localStorage.getItem('refresh_interval')) || 30);

  useEffect(() => {
    localStorage.setItem('groq_api_key', apiKey);
    localStorage.setItem('suggestion_prompt', suggestionPrompt);
    localStorage.setItem('chat_prompt', chatPrompt);
    localStorage.setItem('refresh_interval', interval);
  }, [apiKey, suggestionPrompt, chatPrompt, interval]);

  return (
    <SettingsContext.Provider value={{ 
      apiKey, setApiKey, 
      suggestionPrompt, setSuggestionPrompt, 
      chatPrompt, setChatPrompt,
      interval, setIntervalTime
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
