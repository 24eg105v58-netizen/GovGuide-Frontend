import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

const TextToSpeechPlayer = ({ text, language = 'en', autoPlay = false }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (autoPlay && text) {
      speakText();
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, autoPlay]);

  const speakText = () => {
    if (!('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // slightly slower for maximum clarity
    utterance.pitch = 1.0;

    let targetLangCode = 'en-IN';
    if (language === 'te') targetLangCode = 'te-IN';
    else if (language === 'hi') targetLangCode = 'hi-IN';

    utterance.lang = targetLangCode;

    // Pick best matching voice
    const matchedVoice = voices.find(
      (v) => v.lang === targetLangCode || v.lang.startsWith(targetLangCode.split('-')[0])
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!('speechSynthesis' in window)) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2">
      {isSpeaking ? (
        <button
          onClick={stopSpeaking}
          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors"
          title="Stop reading aloud"
        >
          <VolumeX className="w-4 h-4" />
          Stop Voice
        </button>
      ) : (
        <button
          onClick={speakText}
          className="px-3 py-1.5 bg-teal-100 hover:bg-teal-200 text-teal-800 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors"
          title="Listen to this aloud"
        >
          <Volume2 className="w-4 h-4" />
          Read Aloud
        </button>
      )}

      <button
        onClick={speakText}
        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        title="Repeat aloud"
        aria-label="Repeat aloud"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default TextToSpeechPlayer;
