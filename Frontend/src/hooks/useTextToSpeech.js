// src/hooks/useTextToSpeech.js
import { useEffect, useRef } from 'react';

export const useTextToSpeech = (text, autoSpeak = true) => {
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    if (!text || !autoSpeak) return;

    // Cancel any existing speech
    if (utteranceRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Configure speech settings
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    // Get available voices and select a good one
    const getVoices = () => {
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang === 'en-US' && 
        (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Premium'))
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    };

    // Try to get voices immediately, or wait for them to load
    getVoices();
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = getVoices;
    }

    // Error handling
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };

    utterance.onend = () => {
      utteranceRef.current = null;
    };

    // Speak the text
    console.log('Speaking text:', text);
    speechSynthesis.speak(utterance);

    // Cleanup function
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
        utteranceRef.current = null;
      }
    };
  }, [text, autoSpeak]);

  // Return a function to manually stop speech
  const stopSpeech = () => {
    if (utteranceRef.current) {
      speechSynthesis.cancel();
      utteranceRef.current = null;
    }
  };

  return { stopSpeech };
};
